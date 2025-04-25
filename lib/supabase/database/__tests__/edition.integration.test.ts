import { createClient } from '@supabase/supabase-js';
import { getActiveEdition } from '../edition';
import {supabaseAdmin} from "@/lib/supabase/server";



const testSupabaseAdmin = supabaseAdmin!; // Or use service_role key if needed

// Helper to delete all editions - USE WITH CAUTION (only on test DB)
const deleteAllEditions = async () => {
    const { error } = await testSupabaseAdmin.from('editions').delete().neq('id', -1); // Delete all rows
    if (error) {
        console.error("Error deleting editions:", error);
        throw error;
    }
};

describe('Edition Database Integration Tests', () => {

    // Clean up before any tests run
    beforeAll(async () => {
        await deleteAllEditions();
    });

    // Clean up after each test
    afterEach(async () => {
        await deleteAllEditions();
    });

    describe('getActiveEdition', () => {
        it('should return the active edition when one exists', async () => {
            // Arrange: Insert an inactive and an active edition
            const startDate = new Date(2024, 0, 1); // Jan 1, 2024
            const endDate = new Date(2024, 0, 10); // Jan 10, 2024
            const createdAt = new Date();
            const updatedAt = new Date();

            const { data: inactiveData, error: inactiveError } = await testSupabaseAdmin
                .from('editions')
                .insert({
                    name: 'Inactive Edition',
                    start_date: startDate.toISOString(),
                    end_date: endDate.toISOString(),
                    is_open: false,
                    created_at: createdAt.toISOString(),
                    updated_at: updatedAt.toISOString(),
                }).select().single();
            expect(inactiveError).toBeNull();

            const { data: activeData, error: activeError } = await testSupabaseAdmin
                .from('editions')
                .insert({
                    name: 'Active Edition',
                    start_date: startDate.toISOString(),
                    end_date: endDate.toISOString(),
                    is_open: true,
                    created_at: createdAt.toISOString(),
                    updated_at: updatedAt.toISOString(),
                }).select().single();
            expect(activeError).toBeNull();
            expect(activeData).not.toBeNull();

            // Act
            const activeEdition = await getActiveEdition();

            // Assert
            expect(activeEdition).not.toBeNull();
            expect(activeEdition.id).toBe(activeData!.id);
            expect(activeEdition.name).toBe('Active Edition');
            expect(activeEdition.is_open).toBe(true);
            // Compare dates carefully (milliseconds might differ slightly depending on DB precision)
            expect(activeEdition.start_date.toISOString()).toBe(startDate.toISOString());
            expect(activeEdition.end_date.toISOString()).toBe(endDate.toISOString());
        });
    });
});
