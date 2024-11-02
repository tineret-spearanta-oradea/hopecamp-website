import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, Timestamp } from "firebase/firestore";
import { User } from "@/types/user";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const usersQuery = query(collection(db, "users"));

    const unsubscribe = onSnapshot(
      usersQuery,
      (snapshot) => {
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
        setIsLoading(false);
      },
      (err) => {
        console.error("Error fetching users:", err);
        setError(err as Error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return {
    users,
    isLoading,
    error,
  };
}
