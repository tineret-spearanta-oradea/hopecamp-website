-- Enable RLS for expenses table
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Grant admins full access to expenses
CREATE POLICY "Allow admins full access to expenses"
    ON public.expenses
    FOR ALL -- Covers SELECT, INSERT, UPDATE, DELETE
    USING (is_admin(auth.uid()))
    WITH CHECK (is_admin(auth.uid()));

-- Note: No policies are created for non-admin users, effectively denying them any access.
