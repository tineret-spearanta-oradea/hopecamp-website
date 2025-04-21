"use client";

import { useState, useEffect } from "react";
import { columns } from "@/components/admin/users/columns";
import { DataTable } from "@/components/admin/users/data-table";
import { EditUserSheet } from "@/components/admin/users/edit-user-sheet";
import { useRegistrations } from "@/hooks/use-registrations";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";
import { UserProfile } from "@/types/userProfile";
import { updateUserData } from "@/lib/supabase/database/user"; // Import Supabase functions
import { UserDetailsDialog } from "@/components/admin/users/user-details-dialog";
import { DeleteUserDialog } from "@/components/admin/users/delete-user-dialog";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {RegistrationWithProfile} from "@/lib/supabase/database/registration";

export default function UsersPage() {
  const { toast } = useToast();
  const { userData: currentUser } = useAuth();
  const { registrations, isLoading, error, fetchRegistrations } = useRegistrations();
  const [selectedRegistration, setSelectedRegistration] = useState<RegistrationWithProfile | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRegistrationForDetails, setSelectedRegistrationForDetails] =
    useState<RegistrationWithProfile | null>(null);
  const [selectedUserForDelete, setSelectedUserForDelete] =
    useState<UserProfile | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const handleEditUser = (registration: RegistrationWithProfile | null) => {
    setSelectedRegistration(registration);
    setIsDrawerOpen(true);
  };

  const handleDeleteUser = async (user: UserProfile) => {
    if (!currentUser?.isSuperAdmin) return;
    setSelectedUserForDelete(user);
  };

  const handleConfirmDelete = async (userToDelete: UserProfile) => {
    if (!currentUser?.isSuperAdmin) {
       toast({
        title: "Eroare",
        description: "Nu aveți permisiunea de a șterge utilizatori.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/admin/delete-user?userId=${userToDelete.userId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      await fetchRegistrations(); // Refetch registrations after deletion
      toast({
        title: "Succes",
        description: "Participantul a fost șters cu succes.",
      });
      setSelectedUserForDelete(null); // Close the confirmation dialog

    } catch (error: any) {
      console.error("Failed to delete user:", error);
      toast({
        title: "Eroare",
        description:
          "Nu am putut șterge participantul. Te rugăm să încerci din nou.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUser = async (updatedUser: UserProfile) => {
    console.log("Updating user with Supabase:", updatedUser);
    try {
      setIsUpdating(true);

      await updateUserData(updatedUser);

      await fetchRegistrations(); // Refetch registrations after update

      toast({
        title: "Succes!",
        description: "Datele au fost actualizate cu succes.",
      });

      setIsDrawerOpen(false);
      setSelectedRegistration(null);
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

  const handleViewDetails = (user: RegistrationWithProfile) => {
    setSelectedRegistrationForDetails(user);
  };

  const handleExportCsv = () => {
    if (!registrations?.length) {
      toast({
        title: "Eroare",
        description: "Nu există date pentru export",
        variant: "destructive",
      });
      return;
    }

    // Define the fields to export (excluding sensitive or unnecessary data)
    const fields = [
      "name",
      "email",
      "phone",
      "church",
      "age",
      "transport",
      "payTaxTo",
      "amountPaid",
      "isConfirmed",
      "preferences",
      "withFamilyMember",
      "startDate",
      "endDate",
      "slopeActivity",
    ];

    // Create CSV header
    const csvData = [fields.join(",")];

    // Add user data
    registrations.forEach((user) => {
      const rowData = fields.map((field) => {
        const value = user[field as keyof UserProfile];
        if (value === undefined || value === null) return "";
        if (typeof value === "boolean") return value ? "Da" : "Nu";
        if (value instanceof Date) return value.toLocaleDateString("ro-RO");
        return String(value).replace(/,/g, "");
      });
      csvData.push(rowData.join(","));
    });

    // Create and download the file
    const csvContent = csvData.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const now = new Date();
    const filename = `Participanti_HC_${now.getDate()}-${
      now.getMonth() + 1
    }-${now.getFullYear()}_${now.getHours()}-${now.getMinutes()}.csv`;

    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Succes",
      description: "Lista a fost exportată cu succes",
    });
  };

  return (
    <div className="w-full max-w-[90vw] mx-auto py-10 overflow-hidden">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <Button
          onClick={handleExportCsv}
          className="flex  text-sm items-center gap-2"
          variant="outline"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-[450px] items-center justify-center">
          <LoadingSpinner transparentBg />
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
            data={registrations || []}
          />
        </div>
      )}

      {selectedRegistration && (
        <EditUserSheet
          registration={selectedRegistration}
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            setSelectedRegistration(null);
          }}
          onUpdate={handleUpdateUser}
          isSuperAdmin={currentUser?.isSuperAdmin}
          isUpdating={isUpdating}
        />
      )}

      {selectedRegistrationForDetails && (
        <UserDetailsDialog
          registration={selectedRegistrationForDetails}
          isOpen={!!selectedRegistrationForDetails}
          onClose={() => setSelectedRegistrationForDetails(null)}
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
