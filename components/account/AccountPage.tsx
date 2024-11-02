"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";
import Link from "next/link";
import LoadingSpinner from "../ui/LoadingSpinner";
import PendingUser from "./PendingUser";
import ConfirmedUser from "./ConfirmedUser";
import { getUserData } from "@/firebase/database";

type UserData = {
  name: string;
  phone: string;
  isConfirmed: boolean;
};

export default function AccountPage() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const data = await getUserData(user.uid);
        setUserData(data as UserData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <LoadingSpinner />;
  }

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
          onClick={() => auth.signOut()}
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
