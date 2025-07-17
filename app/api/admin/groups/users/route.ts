import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getUsersForGroupAssignment } from "@/lib/supabase/database/group";
import { getActiveEdition } from "@/lib/supabase/database/edition";

// Initialize Supabase client with service role key for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Get the active edition automatically
    const activeEdition = await getActiveEdition();
    if (!activeEdition) {
      return NextResponse.json(
        { error: "No active edition found" },
        { status: 400 }
      );
    }

    const users = await getUsersForGroupAssignment(activeEdition.id, supabaseAdmin);
    
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users for group assignment:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}