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
import {RegistrationWithProfile} from "@/types/registrationWithProfile";

interface AuthContextType {
    /** UserRegistrationData data fetched from the 'registrations' table in the database.
     *  Fetched initially on auth state change, but requires manual refresh
     *  using `updateUserData` after modifications. */
    userRegistrationData: RegistrationWithProfile | null;
    /** UserProfile data fetched from the 'user_profiles' table in the database.
     *  Fetched initially on auth state change, but requires manual refresh
     *  using `updateUserData` after modifications. */
    userData: UserProfile | null;
    /** The Supabase authentication user object. Automatically kept up-to-date
     *  by the onAuthStateChange listener based on the session. */
    supabaseUser: SupabaseUser | null;
    /** Indicates if the initial authentication state and user data check is complete. */
    loading: boolean;
    /** Function to manually refetch and update the `userData` state from the database.
     *  Uses the current supabaseUser's ID. */
    updateUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    userData: null,
    userRegistrationData: null,
    supabaseUser: null,
    loading: true,
    updateUserData: async () => {
    },
});

export function AuthProvider({children}: { children: ReactNode }) {
    const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [userRegistrationData, setUserRegistrationData] = useState<RegistrationWithProfile | null>(null);
    const [loading, setLoading] = useState(true); // Initialize loading to true

    useEffect(() => {
        supabaseBrowserClient.auth.getUser();
    }, []);
    /**
     * Fetches user data from the database and updates the `userData` state.
     */
    const updateUserData = useCallback(async () => {
        if (!supabaseUser) {
            console.log(`[AuthContext] No user id found to updateUserData`);
            return
        }
        console.log(`[AuthContext] Fetching user data for ID: ${supabaseUser.id}`);
        const fetchedUserData = await getUserProfile(supabaseUser.id);

        const currentEdition = await getActiveEdition(); // TODO remove this after we have edition selector on the UI
        const registration = await getUserRegistrationByEditionId(currentEdition.id, supabaseUser.id);

        setUserData(fetchedUserData);
        setUserRegistrationData(registration);
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
                            const fetchedUserData = await getUserProfile(user.id);

                            const currentEdition = await getActiveEdition(); // TODO remove this after we have edition selector on the UI
                            const registration = await getUserRegistrationByEditionId(currentEdition.id, user.id);

                            setUserData(fetchedUserData);
                            setUserRegistrationData(registration);

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
                    setLoading(false);
                }
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [userData, userRegistrationData]);


    return (
        <AuthContext.Provider value={{supabaseUser, loading, userData, updateUserData, userRegistrationData}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
