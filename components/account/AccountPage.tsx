"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabaseBrowserClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";
import { getActiveEdition } from "@/lib/supabase/database/edition";
import { Edition } from "@/types/edition";
import PendingUser from "./PendingUser";
import ConfirmedUser from "./ConfirmedUser";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AccountPage() {
  const { userData, loading, userRegistrationData } = useAuth();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [edition, setEdition] = useState<Edition | null>(null);
  const [editionLoading, setEditionLoading] = useState(true);

  // Fetch edition on mount
  useEffect(() => {
    async function fetchEdition() {
      try {
        const activeEdition = await getActiveEdition();
        setEdition(activeEdition);
      } catch (error) {
        console.error("Error fetching active edition:", error);
      } finally {
        setEditionLoading(false);
      }
    }

    fetchEdition();
  }, []);

  // Redirect to registration if no registration for current edition
  useEffect(() => {
    if (!loading && !editionLoading && userData && !userRegistrationData) {
      console.log("AccountPage - No registration found, redirecting to /inscrie-te");
      window.location.href = "/inscrie-te";
    }
  }, [loading, editionLoading, userData, userRegistrationData]);

  const handleLogout = async () => {
    console.log("Performing logout...");
    try {
      const { error } = await supabaseBrowserClient.auth.signOut();
      if (error) {
        console.error("Logout failed:", error);
        // Optionally show a user-facing error message here
      } else {
        console.log("Logout successful.");
        // The onAuthStateChange listener in AuthContext should handle redirect/UI update
      }
    } catch (err) {
      console.error("An unexpected error occurred during logout:", err);
      // Optionally show a user-facing error message here
    }
  };

  return (
    <div className="bg-background rounded-lg shadow-md p-8 min-h-[300px]">
      {" "}
      {/* Added min-height */}
      <div className="flex justify-between mb-6">
        <Link
          href="/"
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm"
        >
          HOME
        </Link>
        <button
          onClick={() => setLogoutDialogOpen(true)}
          className="px-4 py-2 bg-[#F87171] text-white rounded-md hover:bg-red-500 transition-colors text-sm"
        >
          LOGOUT
        </button>
      </div>
      {/* Logout Confirmation Dialog */}
      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Ești sigur că vrei să te deconectezi?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Dacă te deconectezi, va trebui să te autentifici din nou pentru a
              accesa contul tău.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600"
            >
              Deconectare
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Contul meu</h2>
      </div>
      {loading || editionLoading ? (
        <div className="flex justify-center items-center h-40">
          <LoadingSpinner />
        </div>
      ) : userData ? ( // Check if userData exists (implies user is logged in)
        <div className="text-gray-700">
          <p className="mb-4">Salut, {userData.name}!</p>

          {/* Use registration data from the hook to determine confirmation status */}
          {userRegistrationData?.isConfirmed && edition ? (
            <ConfirmedUser
              userRegistrationData={userRegistrationData}
              edition={edition}
            />
          ) : (
            // If no registration or not confirmed, show PendingUser
            <PendingUser userData={userData} />
          )}
        </div>
      ) : (
        <p className="text-center text-gray-500">Nu ești autentificat.</p> // Handle case where user is not logged in after loading
      )}
    </div>
  );
}
