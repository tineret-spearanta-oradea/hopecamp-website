-- Function to check if a user is a super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(p_user_id UUID)
    RETURNS BOOLEAN
    LANGUAGE plpgsql
    SECURITY DEFINER -- Important for accessing user_roles table securely
    SET search_path = public
AS
$$
BEGIN
    RETURN EXISTS (SELECT 1
                   FROM user_roles ur
                   WHERE ur.user_id = p_user_id
                     AND ur.is_super_admin = TRUE);
END;
$$;

-- Function to check if a user is an admin (super admin or admin for the *active* edition)
CREATE OR REPLACE FUNCTION public.is_admin(p_user_id UUID)
    RETURNS BOOLEAN
    LANGUAGE plpgsql
    SECURITY DEFINER -- Important for accessing related tables securely
    SET search_path = public
AS
$$
DECLARE
    v_active_edition_id INT;
BEGIN
    -- Check if the user is a super admin first
    IF public.is_super_admin(p_user_id) THEN
        RETURN TRUE;
    END IF;

    -- Find the active edition ID
    SELECT id INTO v_active_edition_id FROM editions WHERE is_open = TRUE LIMIT 1;

    -- If no active edition, the user cannot be an admin for it
    IF v_active_edition_id IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Check if the user is an admin in user_registration_roles for any registration
    -- linked to their user_id AND linked to the active edition
    RETURN EXISTS (SELECT 1
                   FROM user_registration_roles urr
                            JOIN registrations r ON urr.registration_id = r.id
                   WHERE r.user_id = p_user_id
                     AND r.edition_id = v_active_edition_id
                     AND urr.is_admin = TRUE);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_super_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;

-- Optional: Grant execute permission to service_role if needed for backend operations
-- GRANT EXECUTE ON FUNCTION public.is_super_admin(UUID) TO service_role;
-- GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO service_role;