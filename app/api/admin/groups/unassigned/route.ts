import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getUnassignedUsers } from "@/lib/supabase/database/group";
import { getActiveEdition } from "@/lib/supabase/database/edition";

export const dynamic = 'force-dynamic';
export const revalidate = 0; 

// Initialize Supabase client with service role key for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Get the active edition automatically
    const activeEdition = await getActiveEdition();
    if (!activeEdition) {
      const response = NextResponse.json(
        { error: "No active edition found" },
        { status: 400 }
      );
      response.headers.set(
        'Cache-Control',
        'no-store, max-age=0, no-cache, must-revalidate'
      );
      response.headers.delete('ETag');
      return response;
    }

    const users = await getUnassignedUsers(activeEdition.id, supabaseAdmin);
    
    const response = NextResponse.json({ users });
    response.headers.set(
      'Cache-Control',
      'no-store, max-age=0, no-cache, must-revalidate'
    );
    response.headers.delete('ETag');
    return response;
  } catch (error) {
    console.error("Error fetching unassigned users:", error);
    const response = NextResponse.json(
      { error: "Failed to fetch unassigned users" },
      { status: 500 }
    );
    response.headers.set(
      'Cache-Control',
      'no-store, max-age=0, no-cache, must-revalidate'
    );
    response.headers.delete('ETag');   
    return response;
  }
} 