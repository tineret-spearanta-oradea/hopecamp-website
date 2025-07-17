import { supabaseBrowserClient } from "@/lib/supabase/client";
import { Group, GroupMember, GroupWithDetails, UserForGroupAssignment } from "@/types/group";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function getGroupsByEditionId(editionId: number, client?: SupabaseClient): Promise<GroupWithDetails[]> {
  const supabase = client || supabaseBrowserClient;
  
  try {
    const { data, error } = await supabase
      .from("groups")
      .select(`
        *,
        leader:registrations!leader_id (
          id,
          user_profiles!user_id (
            user_id,
            name,
            age,
            gender
          )
        ),
        group_members (
          user_id,
          registrations!user_id (
            id,
            user_profiles!user_id (
              user_id,
              name,
              age,
              gender
            )
          )
        )
      `)
      .eq("edition_id", editionId)
      .order("name");

    if (error) {
      console.error("Error fetching groups:", error);
      return [];
    }

    return (data || []).map(mapGroupWithDetails);
  } catch (error) {
    console.error("Unexpected error fetching groups:", error);
    return [];
  }
}

export async function getUsersForGroupAssignment(editionId: number, client?: SupabaseClient): Promise<UserForGroupAssignment[]> {
  const supabase = client || supabaseBrowserClient;
  
  try {
    const { data, error } = await supabase
      .from("registrations")
      .select(`
        id,
        user_id,
        user_profiles!user_id (
          user_id,
          name,
          age,
          gender
        ),
        is_confirmed
      `)
      .eq("edition_id", editionId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users for group assignment:", error);
      return [];
    }

    return (data || []).map((row: any) => ({
      userId: row.user_profiles.user_id,
      registrationId: row.id, // Registration ID from registrations table
      name: row.user_profiles.name,
      age: row.user_profiles.age,
      gender: row.user_profiles.gender || 'unknown',
      isConfirmed: row.is_confirmed
    }));
  } catch (error) {
    console.error("Unexpected error fetching users for group assignment:", error);
    return [];
  }
}

export async function checkGroupsExistForEdition(editionId: number, client?: SupabaseClient): Promise<boolean> {
  const supabase = client || supabaseBrowserClient;
  
  try {
    const { data, error } = await supabase
      .from("groups")
      .select("id")
      .eq("edition_id", editionId)
      .limit(1);

    if (error) {
      console.error("Error checking groups existence:", error);
      return false;
    }

    return (data || []).length > 0;
  } catch (error) {
    console.error("Unexpected error checking groups existence:", error);
    return false;
  }
}

export async function createGroupsWithMembers(
  editionId: number,
  groupsData: Array<{
    name: string;
    leaderId: number; // Now using registration ID
    memberIds: number[]; // Now using registration IDs
  }>,
  client?: SupabaseClient
): Promise<GroupWithDetails[]> {
  const supabase = client || supabaseBrowserClient;
  
  try {
    // Start a transaction-like operation
    const createdGroups: GroupWithDetails[] = [];

    for (const groupData of groupsData) {
      // Create the group
      const { data: groupResult, error: groupError } = await supabase
        .from("groups")
        .insert({
          edition_id: editionId,
          name: groupData.name,
          leader_id: groupData.leaderId
        })
        .select()
        .single();

      if (groupError) {
        console.error("Error creating group:", groupError);
        throw groupError;
      }

      // Create group members
      if (groupData.memberIds.length > 0) {
        const memberInserts = groupData.memberIds.map(registrationId => ({
          user_id: registrationId, // Now using registration ID
          group_id: groupResult.id
        }));

        const { error: membersError } = await supabase
          .from("group_members")
          .insert(memberInserts);

        if (membersError) {
          console.error("Error creating group members:", membersError);
          throw membersError;
        }
      }

      // Fetch the complete group data
      const { data: completeGroup, error: fetchError } = await supabase
        .from("groups")
        .select(`
          *,
          leader:registrations!leader_id (
            id,
            user_profiles!user_id (
              user_id,
              name,
              age,
              gender
            )
          ),
          group_members (
            user_id,
            registrations!user_id (
              id,
              user_profiles!user_id (
                user_id,
                name,
                age,
                gender
              )
            )
          )
        `)
        .eq("id", groupResult.id)
        .single();

      if (fetchError) {
        console.error("Error fetching complete group:", fetchError);
        throw fetchError;
      }

      createdGroups.push(mapGroupWithDetails(completeGroup));
    }

    return createdGroups;
  } catch (error) {
    console.error("Unexpected error creating groups:", error);
    throw error;
  }
}

