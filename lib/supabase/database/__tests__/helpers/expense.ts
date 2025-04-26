import { supabaseAdmin } from '@/lib/supabase/server';
import { NewExpense } from '@/types/expense';

const testSupabaseAdmin = supabaseAdmin!;

/**
 * Creates a default NewExpense object suitable for insertion.
 * @param createdByUserId - The UUID of the user creating the expense.
 * @param overrides - Partial data to override defaults.
 * @returns A NewExpense object.
 */
export function createTestNewExpense(createdByUserId: string, overrides: Partial<NewExpense> = {}): NewExpense {
    const defaults: NewExpense = {
        title: `Test Expense ${Date.now()}`,
        amount: Math.floor(Math.random() * 100) + 10, // Random amount between 10 and 110
        description: 'Default test expense description',
        category: 'Test Category',
        receipt: null,
        created_by: createdByUserId,
        creatorName: undefined, // creatorName is not part of NewExpense, added by DB functions
    };

    return {
        ...defaults,
        ...overrides,
        created_by: createdByUserId, // Ensure created_by is always set
    };
}


// Helper to delete all expenses - USE WITH CAUTION
export const deleteAllExpenses = async () => {
    const { error } = await testSupabaseAdmin.from('expenses').delete().neq('id', -1); // Delete all rows
    if (error) {
        console.error("Error deleting expenses:", error);
        // Don't throw in cleanup, just log
    }
};
