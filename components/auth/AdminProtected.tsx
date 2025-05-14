"use client";

import {useAuth} from "@/contexts/auth-context";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import LoadingSpinner from "../ui/LoadingSpinner";

export default function AdminProtected({
                                           children,
                                       }: {
    children: React.ReactNode;
}) {
    const {userData, loading, userRegistrationData} = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Only redirect if we're done loading and either there's no user or user is not admin
        if (!loading) {
            if (!(userData && userData?.isSuperAdmin)&&!(userRegistrationData && userRegistrationData.isAdmin))
             {
                router.replace("/cont");
            }
        }
    }, [userData, loading, router, userRegistrationData]);

    // Show loading state while we're loading OR if we have no user data yet
    if (loading || !userData || !userRegistrationData) {
        return <LoadingSpinner transparentBg/>;
    }

    // If we have user data but they're not admin, return null
    if (!userRegistrationData.isAdmin && !userData.isSuperAdmin) {
        return null;
    }

    // If we reach here, user is admin and we can show content
    return <>{children}</>;
}
