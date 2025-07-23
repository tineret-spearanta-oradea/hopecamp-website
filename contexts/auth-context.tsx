"use client";

import {createContext, useContext, useEffect, useState, useCallback, ReactNode} from "react";
import {UserProfile} from "@/types/userProfile";
import {User as SupabaseUser} from "@supabase/supabase-js";
import {supabaseBrowserClient} from "@/lib/supabase/client";
import {getUserProfile} from "@/lib/supabase/database/registration";
import {
    getUserRegistrationByEditionId
} from "@/lib/supabase/database/registration";
import {getActiveEdition} from "@/lib/supabase/database/edition";
import {getUserPermissions} from "@/lib/supabase/database/permissions";
import {RegistrationWithProfile} from "@/types/registrationWithProfile";
import {PermissionName} from "@/types/permissions";

interface AuthContextType {
    /** UserRegistrationData data fetched from the 'registrations' table in the database.
     *  Fetched initially on auth state change, but requires manual refresh
     *  using `updateUserData` after modifications. */
    userRegistrationData: RegistrationWithProfile | null;
    /** UserProfile data fetched from the 'user_profiles' table in the database.
     *  Fetched initially on auth state change, but requires manual refresh
     *  using `updateUserData` after modifications. */
    userData: UserProfile | null;
    /** User permissions fetched from the database. Cached for performance. */
    userPermissions: PermissionName[];
    /** The Supabase authentication user object. Automatically kept up-to-date
     *  by the onAuthStateChange listener based on the session. */
    supabaseUser: SupabaseUser | null;
    /** Indicates if the initial authentication state and user data check is complete. */
    loading: boolean;
    /** Function to manually refetch and update the `userData` state from the database.
     *  Uses the current supabaseUser's ID. */
    updateUserData: () => Promise<void>;
    /** Function to check if the current user has a specific permission */
    hasPermission: (permission: PermissionName) => boolean;
    /** Function to check if the current user has any of the specified permissions */
    hasAnyPermission: (...permissions: PermissionName[]) => boolean;
    /** Function to check if the current user has all of the specified permissions */
    hasAllPermissions: (...permissions: PermissionName[]) => boolean;
}

const AuthContext = createContext<AuthContextType>({
    userData: null,
    userRegistrationData: null,
    userPermissions: [],
    supabaseUser: null,
    loading: true,
    updateUserData: async () => {
    },
    hasPermission: () => false,
    hasAnyPermission: () => false,
    hasAllPermissions: () => false,
});

export function AuthProvider({children}: { children: ReactNode }) {
    const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [userRegistrationData, setUserRegistrationData] = useState<RegistrationWithProfile | null>(null);
    const [userPermissions, setUserPermissions] = useState<PermissionName[]>([]);
    const [loading, setLoading] = useState(true); // Initialize loading to true

    useEffect(() => {
        supabaseBrowserClient.auth.getUser();
    }, []);

    // Permission checking helper functions
    const hasPermission = useCallback((permission: PermissionName): boolean => {
        // Super admins have all permissions
        if (userData?.isSuperAdmin) {
            return true;
        }
        return userPermissions.includes(permission);
    }, [userData?.isSuperAdmin, userPermissions]);

    const hasAnyPermission = useCallback((...permissions: PermissionName[]): boolean => {
        // Super admins have all permissions
        if (userData?.isSuperAdmin) {
            return true;
        }
        return permissions.some(permission => userPermissions.includes(permission));
    }, [userData?.isSuperAdmin, userPermissions]);

    const hasAllPermissions = useCallback((...permissions: PermissionName[]): boolean => {
        // Super admins have all permissions
        if (userData?.isSuperAdmin) {
            return true;
        }
        return permissions.every(permission => userPermissions.includes(permission));
    }, [userData?.isSuperAdmin, userPermissions]);

    /**
     * Fetches user data from the database and updates the `userData` state.
     */
    const updateUserData = useCallback(async () => {
        if (!supabaseUser) {
            console.log(`[AuthContext] No user id found to updateUserData`);
            return
        }
        console.log(`[AuthContext] Fetching user data for ID: ${supabaseUser.id}`);
        
        try {
            const [fetchedUserData, currentEdition, permissions] = await Promise.all([
                getUserProfile(supabaseUser.id),
                getActiveEdition(), // TODO remove this after we have edition selector on the UI
                getUserPermissions(supabaseUser.id)
            ]);

            const registration = await getUserRegistrationByEditionId(currentEdition.id, {userId:supabaseUser.id});

            setUserData(fetchedUserData);
            setUserRegistrationData(registration);
            setUserPermissions(permissions as PermissionName[]);
        } catch (error) {
            console.error('[AuthContext] Error fetching user data:', error);
        }
    }, [supabaseUser]);

    // Listen to authentication state changes
    // This listener also fires immediately with the initial auth state
    // It handles setting the supabaseUser and the *initial* fetch of userData.
    useEffect(() => {
        const {data: authListener} = supabaseBrowserClient.auth.onAuthStateChange(
            async (event, session) => {
                const user = session?.user || null;
                console.log("auth event", event, user);
                if (user) {
                    // we have a user but userData was not loaded yet
                    if (userData == null || userRegistrationData === null) {
                        setTimeout(async () => {
                            // load user data
                            // see https://supabase.com/docs/reference/javascript/auth-onauthstatechange for setTimeout explanation
                            try {
                                const [fetchedUserData, currentEdition, permissions] = await Promise.all([
                                    getUserProfile(user.id),
                                    getActiveEdition(), // TODO remove this after we have edition selector on the UI
                                    getUserPermissions(user.id)
                                ]);

                                const registration = await getUserRegistrationByEditionId(currentEdition.id, {userId:user.id});

                                setUserData(fetchedUserData);
                                setUserRegistrationData(registration);
                                setUserPermissions(permissions as PermissionName[]);
                            } catch (error) {
                                console.error('[AuthContext] Error loading user data:', error);
                            }

                            setSupabaseUser(user);
                            setLoading(false);
                        }, 0)
                    } else {
                        setSupabaseUser(user);
                        setLoading(false);
                    }
                } else {
                    setSupabaseUser(null);
                    setUserData(null);
                    setUserRegistrationData(null);
                    setUserPermissions([]);
                    setLoading(false);
                }
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [userData, userRegistrationData]);


    return (
        <AuthContext.Provider value={{
            supabaseUser, 
            loading, 
            userData, 
            userRegistrationData,
            userPermissions,
            updateUserData,
            hasPermission,
            hasAnyPermission,
            hasAllPermissions
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
