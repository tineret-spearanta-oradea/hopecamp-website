import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { removeUserFromGroup } from "@/lib/supabase/database/group";

// Initialize Supabase client with service role key for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { registrationId } = body;

    if (!registrationId) {
      return NextResponse.json(
        { error: "Registration ID is required" },
        { status: 400 }
      );
    }

    await removeUserFromGroup(registrationId, supabaseAdmin);

    return NextResponse.json({
      success: true,
      message: "User removed from group successfully"
    });

  } catch (error) {
    console.error("Error removing user from group:", error);
    return NextResponse.json(
      { error: "Failed to remove user from group" },
      { status: 500 }
    );
  }
} 