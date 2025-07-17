-- Add gender field to user_profiles table
-- Gender can be 'male', 'female', or 'unknown' (default)
ALTER TABLE user_profiles 
ADD COLUMN gender TEXT CHECK (gender IN ('male', 'female', 'unknown')) DEFAULT 'unknown';

-- Add index for gender field to improve query performance
CREATE INDEX idx_user_profiles_gender ON user_profiles(gender);