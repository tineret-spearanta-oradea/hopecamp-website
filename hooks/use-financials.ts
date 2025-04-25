import { useState, useCallback } from "react";
import {
    getAllExpenses,
    addExpense as addExpenseSupabase
} from "@/lib/supabase/database/expense";
import {
    getUsersWithPayments,
    updateUserPayment as updateUserPaymentSupabase
} from "@/lib/supabase/database/user";
import { UserProfile } from "@/types/userProfile";
import {getActiveEdition} from "@/lib/supabase/database/edition";
import {getRegistrationsByEditionId} from "@/lib/supabase/database/registration";
import {Expense as SupabaseExpense, NewExpense} from "@/types/expense"; // Use UserProfile type

export interface Expense {
  id: number;
  title: string;
  amount: number;
  description?: string | null;
  createdBy: string;
  creatorName?: string;
  createdAt: Date;
  category?: string | null;
  receipt?: string | null;
}

export interface Income {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  collectedBy: string;
  createdAt: Date;
  paidOn?: Date;
}

export function useFinancials() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchIncomes = useCallback(async () => {
    setIsLoading(true);
    setError(null); // Reset error state at the beginning
    try {
        const currentEdition = await getActiveEdition(); // TODO remove this after we have edition selector on the UI
        const registrations=await getRegistrationsByEditionId(currentEdition.id);
      // Map UserProfile to Income structure
      const incomesData: Income[] = registrations
        .filter(registration => registration.amountPaid !== undefined && registration.amountPaid > 0) // Ensure amountPaid exists and is > 0
        .map((registration ) => ({
            id: registration.userId,
            userId: registration.userId,
            userName: registration.name || "",
            amount: registration.amountPaid || 0,
            collectedBy: registration.payTaxTo || "", // Use payTaxTo directly as collector's name
            createdAt: registration.createdAt ? new Date(registration.createdAt) : new Date(),
            paidOn: undefined,// TODO we don't store this. Maybe drop it
        }));

      setIncomes(incomesData);
    } catch (err) {
      console.error("Error fetching incomes:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    setError(null); // Reset error state at the beginning
    try {
      const data = await getAllExpenses(); // Now returns data directly or throws

      // Map SupabaseExpense to the hook's Expense structure
      const expensesData: Expense[] = data.map((expense: SupabaseExpense) => ({
          id: expense.id,
          title: expense.title || "",
          amount: Number(expense.amount) || 0,
          description: expense.description,
          createdBy: expense.created_by, // Creator's UUID
          creatorName: expense.creatorName, // Use fetched name
          createdAt: expense.created_at ? new Date(expense.created_at) : new Date(),
          category: expense.category,
          receipt: expense.receipt,
      }));

      setExpenses(expensesData);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUserPayment = async (data: {
    userId: string;
    amount: number;
    collectedBy: string;
    userName: string;
  }) => {
    setIsLoading(true); // Indicate loading state
    setError(null);
    try {
        // No need to destructure error, it will throw if there is one
        await updateUserPaymentSupabase(data.userId, data.amount, data.collectedBy);

        // Update local state optimistically
        setIncomes((prev) => {
            const existingIndex = prev.findIndex(
                (income) => income.id === data.userId
            );
            // Find the original creation date if the user exists, otherwise use now
            const originalCreatedAt = prev.find(inc => inc.id === data.userId)?.createdAt || new Date();

            const updatedIncome: Income = {
                id: data.userId,
                userId: data.userId,
                userName: data.userName,
                amount: data.amount,
                collectedBy: data.collectedBy, // Collector's Name
                paidOn: new Date(),
                createdAt: originalCreatedAt,
            };

            if (existingIndex !== -1) {
                const newIncomes = [...prev];
                // Merge existing data with new data, ensuring paidOn is updated
                newIncomes[existingIndex] = { ...prev[existingIndex], ...updatedIncome };
                // Re-sort if necessary, e.g., by amount or name
                // newIncomes.sort((a, b) => b.amount - a.amount);
                return newIncomes;
            } else {
                 // If user wasn't in the list before (e.g., first payment), add them
                 // This case might be less common if fetchIncomes runs first
                return [updatedIncome, ...prev].sort((a, b) => b.amount - a.amount); // Add and sort
            }
        });
    } catch (err) {
        console.error("Error updating user payment:", err);
        setError(err as Error);
    } finally {
        setIsLoading(false);
    }
  };

  // Adjusted to accept data matching NewExpense structure (without creatorName)
  const addExpense = async (data: {
    title: string;
    description?: string | null;
    amount: number;
    category?: string | null;
    createdBy: string; // Creator's User UUID
    creatorName?: string; // Creator's Name for local state update
    receipt?: string | null;
  }) => {
     setIsLoading(true); // Indicate loading state
     setError(null);
     try {
        // Prepare data for Supabase function
        const expenseToAdd: NewExpense = {
            title: data.title,
            amount: data.amount,
            description: data.description,
            category: data.category,
            created_by: data.createdBy, // Map to created_by
            receipt: data.receipt,
        };

        // addExpenseSupabase now returns the single added expense or throws
        const addedExpense = await addExpenseSupabase(expenseToAdd);

        // Update local state with the data returned from Supabase
        // No need to map from array, addedExpense is the Expense object
        const newExpense: Expense = {
            id: addedExpense.id,
            title: addedExpense.title,
            amount: addedExpense.amount,
            description: addedExpense.description,
            createdBy: addedExpense.created_by, // Creator's UUID
            creatorName: addedExpense.creatorName, // Use name returned from addExpenseSupabase
            createdAt: new Date(addedExpense.created_at),
            category: addedExpense.category,
            receipt: addedExpense.receipt,
        };

        setExpenses((prev) => [newExpense, ...prev]); // Add to the beginning of the list

    } catch (err) {
        console.error("Error adding expense:", err);
        setError(err as Error);
    } finally {
        setIsLoading(false);
    }
  };

  return {
    expenses,
    incomes,
    isLoading,
    error,
    fetchExpenses,
    fetchIncomes,
    addExpense,
    updateUserPayment,
    // Keep refetch for expenses, add one for incomes if needed
    refetchExpenses: fetchExpenses,
    refetchIncomes: fetchIncomes,
  };
}
