import { supabaseBrowserClient } from "@/lib/supabase/client";
import { MarketTransaction, NewMarketTransaction, MarketTransactionSummary } from "@/types/marketTransaction";

// Get all market transactions for a specific registration
export async function getMarketTransactionsByRegistrationId(registrationId: number): Promise<MarketTransaction[]> {
    try {
        const { data, error } = await supabaseBrowserClient
            .from("market_transactions")
            .select(`
                *,
                creator:user_profiles ( name )
            `)
            .eq("registration_id", registrationId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching market transactions:", error);
            throw error;
        }

        if (!data) {
            return [];
        }

        // Map the data to include creator name
        const processedData = data.map(transaction => {
            const creatorData = transaction.creator as { name: string } | null;
            return {
                ...transaction,
                created_by_name: creatorData?.name ?? 'Unknown User',
                creator: undefined,
            };
        }) as MarketTransaction[];

        return processedData;
    } catch (err) {
        console.error("Unexpected error fetching market transactions:", err);
        throw err;
    }
}

// Add a new market transaction
export async function addMarketTransaction(transactionData: NewMarketTransaction): Promise<MarketTransaction> {
    try {
        const { data, error } = await supabaseBrowserClient
            .from("market_transactions")
            .insert(transactionData)
            .select(`
                *,
                creator:user_profiles ( name )
            `)
            .single();

        if (error) {
            console.error("Error adding market transaction:", error);
            throw error;
        }

        if (!data) {
            throw new Error("Failed to add market transaction or retrieve the added record.");
        }

        // Map the data to include creator name
        const creatorData = data.creator as { name: string } | null;
        const processedData: MarketTransaction = {
            ...data,
            created_by_name: creatorData?.name ?? 'Unknown User',
            creator: undefined,
        };

        return processedData;
    } catch (err) {
        console.error("Unexpected error adding market transaction:", err);
        throw err;
    }
}

// Get current debt for a registration using the database function
export async function getCurrentDebtForRegistration(registrationId: number): Promise<number> {
    try {
        const { data, error } = await supabaseBrowserClient
            .rpc('get_registration_current_debt', { p_registration_id: registrationId });

        if (error) {
            console.error("Error fetching current debt:", error);
            throw error;
        }

        return data || 0;
    } catch (err) {
        console.error("Unexpected error fetching current debt:", err);
        throw err;
    }
}

// Get transaction summary for a registration
export async function getMarketTransactionSummary(registrationId: number): Promise<MarketTransactionSummary> {
    try {
        const [transactions, currentDebt] = await Promise.all([
            getMarketTransactionsByRegistrationId(registrationId),
            getCurrentDebtForRegistration(registrationId)
        ]);

        const totalDebt = transactions
            .filter(t => t.transaction_type === 'debt')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalPayments = transactions
            .filter(t => t.transaction_type === 'payment')
            .reduce((sum, t) => sum + t.amount, 0);

        const lastTransaction = transactions.length > 0 ? transactions[0] : null;

        return {
            registration_id: registrationId,
            total_debt: totalDebt,
            total_payments: totalPayments,
            current_debt: currentDebt,
            transaction_count: transactions.length,
            last_transaction_date: lastTransaction?.created_at
        };
    } catch (err) {
        console.error("Unexpected error fetching market transaction summary:", err);
        throw err;
    }
}

// Get market transactions for all registrations (admin overview)
export async function getAllMarketTransactions(): Promise<MarketTransaction[]> {
    try {
        const { data, error } = await supabaseBrowserClient
            .from("market_transactions")
            .select(`
                *,
                creator:user_profiles ( name ),
                registration:registrations ( 
                    id,
                    user_profiles ( name, phone )
                )
            `)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching all market transactions:", error);
            throw error;
        }

        if (!data) {
            return [];
        }

        // Map the data to include creator name and registration info
        const processedData = data.map(transaction => {
            const creatorData = transaction.creator as { name: string } | null;
            const registrationData = transaction.registration as { 
                id: number; 
                user_profiles: { name: string; phone: string } 
            } | null;

            return {
                ...transaction,
                created_by_name: creatorData?.name ?? 'Unknown User',
                registration_name: registrationData?.user_profiles?.name ?? 'Unknown',
                registration_phone: registrationData?.user_profiles?.phone ?? 'Unknown',
                creator: undefined,
                registration: undefined,
            };
        }) as MarketTransaction[];

        return processedData;
    } catch (err) {
        console.error("Unexpected error fetching all market transactions:", err);
        throw err;
    }
}

// Delete a market transaction (admin only)
export async function deleteMarketTransaction(transactionId: number): Promise<void> {
    try {
        const { error } = await supabaseBrowserClient
            .from("market_transactions")
            .delete()
            .eq("id", transactionId);

        if (error) {
            console.error("Error deleting market transaction:", error);
            throw error;
        }
    } catch (err) {
        console.error("Unexpected error deleting market transaction:", err);
        throw err;
    }
}