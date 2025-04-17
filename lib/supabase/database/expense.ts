import { supabaseBrowserClient } from "@/lib/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";

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


export async function getAllExpenses(): Promise<Expense[]> {
    // Join with user_profiles to get the creator's name
    const { data, error } = await supabaseBrowserClient
        .from("expenses")
        // Select all expense fields and the name from the related user_profiles record
        .select(`
            *,
            creator:user_profiles ( name )
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching expenses:", error);
        throw error;
    }
    if (!data) {
        // Should not happen if error is null, but good practice
        return [];
    }

    // Ensure amount is a number and map the creator's name
    const processedData = data.map(expense => {
        // Type assertion for the joined creator data
        const creatorData = expense.creator as { name: string } | null;
        return {
            ...expense,
            amount: typeof expense.amount === 'string' ? parseFloat(expense.amount) : expense.amount,
            // Use the fetched creator name, default to 'Unknown' or similar if null/missing
            creatorName: creatorData?.name ?? 'Unknown User',
            // Remove the nested creator object from the final result
            creator: undefined,
        };
    // We need to cast the result type because TS doesn't know about the removed 'creator' field
    }) as Expense[];


    return processedData;
}

// Returns the newly created expense, including the creator's name
export async function addExpense(expenseData: NewExpense): Promise<Expense> {
     // Ensure amount is a number before inserting
     const amountAsNumber = typeof expenseData.amount === 'string'
        ? parseFloat(expenseData.amount)
        : expenseData.amount;

     if (isNaN(amountAsNumber)) {
        // Throw a standard error for invalid input
        throw new Error("Invalid amount provided. Amount must be a number.");
     }

    const { data, error } = await supabaseBrowserClient
        .from("expenses")
        .insert({
            ...expenseData,
            amount: amountAsNumber,
        })
        // Select the inserted data AND the creator's name via join
        .select(`
            *,
            creator:user_profiles ( name )
        `)
        .single();

    if (error) {
        console.error("Error adding expense:", error);
        throw error;
    }
    if (!data) {
        throw new Error("Failed to add expense or retrieve the added record.");
    }

     // Ensure amount is a number and map the creator's name
    const creatorData = data.creator as { name: string } | null;
    const processedData: Expense = {
        ...data,
        amount: typeof data.amount === 'string' ? parseFloat(data.amount) : data.amount,
        creatorName: creatorData?.name ?? 'Unknown User', // Use fetched name
        creator: undefined, // Remove nested object
    };
    // Remove creator property explicitly for type correctness if needed, though spread syntax handles it
    // delete (processedData as any).creator;

    return processedData;
}
