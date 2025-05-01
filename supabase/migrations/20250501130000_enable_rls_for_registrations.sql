-- Enable RLS for registrations table
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Grant admins full access to registrations
CREATE POLICY "Allow admins full access to registrations"
    ON public.registrations
    FOR ALL
    USING (is_admin(auth.uid()))
    WITH CHECK (is_admin(auth.uid()));

-- Grant users select access to their own registrations
CREATE POLICY "Allow users to view their own registrations"
    ON public.registrations
    FOR SELECT
    USING (auth.uid() = user_id);

-- Grant users insert access for their own registration
CREATE POLICY "Allow users to insert their own registration"
    ON public.registrations
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Note: No UPDATE or DELETE policies for non-admin users are created, preventing them from modifying/deleting registrations.


-- Enable RLS for user_registration_roles table
ALTER TABLE public.user_registration_roles ENABLE ROW LEVEL SECURITY;

-- Grant admins full access to user_registration_roles
CREATE POLICY "Allow admins full access to user registration roles"
    ON public.user_registration_roles
    FOR ALL
    USING (is_admin(auth.uid()))
    WITH CHECK (is_admin(auth.uid()));

-- Grant users select access to roles linked to their registrations
CREATE POLICY "Allow users to view roles linked to their registrations"
    ON public.user_registration_roles
    FOR SELECT
    USING (EXISTS (SELECT 1
                   FROM registrations r
                   WHERE r.id = user_registration_roles.registration_id
                     AND r.user_id = auth.uid()));

-- Note: No INSERT, UPDATE, or DELETE policies for non-admin users are created,
-- preventing them from modifying registration roles.
