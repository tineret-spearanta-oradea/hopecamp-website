import { useState, useCallback } from "react";
import { GroupWithDetails, UserForGroupAssignment } from "@/types/group";
import { toast } from "sonner";

export function useGroups() {
  const [groups, setGroups] = useState<GroupWithDetails[]>([]);
  const [availableUsers, setAvailableUsers] = useState<UserForGroupAssignment[]>([]);
  const [unassignedUsers, setUnassignedUsers] = useState<UserForGroupAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasGroups, setHasGroups] = useState(false);

  const loadGroupsForEdition = useCallback(async (editionId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/groups`);
      const data = await response.json();

      if (response.ok) {
        if (data.groups && data.groups.length > 0) {
          setGroups(data.groups);
          setHasGroups(true);
          setAvailableUsers([]);
          // Load unassigned users when groups exist
          await loadUnassignedUsers(editionId);
        } else {
          setGroups([]);
          setHasGroups(false);
          setUnassignedUsers([]);
          // Load available users for group assignment
          await loadAvailableUsers(editionId);
        }
      } else {
        toast.error(data.error || "Eșuarea încărcării grupurilor");
      }
    } catch (error) {
      console.error("Error loading groups:", error);
      toast.error("Eșuarea încărcării grupurilor");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadAvailableUsers = useCallback(async (editionId: number) => {
    try {
      const response = await fetch(`/api/admin/groups/users`);
      const data = await response.json();

      if (response.ok) {
        setAvailableUsers(data.users || []);
      } else {
        toast.error(data.error || "Eșuarea încărcării utilizatorilor");
      }
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Eșuarea încărcării utilizatorilor");
    }
  }, []);

  const loadUnassignedUsers = useCallback(async (editionId: number) => {
    try {
      const response = await fetch(`/api/admin/groups/unassigned`);
      const data = await response.json();

      if (response.ok) {
        setUnassignedUsers(data.users || []);
      } else {
        toast.error(data.error || "Eșuarea încărcării utilizatorilor neasignați");
      }
    } catch (error) {
      console.error("Error loading unassigned users:", error);
      toast.error("Eșuarea încărcării utilizatorilor neasignați");
    }
  }, []);

  const generateGroups = useCallback(async (editionId: number, selectedLeaderIds: number[]) => {
    if (selectedLeaderIds.length < 1) {
      toast.error("Please select at least one leader");
      return false;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedLeaderIds,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Groups generated successfully!");
        setGroups(data.groups);
        setHasGroups(true);
        setAvailableUsers([]);
        await loadUnassignedUsers(editionId);
        return true;
      } else {
        toast.error(data.error || "Failed to generate groups");
        return false;
      }
    } catch (error) {
      console.error("Error generating groups:", error);
      toast.error("Failed to generate groups");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [loadUnassignedUsers]);

  const deleteGroups = useCallback(async (editionId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/groups`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Groups deleted successfully!");
        setGroups([]);
        setHasGroups(false);
        setUnassignedUsers([]);
        await loadAvailableUsers(editionId);
        return true;
      } else {
        toast.error(data.error || "Failed to delete groups");
        return false;
      }
    } catch (error) {
      console.error("Error deleting groups:", error);
      toast.error("Failed to delete groups");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [loadAvailableUsers]);

  const removeUserFromGroup = useCallback(async (registrationId: number, editionId: number) => {
    try {
      const response = await fetch('/api/admin/groups/remove-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ registrationId }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("User removed from group successfully!");
        await loadGroupsForEdition(editionId);
        return true;
      } else {
        toast.error(data.error || "Failed to remove user from group");
        return false;
      }
    } catch (error) {
      console.error("Error removing user from group:", error);
      toast.error("Failed to remove user from group");
      return false;
    }
  }, [loadGroupsForEdition]);

  const assignUserToGroup = useCallback(async (registrationId: number, groupId: number, editionId: number) => {
    try {
      const response = await fetch('/api/admin/groups/assign-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ registrationId, groupId }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("User assigned to group successfully!");
        await loadGroupsForEdition(editionId);
        return true;
      } else {
        toast.error(data.error || "Failed to assign user to group");
        return false;
      }
    } catch (error) {
      console.error("Error assigning user to group:", error);
      toast.error("Failed to assign user to group");
      return false;
    }
  }, [loadGroupsForEdition]);

  return {
    groups,
    availableUsers,
    unassignedUsers,
    isLoading,
    hasGroups,
    loadGroupsForEdition,
    generateGroups,
    deleteGroups,
    removeUserFromGroup,
    assignUserToGroup,
  };
}