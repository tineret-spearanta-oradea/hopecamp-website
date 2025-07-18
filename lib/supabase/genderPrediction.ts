import { supabaseBrowserClient } from "./client";

export interface BatchGenderPredictionResult {
  totalUsers: number;
  successful: number;
  failed: number;
  details: Array<{
    userId: string;
    name: string;
    originalGender: string;
    predictedGender: string;
    confidence: number;
    updated: boolean;
    error?: string;
  }>;
}

export async function runBatchGenderPrediction(): Promise<BatchGenderPredictionResult | null> {
  try {
    console.log('Starting batch gender prediction...');
    
    const { data, error } = await supabaseBrowserClient.functions.invoke('predict-gender');

    if (error) {
      console.error('Error calling predict-gender function:', error);
      return null;
    }

    if (data?.success) {
      console.log('Batch gender prediction completed:', data.summary);
      return {
        totalUsers: data.summary.totalUsers,
        successful: data.summary.successful,
        failed: data.summary.failed,
        details: data.details
      };
    }

    return null;
  } catch (error) {
    console.error('Unexpected error in batch gender prediction:', error);
    return null;
  }
}

export async function predictAndUpdateGender(userId: string, name: string): Promise<{ gender: 'male' | 'female' | 'unknown'; confidence: number } | null> {
  // This function is now mainly for individual predictions during registration
  // The main batch processing is handled by the edge function
  try {
    // For individual predictions, we can still use the batch function
    // but it will process all users, not just the one requested
    const result = await runBatchGenderPrediction();
    
    if (result) {
      // Find the specific user in the results
      const userResult = result.details.find(detail => detail.userId === userId);
      if (userResult) {
        return {
          gender: userResult.predictedGender as 'male' | 'female' | 'unknown',
          confidence: userResult.confidence
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error in individual gender prediction:', error);
    return null;
  }
}