"use client";

import { useState } from "react";
import { columns } from "@/components/admin/users/columns";
import { DataTable } from "@/components/admin/users/data-table";
import { EditUserSheet } from "@/components/admin/users/edit-user-sheet";
import { useUsers } from "@/hooks/use-users";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { User } from "@/types/user";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserDetailsDialog } from "@/components/admin/users/user-details-dialog";

export default function UsersPage() {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const { users, isLoading, error } = useUsers();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedUserForDetails, setSelectedUserForDetails] =
    useState<User | null>(null);

  const handleEditUser = (user: User | null) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleDeleteUser = async (user: User) => {
    if (!currentUser?.isSuperAdmin) return;

    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        await deleteDoc(doc(db, "users", user.uid));
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
      } catch (error) {
        console.error("Failed to delete user:", error);
        toast({
          title: "Error",
          description: "Failed to delete user. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      const userRef = doc(db, "users", updatedUser.uid);
      await updateDoc(userRef, {
        ...updatedUser,
        updatedAt: new Date(),
      });

      toast({
        title: "Success",
        description: "User updated successfully",
      });
    } catch (error) {
      console.error("Failed to update user:", error);
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (user: User) => {
    setSelectedUserForDetails(user);
  };

  if (isLoading) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[450px] items-center justify-center text-red-500">
        Error loading users: {error.message}
      </div>
    );
  }

  return (
    <div className="w-full max-w-[90vw] mx-auto py-10 overflow-hidden">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
      </div>

      <div className="overflow-x-auto">
        <DataTable
          columns={columns({
            onEdit: handleEditUser,
            onDelete: handleDeleteUser,
            onViewDetails: handleViewDetails,
            isSuperAdmin: currentUser?.isSuperAdmin,
          })}
          data={users || []}
        />
      </div>

      {selectedUser && (
        <EditUserSheet
          user={selectedUser}
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            setSelectedUser(null);
          }}
          onUpdate={handleUpdateUser}
          isSuperAdmin={currentUser?.isSuperAdmin}
        />
      )}

      {selectedUserForDetails && (
        <UserDetailsDialog
          user={selectedUserForDetails}
          isOpen={!!selectedUserForDetails}
          onClose={() => setSelectedUserForDetails(null)}
        />
      )}
    </div>
  );
}
