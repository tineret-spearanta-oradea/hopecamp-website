// Matches the structure of the 'expenses' table
export interface Expense {
    id: number;
    title: string;
    amount: number;
    description?: string | null;
    created_by: string; // UUID of the user who created it
    creatorName?: string; // Added field for the creator's name
    created_at: string;
    category?: string | null;
    receipt?: string | null;
}
// Type for adding a new expense (omits id, created_at)
export type NewExpense = Omit<Expense, 'id' | 'created_at'>;