import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { 
  getGroupsByEditionId, 
  getUsersForGroupAssignment, 
  createGroupsWithMembers,
  deleteGroupsByEditionId,
  checkGroupsExistForEdition
} from "@/lib/supabase/database/group";
import { generateBalancedGroups, validateGroupAssignment } from "@/lib/utils/groupAssignment";
import { GroupAssignmentRequest } from "@/types/group";
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

    const groups = await getGroupsByEditionId(activeEdition.id, supabaseAdmin);
    
    return NextResponse.json({ groups });
  } catch (error) {
    console.error("Error fetching groups:", error);
    return NextResponse.json(
      { error: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: GroupAssignmentRequest = await request.json();
    const { selectedLeaderIds } = body;

    if (!selectedLeaderIds || selectedLeaderIds.length < 1) {
      return NextResponse.json(
        { error: "At least one leader is required" },
        { status: 400 }
      );
    }

    // Get the active edition automatically
    const activeEdition = await getActiveEdition();
    if (!activeEdition) {
      return NextResponse.json(
        { error: "No active edition found" },
        { status: 400 }
      );
    }
    const editionId = activeEdition.id;

    // Check if groups already exist for this edition
    const groupsExist = await checkGroupsExistForEdition(editionId, supabaseAdmin);
    if (groupsExist) {
      return NextResponse.json(
        { error: "Groups already exist for this edition. Delete them first to create new ones." },
        { status: 400 }
      );
    }

    // Get all users for the edition
    const allUsers = await getUsersForGroupAssignment(editionId, supabaseAdmin);
    
    if (allUsers.length === 0) {
      return NextResponse.json(
        { error: "No users found for this edition" },
        { status: 400 }
      );
    }

    // Validate that all selected leaders exist in the user list
    const allRegistrationIds = allUsers.map(u => u.registrationId).filter(id => id != null);
    const invalidLeaders = selectedLeaderIds.filter(id => !allRegistrationIds.includes(id));
    
    if (invalidLeaders.length > 0) {
      return NextResponse.json(
        { error: `Invalid leader IDs: ${invalidLeaders.join(", ")}` },
        { status: 400 }
      );
    }

    // Calculate dynamic group sizes based on total users
    const totalUsers = allUsers.length;
    const numGroups = selectedLeaderIds.length;
    const targetGroupSize = Math.floor(totalUsers / numGroups);
    
    // Calculate dynamic min/max group sizes
    const minGroupSize = Math.max(4, Math.floor(targetGroupSize * 0.8));
    const maxGroupSize = Math.min(15, Math.ceil(targetGroupSize * 1.2));
    
    // Generate balanced groups using all users
    const assignedGroups = generateBalancedGroups(allUsers, selectedLeaderIds, {
      minGroupSize,
      maxGroupSize,
      balanceGender: true,
      balanceAge: true // Enable age balancing for better age distribution
    });

    // Validate the assignment
    const validation = validateGroupAssignment(assignedGroups);
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          error: "Group assignment validation failed", 
          issues: validation.issues 
        },
        { status: 400 }
      );
    }

    // Create groups in database
    const groupsData = assignedGroups.map(group => ({
      name: group.name,
      leaderId: group.leaderId,
      memberIds: group.memberIds
    }));

    const createdGroups = await createGroupsWithMembers(editionId, groupsData, supabaseAdmin);

    return NextResponse.json({
      success: true,
      groups: createdGroups,
      message: `Successfully created ${createdGroups.length} groups`
    });

  } catch (error) {
    console.error("Error creating groups:", error);
    return NextResponse.json(
      { error: "Failed to create groups" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get the active edition automatically
    const activeEdition = await getActiveEdition();
    if (!activeEdition) {
      return NextResponse.json(
        { error: "No active edition found" },
        { status: 400 }
      );
    }

    const groups = await deleteGroupsByEditionId(activeEdition.id, supabaseAdmin);
    
    return NextResponse.json({ 
      success: true,
      message: "All groups deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting groups:", error);
    return NextResponse.json(
      { error: "Failed to delete groups" },
      { status: 500 }
    );
  }
}