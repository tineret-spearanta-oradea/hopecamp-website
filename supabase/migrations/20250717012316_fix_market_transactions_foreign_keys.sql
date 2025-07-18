-- Fix foreign key relationship for market_transactions.created_by
-- Change from auth.users(id) to user_profiles(user_id) to match existing pattern

-- Drop the existing foreign key constraint
ALTER TABLE market_transactions DROP CONSTRAINT fk_market_transactions_created_by;

-- Add new foreign key constraint referencing user_profiles
ALTER TABLE market_transactions ADD CONSTRAINT fk_market_transactions_created_by 
    FOREIGN KEY (created_by) REFERENCES user_profiles(user_id) ON DELETE RESTRICT;

-- Update the comment to reflect the correct reference
COMMENT ON COLUMN market_transactions.created_by IS 'User profile ID who created the transaction (references user_profiles.user_id)';