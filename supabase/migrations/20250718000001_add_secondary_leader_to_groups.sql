-- Add secondary leader field to groups table
ALTER TABLE groups ADD COLUMN secondary_leader_id INT REFERENCES registrations(id) ON DELETE SET NULL;

-- Update the unique constraint to allow a user to be a secondary leader even if they're already a primary leader
-- (but still prevent someone from being primary leader of multiple groups)
-- The existing constraint on leader_id per edition_id remains

-- Add an index for better performance on secondary leader queries
CREATE INDEX IF NOT EXISTS idx_groups_secondary_leader_id ON groups(secondary_leader_id);

-- Update the RLS policies to handle secondary leaders
-- Drop existing policies first
DROP POLICY IF EXISTS "Super admins can manage groups" ON groups;
DROP POLICY IF EXISTS "Authenticated users can view groups" ON groups;

-- Recreate policies with the same logic (secondary leader doesn't change access patterns)
CREATE POLICY "Super admins can manage groups" ON groups
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_roles ur
            WHERE ur.user_id = auth.uid()
            AND ur.is_super_admin = true
        )
    );

CREATE POLICY "Authenticated users can view groups" ON groups
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Add a constraint to prevent a user from being both primary and secondary leader of the same group
ALTER TABLE groups ADD CONSTRAINT check_different_leaders 
    CHECK (leader_id != secondary_leader_id OR secondary_leader_id IS NULL);

-- Comment to document the change
COMMENT ON COLUMN groups.secondary_leader_id IS 'Optional secondary leader for the group. References registrations table.';