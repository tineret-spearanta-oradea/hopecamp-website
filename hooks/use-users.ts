import { useState, useCallback } from "react";
import { UserProfile } from "@/types/userProfile";
import {getAllUsersData} from "@/lib/supabase/database/user";

export function useUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const usersData=await getAllUsersData();
      setUsers(usersData);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    users,
    isLoading,
    error,
    fetchUsers,
    refetch: fetchUsers, // alias for clarity when manually refetching
  };
}
