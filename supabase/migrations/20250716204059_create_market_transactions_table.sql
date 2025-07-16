-- Create market transactions table for in-camp market debt/payment tracking
CREATE TABLE market_transactions (
    id SERIAL PRIMARY KEY,
    registration_id INT NOT NULL
        CONSTRAINT fk_market_transactions_registration_id REFERENCES registrations(id) ON DELETE CASCADE,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('debt', 'payment')),
    amount INTEGER NOT NULL CHECK (amount > 0), -- amount in RON cents (e.g., 1000 = 10 RON)
    description TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID NOT NULL
        CONSTRAINT fk_market_transactions_created_by REFERENCES auth.users(id) ON DELETE RESTRICT
);

-- Add comments for the table and columns
COMMENT ON TABLE market_transactions IS 'Tracks market debt and payment transactions for camp participants';
COMMENT ON COLUMN market_transactions.registration_id IS 'Reference to the registration record';
COMMENT ON COLUMN market_transactions.transaction_type IS 'Type of transaction: debt (participant owes money) or payment (participant paid money)';
COMMENT ON COLUMN market_transactions.amount IS 'Amount in RON cents (positive for both debt and payment)';
COMMENT ON COLUMN market_transactions.description IS 'Optional description of the transaction';
COMMENT ON COLUMN market_transactions.created_at IS 'When the transaction was created';
COMMENT ON COLUMN market_transactions.created_by IS 'Admin who created the transaction';

-- Create index for better performance on registration lookups
CREATE INDEX idx_market_transactions_registration_id ON market_transactions(registration_id);
CREATE INDEX idx_market_transactions_created_at ON market_transactions(created_at);

-- Enable RLS for market_transactions table
ALTER TABLE public.market_transactions ENABLE ROW LEVEL SECURITY;

-- Grant admins full access to market transactions
CREATE POLICY "Allow admins full access to market transactions"
    ON public.market_transactions
    FOR ALL
    USING (is_admin(auth.uid()))
    WITH CHECK (is_admin(auth.uid()));

-- Grant users select access to their own market transactions
CREATE POLICY "Allow users to view their own market transactions"
    ON public.market_transactions
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM registrations r 
        WHERE r.id = market_transactions.registration_id 
        AND r.user_id = auth.uid()
    ));

-- Function to calculate current debt for a registration
CREATE OR REPLACE FUNCTION public.get_registration_current_debt(p_registration_id INT)
    RETURNS INTEGER
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public
AS $$
DECLARE
    v_total_debt INTEGER := 0;
    v_total_payments INTEGER := 0;
    v_current_debt INTEGER := 0;
BEGIN
    -- Calculate total debt (positive amounts)
    SELECT COALESCE(SUM(amount), 0) INTO v_total_debt
    FROM market_transactions
    WHERE registration_id = p_registration_id
    AND transaction_type = 'debt';
    
    -- Calculate total payments (positive amounts)
    SELECT COALESCE(SUM(amount), 0) INTO v_total_payments
    FROM market_transactions
    WHERE registration_id = p_registration_id
    AND transaction_type = 'payment';
    
    -- Calculate current debt (debt - payments)
    v_current_debt := v_total_debt - v_total_payments;
    
    -- Return current debt (can be negative if overpaid)
    RETURN v_current_debt;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_registration_current_debt(INT) TO authenticated;

-- Function to get market transaction history for a registration
CREATE OR REPLACE FUNCTION public.get_registration_market_transactions(p_registration_id INT)
    RETURNS TABLE (
        id INT,
        registration_id INT,
        transaction_type TEXT,
        amount INTEGER,
        description TEXT,
        created_at TIMESTAMPTZ,
        created_by UUID,
        created_by_name TEXT
    )
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mt.id,
        mt.registration_id,
        mt.transaction_type,
        mt.amount,
        mt.description,
        mt.created_at,
        mt.created_by,
        COALESCE(up.name, 'Unknown') as created_by_name
    FROM market_transactions mt
    LEFT JOIN user_profiles up ON mt.created_by = up.user_id
    WHERE mt.registration_id = p_registration_id
    ORDER BY mt.created_at DESC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_registration_market_transactions(INT) TO authenticated;