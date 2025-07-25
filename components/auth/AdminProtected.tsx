"use client";

import {useAuth} from "@/contexts/auth-context";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import LoadingSpinner from "../ui/LoadingSpinner";
import {PermissionName} from "@/types/permissions";

interface AdminProtectedProps {
    children: React.ReactNode;
    /** Optional permission requirements. If provided, user must have at least one of these permissions */
    requiredPermissions?: PermissionName[];
    /** If true, user must have ALL specified permissions instead of just one */
    requireAllPermissions?: boolean;
    /** If true, only super admins can access (overrides permission checks) */
    superAdminOnly?: boolean;
}

export default function AdminProtected({
    children,
    requiredPermissions,
    requireAllPermissions = false,
    superAdminOnly = false,
}: AdminProtectedProps) {
    const {userData, loading, userRegistrationData, hasPermission, hasAnyPermission, hasAllPermissions} = useAuth();
    const router = useRouter();

    const isAuthorized = (): boolean => {
        // Check if user is authenticated admin first
        const isBasicAdmin = (userData?.isSuperAdmin) || (userRegistrationData?.isAdmin);
        if (!isBasicAdmin) {
            return false;
        }

        // If super admin only is required
        if (superAdminOnly) {
            return userData?.isSuperAdmin || false;
        }

        // If no specific permissions required, basic admin access is enough
        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }

        // Super admins have all permissions
        if (userData?.isSuperAdmin) {
            return true;
        }

        // Check specific permissions
        if (requireAllPermissions) {
            return hasAllPermissions(...requiredPermissions);
        } else {
            return hasAnyPermission(...requiredPermissions);
        }
    };

    useEffect(() => {
        // Only redirect if we're done loading and user is not authorized
        if (!loading && !isAuthorized()) {
            router.replace("/cont");
        }
    }, [userData, loading, router, userRegistrationData, requiredPermissions, requireAllPermissions, superAdminOnly]);

    // Show loading state while we're loading OR if we have no user data yet
    if (loading || !userData || !userRegistrationData) {
        return <LoadingSpinner transparentBg/>;
    }

    // If user is not authorized, return null
    if (!isAuthorized()) {
        return null;
    }

    // If we reach here, user is authorized and we can show content
    return <>{children}</>;
}
