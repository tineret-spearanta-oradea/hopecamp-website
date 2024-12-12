import { useEffect, useState, useCallback } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { User } from "@/types/user";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const usersQuery = query(
        collection(db, "users"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(usersQuery);

      const usersData = snapshot.docs.map((doc) => {
        const data = doc.data();

        // Helper function to safely convert Firestore timestamps to Date objects
        const convertTimestamp = (timestamp: unknown) => {
          if (timestamp instanceof Timestamp) {
            return timestamp.toDate();
          }
          if (timestamp instanceof Date) {
            return timestamp;
          }
          return null;
        };

        return {
          uid: doc.id,
          ...data,
          // Convert timestamps to dates, with fallbacks
          createdAt: convertTimestamp(data.createdAt) || new Date(),
          updatedAt: convertTimestamp(data.updatedAt) || new Date(),
          startDate: convertTimestamp(data.startDate),
          endDate: convertTimestamp(data.endDate),
          // Ensure other fields have proper types
          name: data.name || "",
          email: data.email || "",
          isAdmin: Boolean(data.isAdmin),
          isSuperAdmin: Boolean(data.isSuperAdmin),
          isConfirmed: Boolean(data.isConfirmed),
          phone: data.phone || "",
          church: data.church || "",
          transport: data.transport || "",
          preferences: data.preferences || "",
          amountPaid: Number(data.amountPaid) || 0,
          payTaxTo: data.payTaxTo || "",
          age: Number(data.age) || 0,
          withFamilyMember: Boolean(data.withFamilyMember),
        } as User;
      });

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
