import { createClient as createGenericClient } from '@supabase/supabase-js';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers'; // Import cookies from next/headers

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!serviceRoleKey && process.env.NODE_ENV !== 'test') { // Avoid warning in test environments if needed
    console.warn("Missing environment variable: SUPABASE_SERVICE_ROLE_KEY. Admin client will not be functional.");
}

// Create a single admin client instance for server-side admin operations
// It's null if the service key is missing. Check for null before using.
export const supabaseAdmin = serviceRoleKey ? createGenericClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
) : null;


// --- Server Client for User Context (Route Handlers, Server Actions) ---
// This function creates a Supabase client specific to the current request context using @supabase/ssr
export function createServerActionClient() {
    const cookieStore = cookies(); // Get cookie store from next/headers

    // Use createServerClient with cookie handling for server actions/route handlers
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value, ...options });
                    } catch (error) {
                        // The `set` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing sessions.
                    }
                },
                remove(name: string, options: CookieOptions) {
                     try {
                        cookieStore.set({ name, value: '', ...options });
                    } catch (error) {
                        // The `delete` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing sessions.
                    }
                },
            },
        }
    );
}
