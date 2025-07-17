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
        // Get current user to set created_by
        const { data: { user } } = await supabaseBrowserClient.auth.getUser();
        if (!user) {
            throw new Error("User not authenticated");
        }

        const { data, error } = await supabaseBrowserClient
            .from("market_transactions")
            .insert({
                ...transactionData,
                created_by: user.id
            })
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
            .filter(t => t.amount > 0)
            .reduce((sum, t) => sum + t.amount, 0);

        const totalPayments = transactions
            .filter(t => t.amount < 0)
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);

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

// Get market transaction summaries with pagination (optimized for performance)
export async function getMarketTransactionSummaries(
    editionId: number = 1,
    searchQuery: string = '',
    limit: number = 10,
    offset: number = 0
): Promise<{
    data: Array<{
        registration_id: number;
        registration_name: string;
        registration_phone: string;
        current_debt: number;
        total_transactions: number;
        latest_transaction_date?: string;
        recent_transactions: MarketTransaction[];
    }>;
    count: number;
}> {
    try {
        const [summariesResult, countResult] = await Promise.all([
            supabaseBrowserClient.rpc('get_market_transaction_summaries', {
                p_edition_id: editionId,
                p_search_query: searchQuery,
                p_limit: limit,
                p_offset: offset
            }),
            supabaseBrowserClient.rpc('get_market_transaction_summaries_count', {
                p_edition_id: editionId,
                p_search_query: searchQuery
            })
        ]);

        if (summariesResult.error) {
            console.error("Error fetching market transaction summaries:", summariesResult.error);
            throw summariesResult.error;
        }

        if (countResult.error) {
            console.error("Error fetching market transaction summaries count:", countResult.error);
            throw countResult.error;
        }

        const data = summariesResult.data?.map((summary: any) => ({
            registration_id: summary.registration_id,
            registration_name: summary.registration_name,
            registration_phone: summary.registration_phone,
            current_debt: summary.current_debt,
            total_transactions: summary.total_transactions,
            latest_transaction_date: summary.latest_transaction_date,
            recent_transactions: summary.recent_transactions || []
        })) || [];

        return {
            data,
            count: countResult.data || 0
        };
    } catch (err) {
        console.error("Unexpected error fetching market transaction summaries:", err);
        throw err;
    }
}

// Get detailed transactions for a specific registration with pagination
export async function getRegistrationMarketTransactionsDetailed(
    registrationId: number,
    limit: number = 50,
    offset: number = 0
): Promise<MarketTransaction[]> {
    try {
        const { data, error } = await supabaseBrowserClient
            .rpc('get_registration_market_transactions_detailed', {
                p_registration_id: registrationId,
                p_limit: limit,
                p_offset: offset
            });

        if (error) {
            console.error("Error fetching detailed market transactions:", error);
            throw error;
        }

        return data || [];
    } catch (err) {
        console.error("Unexpected error fetching detailed market transactions:", err);
        throw err;
    }
}

// Legacy function - keep for backward compatibility but mark as deprecated
/** @deprecated Use getMarketTransactionSummaries instead for better performance */
export async function getAllMarketTransactions(): Promise<MarketTransaction[]> {
    console.warn("getAllMarketTransactions is deprecated. Use getMarketTransactionSummaries for better performance.");
    
    try {
        const result = await getMarketTransactionSummaries(1, '', 1000, 0);
        
        // Flatten the data to match the old format
        const transactions: MarketTransaction[] = [];
        result.data.forEach(summary => {
            summary.recent_transactions.forEach(transaction => {
                transactions.push({
                    ...transaction,
                    registration_name: summary.registration_name,
                    registration_phone: summary.registration_phone,
                    current_debt: summary.current_debt
                } as any);
            });
        });
        
        return transactions;
    } catch (err) {
        console.error("Unexpected error in legacy getAllMarketTransactions:", err);
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