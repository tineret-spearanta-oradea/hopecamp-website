"use client";

import { useState, useEffect } from "react";
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
import { DeleteUserDialog } from "@/components/admin/users/delete-user-dialog";

export default function UsersPage() {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const { users, isLoading, error, fetchUsers } = useUsers();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedUserForDetails, setSelectedUserForDetails] =
    useState<User | null>(null);
  const [selectedUserForDelete, setSelectedUserForDelete] =
    useState<User | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEditUser = (user: User | null) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleDeleteUser = async (user: User) => {
    if (!currentUser?.isSuperAdmin) return;
    setSelectedUserForDelete(user);
  };

  const handleConfirmDelete = async (user: User) => {
    try {
      await deleteDoc(doc(db, "users", user.uid));
      await fetchUsers();
      toast({
        title: "Succes",
        description: "Participantul a fost șters cu succes",
      });
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast({
        title: "Eroare",
        description:
          "Nu am putut șterge participantul. Te rugăm să încerci din nou.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUser = async (updatedUser: User) => {
    console.log("Updating user:", updatedUser);
    try {
      setIsUpdating(true);
      const userRef = doc(db, "users", updatedUser.uid);

      const cleanedUser = Object.fromEntries(
        Object.entries(updatedUser).filter(([_, v]) => v !== undefined)
      );

      await updateDoc(userRef, {
        ...cleanedUser,
        updatedAt: new Date(),
      });

      await fetchUsers();

      toast({
        title: "Succes!",
        description: "Datele au fost actualizate cu succes.",
      });

      setIsDrawerOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to update user:", error);
      toast({
        title: "Eroare",
        description:
          "Nu am putut actualiza datele. Te rugăm să încerci din nou.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleViewDetails = (user: User) => {
    setSelectedUserForDetails(user);
  };

  return (
    <div className="w-full max-w-[90vw] mx-auto py-10 overflow-hidden">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
      </div>

      {isLoading ? (
        <div className="flex h-[450px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="flex h-[450px] items-center justify-center text-red-500">
          Error loading users: {error.message}
        </div>
      ) : (
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
      )}

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
          isUpdating={isUpdating}
        />
      )}

      {selectedUserForDetails && (
        <UserDetailsDialog
          user={selectedUserForDetails}
          isOpen={!!selectedUserForDetails}
          onClose={() => setSelectedUserForDetails(null)}
        />
      )}

      {selectedUserForDelete && (
        <DeleteUserDialog
          user={selectedUserForDelete}
          isOpen={!!selectedUserForDelete}
          onClose={() => setSelectedUserForDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