export async function deleteGroupsByEditionId(editionId: number, client?: SupabaseClient): Promise<void> {
  const supabase = client || supabaseBrowserClient;
  
  try {
    // Delete groups (cascade will handle group_members)
    const { error } = await supabase
      .from("groups")
      .delete()
      .eq("edition_id", editionId);

    if (error) {
      console.error("Error deleting groups:", error);
      throw error;
    }
  } catch (error) {
    console.error("Unexpected error deleting groups:", error);
    throw error;
  }
}

export async function removeUserFromGroup(registrationId: number, client?: SupabaseClient): Promise<void> {
  const supabase = client || supabaseBrowserClient;
  
  try {
    const { error } = await supabase
      .from("group_members")
      .delete()
      .eq("user_id", registrationId);

    if (error) {
      console.error("Error removing user from group:", error);
      throw error;
    }
  } catch (error) {
    console.error("Unexpected error removing user from group:", error);
    throw error;
  }
}

export async function addUserToGroup(registrationId: number, groupId: number, client?: SupabaseClient): Promise<void> {
  const supabase = client || supabaseBrowserClient;
  
  try {
    const { error } = await supabase
      .from("group_members")
      .insert({
        user_id: registrationId,
        group_id: groupId
      });

    if (error) {
      console.error("Error adding user to group:", error);
      throw error;
    }
  } catch (error) {
    console.error("Unexpected error adding user to group:", error);
    throw error;
  }
}

export async function getUnassignedUsers(editionId: number, client?: SupabaseClient): Promise<UserForGroupAssignment[]> {
  const supabase = client || supabaseBrowserClient;
  
  try {
    // Get all users, then filter out the assigned ones on the client side
    const allUsers = await getUsersForGroupAssignment(editionId, client);
    const groups = await getGroupsByEditionId(editionId, client);
    
    // Get all assigned registration IDs (both leaders and members)
    const assignedRegistrationIds = new Set<number>();
    
    groups.forEach(group => {
      // leaderId is stored as registration ID in the database
      assignedRegistrationIds.add(Number(group.leaderId));
      group.members.forEach(member => {
        // Find the registration ID for this member
        const userRegistration = allUsers.find(u => u.userId === member.userId);
        if (userRegistration) {
          assignedRegistrationIds.add(userRegistration.registrationId);
        }
      });
    });
    
    // Filter out assigned users
    const unassignedUsers = allUsers.filter(user => 
      !assignedRegistrationIds.has(user.registrationId)
    );
    
    return unassignedUsers;
  } catch (error) {
    console.error("Unexpected error fetching unassigned users:", error);
    return [];
  }
}

function mapGroupWithDetails(row: any): GroupWithDetails {
  const members = (row.group_members || []).map((member: any) => ({
    userId: member.registrations.user_profiles.user_id,
    registrationId: member.user_id, // This is the registration ID stored in group_members
    name: member.registrations.user_profiles.name,
    age: member.registrations.user_profiles.age,
    gender: member.registrations.user_profiles.gender || 'unknown' as 'male' | 'female' | 'unknown'
  }));

  // Calculate statistics
  const statistics = calculateGroupStatistics(members);

  return {
    id: row.id,
    editionId: row.edition_id,
    name: row.name,
    leaderId: row.leader_id,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    leader: {
      userId: row.leader.user_profiles.user_id,
      name: row.leader.user_profiles.name,
      age: row.leader.user_profiles.age,
      gender: row.leader.user_profiles.gender || 'unknown'
    },
    members,
    memberCount: members.length,
    statistics
  };
}

function calculateGroupStatistics(members: Array<{
  userId: string;
  registrationId: number;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'unknown';
}>): { totalMembers: number; genderDistribution: { male: number; female: number; unknown: number; }; averageAge: number; } {
  const genderDistribution = { male: 0, female: 0, unknown: 0 };
  let totalAge = 0;

  for (const member of members) {
    genderDistribution[member.gender]++;
    totalAge += member.age;
  }

  const averageAge = members.length > 0 ? Math.round(totalAge / members.length) : 0;

  return {
    totalMembers: members.length,
    genderDistribution,
    averageAge
  };
}