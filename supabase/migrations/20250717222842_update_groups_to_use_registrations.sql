-- Update groups table to reference registrations instead of users
-- This ensures groups work with confirmed participants only

-- First, drop existing foreign key constraint on leader_id
ALTER TABLE groups DROP CONSTRAINT IF EXISTS fk_groups_leader_id;

-- Add new leader_registration_id column
ALTER TABLE groups ADD COLUMN leader_registration_id INT;

-- Update existing records to use registration IDs (if any exist)
UPDATE groups 
SET leader_registration_id = r.id
FROM registrations r
WHERE r.user_id = groups.leader_id AND r.edition_id = groups.edition_id;

-- Drop the old leader_id column
ALTER TABLE groups DROP COLUMN leader_id;

-- Rename the new column to leader_id for consistency
ALTER TABLE groups RENAME COLUMN leader_registration_id TO leader_id;

-- Add foreign key constraint to registrations table
ALTER TABLE groups 
ADD CONSTRAINT fk_groups_leader_id 
FOREIGN KEY (leader_id) REFERENCES registrations(id) ON DELETE CASCADE;

-- Update group_members table to reference registrations
-- First, drop existing foreign key constraint on user_id
ALTER TABLE group_members DROP CONSTRAINT IF EXISTS fk_group_members_user_id;

-- Add new registration_id column
ALTER TABLE group_members ADD COLUMN registration_id INT;

-- Update existing records to use registration IDs (if any exist)
UPDATE group_members 
SET registration_id = r.id
FROM registrations r, groups g
WHERE r.user_id = group_members.user_id 
  AND r.edition_id = g.edition_id 
  AND g.id = group_members.group_id;

-- Drop the old user_id column
ALTER TABLE group_members DROP COLUMN user_id;

-- Rename the new column to user_id for API consistency
ALTER TABLE group_members RENAME COLUMN registration_id TO user_id;

-- Add foreign key constraint to registrations table
ALTER TABLE group_members 
ADD CONSTRAINT fk_group_members_user_id 
FOREIGN KEY (user_id) REFERENCES registrations(id) ON DELETE CASCADE;

-- Update indexes
DROP INDEX IF EXISTS idx_group_members_user_id;
CREATE INDEX idx_group_members_registration_id ON group_members(user_id);

-- Update unique constraints to work with registrations
DROP INDEX IF EXISTS unique_user_per_edition_group;
DROP INDEX IF EXISTS unique_leader_per_edition;

-- Create new unique constraints
CREATE UNIQUE INDEX unique_registration_per_group
    ON group_members (user_id, group_id);

CREATE UNIQUE INDEX unique_leader_per_edition_registration
    ON groups (leader_id, edition_id);