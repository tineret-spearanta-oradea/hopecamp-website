import {Edition} from '@/types/edition';
import {supabaseAdmin} from "@/lib/supabase/server";

/**
 * Creates a fully typed Edition object (with Date objects), often used for assertions.
 * @param overrides - Partial data to override the defaults.
 * @returns An Edition object.
 */
export function createTestEditionObject(overrides: Partial<Edition> = {}): Edition {
    const startDate = new Date(2025, 1, 1); // Start of current month
    const endDate = new Date(2025, 1, 5); // End of current month

    const defaults: Edition = {
        id:1,
        name: `Test Edition ${Date.now()}`, // Unique name by default
        start_date: startDate,
        end_date: endDate,
        is_open: true,
        created_at: new Date(),
        updated_at: new Date(),
    };

    return {
        ...defaults,
        ...overrides,
    };
}

const testSupabaseAdmin = supabaseAdmin!

// Helper to delete all editions - USE WITH CAUTION (only on test DB)
export const deleteAllEditions = async () => {
    const {error} = await testSupabaseAdmin.from('editions').delete().neq('id', -1); // Delete all rows
    if (error) {
        console.error("Error deleting editions:", error);
        throw error;
    }
};