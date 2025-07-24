-- Seed default admin permissions
-- This migration populates the admin permissions with default values

-- Insert default permissions organized by category
INSERT INTO admin_permissions (name, description, category) VALUES
    -- User management permissions
    ('users.read', 'View user list and profiles', 'users'),
    ('users.edit', 'Edit user profiles and registration data', 'users'),
    ('users.delete', 'Delete users (super admin only)', 'users'),
    
    -- Market/Store permissions
    ('market.read', 'View market transactions and summaries', 'market'),
    ('market.write', 'Create and edit market transactions', 'market'),
    
    -- Messaging permissions
    ('messages.read', 'View messages and communications', 'messages'),
    ('messages.write', 'Send messages to users', 'messages'),
    
    -- Financial permissions
    ('financial.read', 'View financial data and reports', 'financial'),
    ('financial.write', 'Manage financial data and expenses', 'financial'),
    
    -- Administrative permissions
    ('admins.manage', 'Manage admin users and their permissions', 'admin'),
    ('groups.manage', 'Manage small groups and assignments', 'groups'),
    ('settings.manage', 'Manage system settings and configuration', 'settings');

-- Create function to grant all permissions to super admins
CREATE OR REPLACE FUNCTION grant_all_permissions_to_super_admins()
    RETURNS VOID
    LANGUAGE plpgsql
AS $$
DECLARE
    admin_user_id UUID;
    perm_id INT;
BEGIN
    -- For each super admin user, grant all permissions
    FOR admin_user_id IN
        SELECT ur.user_id 
        FROM user_roles ur 
        WHERE ur.is_super_admin = TRUE
    LOOP
        -- For each permission, grant it to the super admin
        FOR perm_id IN
            SELECT ap.id 
            FROM admin_permissions ap
        LOOP
            -- Only insert if the permission doesn't already exist
            INSERT INTO user_permissions (user_id, permission_id, granted_by, granted_at)
            VALUES (admin_user_id, perm_id, admin_user_id, NOW())
            ON CONFLICT (user_id, permission_id) DO NOTHING;
        END LOOP;
    END LOOP;
END;
$$;

-- Execute the function to grant permissions to existing super admins
SELECT grant_all_permissions_to_super_admins();

-- Drop the temporary function
DROP FUNCTION grant_all_permissions_to_super_admins();

-- Create function to auto-grant permissions when a user becomes super admin
CREATE OR REPLACE FUNCTION auto_grant_super_admin_permissions()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS $$
DECLARE
    perm_id INT;
BEGIN
    -- If user is being promoted to super admin
    IF NEW.is_super_admin = TRUE AND (OLD.is_super_admin IS NULL OR OLD.is_super_admin = FALSE) THEN
        -- Grant all permissions to the new super admin
        FOR perm_id IN
            SELECT ap.id FROM admin_permissions ap
        LOOP
            INSERT INTO user_permissions (user_id, permission_id, granted_by, granted_at)
            VALUES (NEW.user_id, perm_id, NEW.user_id, NOW())
            ON CONFLICT (user_id, permission_id) DO NOTHING;
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger to auto-grant permissions when someone becomes super admin
CREATE TRIGGER trigger_auto_grant_super_admin_permissions
    AFTER INSERT OR UPDATE ON user_roles
    FOR EACH ROW
    EXECUTE FUNCTION auto_grant_super_admin_permissions();

-- Grant default read permissions to existing regular admins
INSERT INTO user_permissions (user_id, permission_id, granted_by, granted_at)
SELECT DISTINCT 
    r.user_id,
    ap.id,
    r.user_id,
    NOW()
FROM registrations r
JOIN user_registration_roles urr ON r.id = urr.registration_id
JOIN admin_permissions ap ON ap.name IN ('users.read', 'messages.read', 'financial.read')
WHERE urr.is_admin = TRUE
AND r.user_id NOT IN (
    SELECT ur.user_id FROM user_roles ur WHERE ur.is_super_admin = TRUE
)
ON CONFLICT (user_id, permission_id) DO NOTHING;