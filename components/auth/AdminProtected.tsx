"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "../ui/LoadingSpinner";

export default function AdminProtected({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're done loading and either there's no user or user is not admin
    if (!loading) {
      if (!user || (!user.isAdmin && !user.isSuperAdmin)) {
        router.replace("/cont");
      }
    }
  }, [user, loading, router]);

  // Show loading state while we're loading OR if we have no user data yet
  if (loading || !user) {
    return <LoadingSpinner />;
  }

  // If we have user data but they're not admin, return null
  if (!user.isAdmin && !user.isSuperAdmin) {
    return null;
  }

  // If we reach here, user is admin and we can show content
  return <>{children}</>;
}
