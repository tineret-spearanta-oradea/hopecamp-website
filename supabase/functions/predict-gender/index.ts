import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GenderPredictionResponse {
  gender: 'male' | 'female' | 'unknown';
  confidence: number;
}

interface BatchResult {
  userId: string;
  name: string;
  originalGender: string;
  predictedGender: string;
  confidence: number;
  updated: boolean;
  error?: string;
}

async function predictGenderWithGemini(name: string): Promise<GenderPredictionResponse> {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  
  if (!geminiApiKey) {
    console.error('GEMINI_API_KEY environment variable is not set');
    return { gender: 'unknown', confidence: 0 };
  }

  const prompt = `Given the name "${name}", predict the gender. Please respond with ONLY ONE of these words: "male", "female". No explanation needed. Just the single word.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            maxOutputTokens: 10,
          }
        })
      }
    );

    if (!response.ok) {
      console.error('Gemini API error:', response.status, response.statusText);
      return { gender: 'unknown', confidence: 0 };
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase();

    if (generatedText === 'male') {
      return { gender: 'male', confidence: 0.8 };
    } else if (generatedText === 'female') {
      return { gender: 'female', confidence: 0.8 };
    } else {
      return { gender: 'unknown', confidence: 0 };
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return { gender: 'unknown', confidence: 0 };
  }
}

async function updateUserGender(supabase: any, userId: string, gender: 'male' | 'female' | 'unknown') {
  const { error } = await supabase
    .from('user_profiles')
    .update({ 
      gender: gender,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);

  if (error) {
    console.error('Error updating user gender:', error);
    throw error;
  }
}

async function processAllUsersWithoutGender() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Get all users with gender = 'unknown'
  const { data: users, error } = await supabase
    .from('user_profiles')
    .select('user_id, name, gender')
    .eq('gender', 'unknown');

  if (error) {
    console.error('Error fetching users without gender:', error);
    throw error;
  }

  if (!users || users.length === 0) {
    console.log('No users found with unknown gender');
    return { totalUsers: 0, processedUsers: [], successful: 0, failed: 0 };
  }

  console.log(`Found ${users.length} users with unknown gender`);

  const results: BatchResult[] = [];
  let successful = 0;
  let failed = 0;

  // Process each user sequentially to avoid rate limiting
  for (const user of users) {
    console.log(`Waiting for 5 seconds before processing user ${user.user_id}: ${user.name}`);
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log(`Processing user ${user.user_id}: ${user.name}`);

    const result: BatchResult = {
      userId: user.user_id,
      name: user.name,
      originalGender: user.gender,
      predictedGender: 'unknown',
      confidence: 0,
      updated: false
    };

    try {
      console.log(`Processing user ${user.user_id}: ${user.name}`);
      
      // Predict gender using Gemini API
      const prediction = await predictGenderWithGemini(user.name);
      
      result.predictedGender = prediction.gender;
      result.confidence = prediction.confidence;
      
      console.log(`Prediction for ${user.name}:`, prediction);

      // Update user gender in database if prediction is confident
      if (prediction.confidence > 0.5) {
        await updateUserGender(supabase, user.user_id, prediction.gender);
        result.updated = true;
        successful++;
        console.log(`Updated user ${user.user_id} gender to: ${prediction.gender}`);
      } else {
        console.log(`Low confidence prediction for ${user.name}, not updating`);
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.error(`Error processing user ${user.user_id}:`, error);
      result.error = error instanceof Error ? error.message : 'Unknown error';
      failed++;
    }

    results.push(result);
  }

  return {
    totalUsers: users.length,
    processedUsers: results,
    successful,
    failed
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Starting batch gender prediction process...');
    
    const result = await processAllUsersWithoutGender();
    
    console.log(`Batch process completed:`, {
      total: result.totalUsers,
      successful: result.successful,
      failed: result.failed
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${result.totalUsers} users. Successfully updated ${result.successful} users, ${result.failed} failed.`,
        summary: {
          totalUsers: result.totalUsers,
          successful: result.successful,
          failed: result.failed
        },
        details: result.processedUsers
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in batch gender prediction function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});