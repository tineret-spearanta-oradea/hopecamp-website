"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from "../ui/LoadingSpinner";
import { useAuth } from "@/contexts/auth-context";

export default function RequireAuth({
    children,
}: {
    children: React.ReactNode;
}) {
    const { supabaseUser, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !supabaseUser) {
            console.log("RequireAuth - No user found! Redirecting to login");
            router.push("/login");
        }
    }, [supabaseUser, loading, router]);

    if (loading) {
        return <LoadingSpinner />;
    }

    return <>{children}</>;
}
