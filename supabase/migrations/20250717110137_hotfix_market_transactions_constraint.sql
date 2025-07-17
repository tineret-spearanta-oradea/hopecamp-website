-- Hotfix for market transactions constraint issue
-- This migration handles existing data properly

-- First, ensure we can update existing data by removing the old constraint
DO $$
BEGIN
    -- Check if the old constraint exists and drop it
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE table_name = 'market_transactions' 
               AND constraint_name = 'market_transactions_amount_check') THEN
        ALTER TABLE market_transactions DROP CONSTRAINT market_transactions_amount_check;
    END IF;
END $$;

-- Update existing data: convert payments to negative amounts
UPDATE market_transactions 
SET amount = -amount 
WHERE transaction_type = 'payment' AND amount > 0;

-- Remove the transaction_type column if it still exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'market_transactions' 
               AND column_name = 'transaction_type') THEN
        ALTER TABLE market_transactions DROP COLUMN transaction_type;
    END IF;
END $$;

-- Add the new constraint that allows negative values
ALTER TABLE market_transactions ADD CONSTRAINT market_transactions_amount_check CHECK (amount != 0);

-- Update the comment for clarity
COMMENT ON COLUMN market_transactions.amount IS 'Amount in RON cents: positive = debt (user owes), negative = payment (user pays)';