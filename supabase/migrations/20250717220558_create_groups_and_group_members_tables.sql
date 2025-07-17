-- Create groups table
CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    edition_id INT NOT NULL
        CONSTRAINT fk_groups_edition_id REFERENCES editions (id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    leader_id UUID NOT NULL
        CONSTRAINT fk_groups_leader_id REFERENCES user_profiles (user_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create group_members table
CREATE TABLE group_members (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL
        CONSTRAINT fk_group_members_user_id REFERENCES user_profiles (user_id) ON DELETE CASCADE,
    group_id INT NOT NULL
        CONSTRAINT fk_group_members_group_id REFERENCES groups (id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure each user can only be in one group per edition
CREATE UNIQUE INDEX unique_user_per_edition_group
    ON group_members (user_id, group_id);

-- Ensure each leader can only lead one group per edition
CREATE UNIQUE INDEX unique_leader_per_edition
    ON groups (leader_id, edition_id);

-- Ensure group names are unique per edition
CREATE UNIQUE INDEX unique_group_name_per_edition
    ON groups (edition_id, name);

-- Enable RLS for groups table
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

-- Enable RLS for group_members table
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- RLS policies for groups table
CREATE POLICY "Admins can view all groups" ON groups
    FOR SELECT TO authenticated
    USING (auth.jwt() ->> 'role' = 'authenticated');

CREATE POLICY "Super admins can manage groups" ON groups
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles ur
            WHERE ur.user_id = auth.uid()
            AND ur.is_super_admin = true
        )
    );

-- RLS policies for group_members table
CREATE POLICY "Admins can view all group members" ON group_members
    FOR SELECT TO authenticated
    USING (auth.jwt() ->> 'role' = 'authenticated');

CREATE POLICY "Super admins can manage group members" ON group_members
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles ur
            WHERE ur.user_id = auth.uid()
            AND ur.is_super_admin = true
        )
    );

-- Create indexes for better performance
CREATE INDEX idx_groups_edition_id ON groups(edition_id);
CREATE INDEX idx_groups_leader_id ON groups(leader_id);
CREATE INDEX idx_group_members_user_id ON group_members(user_id);
CREATE INDEX idx_group_members_group_id ON group_members(group_id);