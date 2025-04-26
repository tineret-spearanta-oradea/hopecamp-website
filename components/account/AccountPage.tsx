"use client";

import Link from "next/link";
import { supabaseBrowserClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";
import PendingUser from "./PendingUser";
import ConfirmedUser from "./ConfirmedUser";

export default function AccountPage() {
    const { userData } = useAuth();

    return (
        <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex justify-between mb-6">
                <Link
                    href="/"
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm"
                >
                    HOME
                </Link>
                <button
                    onClick={async () => {
                        console.log("Attempting to log out...");
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
                    }}
                    className="px-4 py-2 bg-[#F87171] text-white rounded-md hover:bg-red-500 transition-colors text-sm"
                >
                    LOGOUT
                </button>
            </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Contul meu</h2>
      </div>

      {userData && (
        <div className="text-gray-700">
          <p className="mb-4">Hello, {userData.name}!</p>

          {!userData.isConfirmed && <PendingUser userData={userData} />}
          {userData.isConfirmed && <ConfirmedUser userData={userData} />}
        </div>
      )}
    </div>
  );
}
