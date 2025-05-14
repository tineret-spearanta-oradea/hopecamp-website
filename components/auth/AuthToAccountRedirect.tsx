"use client";

import { useEffect } from "react";
import {redirect} from "next/navigation";
import {useAuth} from "@/contexts/auth-context";

export default function AuthToAccountRedirect({
  children,
}: {
  children: React.ReactNode;
}) {
  const { supabaseUser, loading } = useAuth();

  useEffect(() => {
    if (!loading && supabaseUser) {
      console.log("AuthToAccountRedirect - Existing user found! Redirecting to cont");
      redirect("/cont");
    }
  }, [supabaseUser, loading]);

  return <>{children}</>;
}
