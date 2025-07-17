// Matches the structure of the 'market_transactions' table
export interface MarketTransaction {
    id: number;
    registration_id: number;
    amount: number; // Amount in RON cents: positive = debt, negative = payment
    description?: string | null;
    created_at: string;
    created_by: string; // UUID of the admin who created it
    created_by_name?: string; // Added field for the creator's name
}

// Type for adding a new market transaction (omits id, created_at, created_by_name)
export type NewMarketTransaction = Omit<MarketTransaction, 'id' | 'created_at' | 'created_by_name'>;

// Type for the summary of debt for a registration
export interface MarketTransactionSummary {
    registration_id: number;
    total_debt: number; // Total debt amount in RON cents
    total_payments: number; // Total payments amount in RON cents
    current_debt: number; // Current debt (debt - payments) in RON cents
    transaction_count: number; // Total number of transactions
    last_transaction_date?: string; // Date of the last transaction
}

// Helper function to convert RON cents to RON for display
export function formatAmount(amountInCents: number): string {
    return (amountInCents / 100).toFixed(2);
}

// Helper function to convert RON to RON cents for storage
export function parseAmount(amountInRon: string | number): number {
    const amount = typeof amountInRon === 'string' ? parseFloat(amountInRon) : amountInRon;
    return Math.round(amount * 100);
}