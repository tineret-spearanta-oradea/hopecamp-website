-- Enable RLS for editions
ALTER TABLE public.editions ENABLE ROW LEVEL SECURITY;

-- Grant all users (authenticated and anonymous) select access to all editions
CREATE POLICY "Allow all users to view editions"
    ON public.editions
    FOR SELECT
    USING (true);

-- Grant admins insert access to editions
CREATE POLICY "Allow admins to insert editions"
    ON public.editions
    FOR INSERT
    WITH CHECK (is_admin(auth.uid()));

-- Grant admins update access to editions
CREATE POLICY "Allow admins to update editions"
    ON public.editions
    FOR UPDATE
    USING (is_admin(auth.uid()))
    WITH CHECK (is_admin(auth.uid()));

-- Note: No DELETE policy is created, preventing anyone from deleting editions.

