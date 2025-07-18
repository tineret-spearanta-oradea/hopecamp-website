import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { addUserToGroup } from "@/lib/supabase/database/group";

// Initialize Supabase client with service role key for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { registrationId, groupId } = body;

    if (!registrationId || !groupId) {
      return NextResponse.json(
        { error: "Registration ID and Group ID are required" },
        { status: 400 }
      );
    }

    await addUserToGroup(registrationId, groupId, supabaseAdmin);

    return NextResponse.json({
      success: true,
      message: "User assigned to group successfully"
    });

  } catch (error) {
    console.error("Error assigning user to group:", error);
    return NextResponse.json(
      { error: "Failed to assign user to group" },
      { status: 500 }
    );
  }
} 