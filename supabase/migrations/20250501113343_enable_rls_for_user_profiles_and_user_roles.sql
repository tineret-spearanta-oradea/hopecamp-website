-- Enable RLS for user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Grant admins full access
CREATE POLICY "Allow admins full access to user profiles"
    ON public.user_profiles
    FOR ALL
    USING (is_admin(auth.uid())) -- Assuming is_admin() function exists
    WITH CHECK (is_admin(auth.uid())); -- Assuming is_admin() function exists

-- Grant users select access to their own profile AND profiles of users who read their messages
CREATE POLICY "Allow users to view their own profile and readers of their messages"
    ON public.user_profiles
    FOR SELECT
    USING (
        -- Allow access to their own profile
        auth.uid() = user_id
        OR
        -- Allow access if the profile belongs to someone who read a message linked to the user's registration
        EXISTS (
            SELECT 1
            FROM public.messages m
            JOIN public.registrations r ON m.registration_id = r.id
            WHERE m.read_by_user_id = user_profiles.user_id -- The profile belongs to the reader
              AND r.user_id = auth.uid() -- The message belongs to the current user's registration
        )
    );

-- Grant users insert access for their own profile
CREATE POLICY "Allow users to insert their own profile"
    ON public.user_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Grant users update access to their own profile
CREATE POLICY "Allow users to update their own profile"
    ON public.user_profiles
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Note: No specific DELETE policy for users is created, preventing them from deleting profiles.
-- Admins can delete via the "Allow admins full access" policy.


-- Enable RLS for user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Grant admins full access to user_roles
CREATE POLICY "Allow admins full access to user roles"
    ON public.user_roles
    FOR ALL
    USING (is_admin(auth.uid()))
    WITH CHECK (is_admin(auth.uid()));

-- Grant users select access to their own role
CREATE POLICY "Allow users to view their own role"
    ON public.user_roles
    FOR SELECT
    USING (auth.uid() = user_id);

-- Note: No specific INSERT, UPDATE, or DELETE policies for non-admin users are created,
-- preventing them from modifying roles. Admins can modify via the "Allow admins full access" policy.
