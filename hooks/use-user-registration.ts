import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { getUserRegistrationByUserId } from '@/lib/supabase/database/registration';
import {UserRegistration} from "@/types/userRegistration";

interface UseUserRegistrationReturn {
    registration: UserRegistration | null;
    loading: boolean;
    error: Error | null;
    refetchRegistration: () => Promise<void>;
}

export function useUserRegistration(): UseUserRegistrationReturn {
    const { supabaseUser, loading: authLoading } = useAuth(); // Get user and auth loading state
    const userId = supabaseUser?.id;

    const [registration, setRegistration] = useState<UserRegistration | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // Independent loading state for registration
    const [error, setError] = useState<Error | null>(null);

    const fetchRegistration = useCallback(async () => {
        if (!userId) {
            // Don't fetch if there's no user ID
            setRegistration(null);
            setLoading(false); // Not loading if no user ID
            setError(null);
            return;
        }

        // Only set loading true if we are actually going to fetch
        setLoading(true);
        setError(null);
        console.log(`[useUserRegistration] Fetching registration for user ID: ${userId}`);
        try {
            const data = await getUserRegistrationByUserId(userId);
            console.log(`[useUserRegistration] Fetched registration data:`, data);
            setRegistration(data);
        } catch (err) {
            console.error('[useUserRegistration] Error fetching registration:', err);
            setError(err instanceof Error ? err : new Error('Failed to fetch registration'));
            setRegistration(null);
        } finally {
            setLoading(false);
        }
    }, [userId]); // Dependency: fetchRegistration changes if userId changes

    useEffect(() => {
        // Fetch initially when the hook mounts or when userId becomes available/changes,
        // but only after auth state is resolved (authLoading is false).
        if (!authLoading) {
             fetchRegistration();
        } else {
            // If auth is still loading, set registration loading to true
            // to reflect the dependency, but don't fetch yet.
            setLoading(true);
        }
    }, [userId, authLoading, fetchRegistration]); // Dependencies: userId, authLoading, and the fetch function itself

    return { registration, loading, error, refetchRegistration: fetchRegistration };
}
