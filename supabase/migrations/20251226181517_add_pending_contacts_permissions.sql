-- Add pending contacts permissions to the admin permissions system

-- Insert new permissions
INSERT INTO admin_permissions (name, description, category) VALUES
    ('pending_contacts.read', 'Vizualizare contacte în așteptare', 'users'),
    ('pending_contacts.write', 'Gestionare contacte în așteptare (actualizare status, adăugare note, rezolvare)', 'users');

-- Auto-grant pending_contacts permissions to users who already have users.read permission
-- This ensures existing admins with user management access also get pending contacts access
INSERT INTO user_permissions (user_id, permission_id, granted_by, granted_at)
SELECT DISTINCT
    up.user_id,
    ap.id,
    up.granted_by,
    NOW()
FROM user_permissions up
JOIN admin_permissions existing_perm ON up.permission_id = existing_perm.id
JOIN admin_permissions ap ON ap.name IN ('pending_contacts.read', 'pending_contacts.write')
WHERE existing_perm.name = 'users.read'
ON CONFLICT (user_id, permission_id) DO NOTHING;
