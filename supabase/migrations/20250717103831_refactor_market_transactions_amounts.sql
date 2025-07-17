-- Refactor market transactions to use positive/negative amounts instead of transaction_type
-- Positive amounts = debt (user owes money)
-- Negative amounts = payment (user pays money)

-- First, convert existing data to the new format
UPDATE market_transactions 
SET amount = CASE 
    WHEN transaction_type = 'payment' THEN -amount
    ELSE amount
END;

-- Update the amount constraint to allow negative values first
ALTER TABLE market_transactions DROP CONSTRAINT market_transactions_amount_check;
ALTER TABLE market_transactions ADD CONSTRAINT market_transactions_amount_check CHECK (amount != 0);

-- Remove the transaction_type column
ALTER TABLE market_transactions DROP COLUMN transaction_type;

-- Update the comment for the amount column
COMMENT ON COLUMN market_transactions.amount IS 'Amount in RON cents: positive = debt (user owes), negative = payment (user pays)';

-- Update the get_registration_current_debt function to work with new format
CREATE OR REPLACE FUNCTION public.get_registration_current_debt(p_registration_id INT)
    RETURNS INTEGER
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public
AS $$
BEGIN
    -- Simply sum all amounts (positive debts + negative payments)
    RETURN COALESCE(
        (SELECT SUM(amount) FROM market_transactions WHERE registration_id = p_registration_id),
        0
    );
END;
$$;

-- Drop and recreate the get_registration_market_transactions function to work with new format
DROP FUNCTION IF EXISTS public.get_registration_market_transactions(INT);
CREATE OR REPLACE FUNCTION public.get_registration_market_transactions(p_registration_id INT)
    RETURNS TABLE (
        id INT,
        registration_id INT,
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