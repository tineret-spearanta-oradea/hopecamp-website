-- Create admin permissions system
-- This migration creates the foundation for policy-based access control

-- Create admin_permissions table to store available permissions
CREATE TABLE admin_permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(30) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_permissions junction table to assign permissions to users
CREATE TABLE user_permissions (
    user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    permission_id INT NOT NULL REFERENCES admin_permissions(id) ON DELETE CASCADE,
    granted_by UUID REFERENCES user_profiles(user_id),
    granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, permission_id)
);

-- Create indexes for better performance
CREATE INDEX idx_user_permissions_user_id ON user_permissions(user_id);
CREATE INDEX idx_user_permissions_permission_id ON user_permissions(permission_id);
CREATE INDEX idx_admin_permissions_name ON admin_permissions(name);
CREATE INDEX idx_admin_permissions_category ON admin_permissions(category);

-- Create function to get user permissions
CREATE OR REPLACE FUNCTION public.get_user_permissions(p_user_id UUID)
    RETURNS TABLE(permission_name VARCHAR(50))
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT ap.name
    FROM user_permissions up
    JOIN admin_permissions ap ON up.permission_id = ap.id
    WHERE up.user_id = p_user_id;
END;
$$;

-- Create function to check if user has permission
CREATE OR REPLACE FUNCTION public.user_has_permission(p_user_id UUID, p_permission VARCHAR(50))
    RETURNS BOOLEAN
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public
AS $$
BEGIN
    -- Check if user is super admin (gets all permissions)
    IF public.is_super_admin(p_user_id) THEN
        RETURN TRUE;
    END IF;
    
    -- Check if user has specific permission
    RETURN EXISTS (
        SELECT 1
        FROM user_permissions up
        JOIN admin_permissions ap ON up.permission_id = ap.id
        WHERE up.user_id = p_user_id AND ap.name = p_permission
    );
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_user_permissions(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_has_permission(UUID, VARCHAR) TO authenticated;

-- Enable RLS on new tables
ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for admin_permissions (readable by all authenticated users)
CREATE POLICY "Admin permissions are readable by authenticated users" ON admin_permissions
    FOR SELECT TO authenticated USING (true);

-- RLS policies for user_permissions
CREATE POLICY "Users can view their own permissions" ON user_permissions
    FOR SELECT TO authenticated 
    USING (user_id = auth.uid());

CREATE POLICY "Super admins can view all user permissions" ON user_permissions
    FOR SELECT TO authenticated 
    USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins can manage user permissions" ON user_permissions
    FOR ALL TO authenticated 
    USING (public.is_super_admin(auth.uid()));