-- Create the expenses table
CREATE TABLE expenses
(
    id          SERIAL      PRIMARY KEY,
    title       TEXT        NOT NULL,
    amount      NUMERIC     NOT NULL CHECK (amount >= 0), -- Use NUMERIC for monetary values, ensure non-negative
    description TEXT        NULL,
    created_by  uuid        NOT NULL CONSTRAINT fk_expenses_created_by REFERENCES public.users_data (uid) ON DELETE RESTRICT, -- Reference users_data, restrict deletion if user has expenses
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    category    TEXT        NULL,
    receipt     TEXT        NULL -- Store URL or reference to receipt file if needed
);

-- Optional: Add RLS policies if needed for security
-- ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow admins to manage all expenses" ON expenses FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid())); -- Assuming an is_admin function exists
-- CREATE POLICY "Allow users to view expenses (if applicable)" ON expenses FOR SELECT USING (true); -- Adjust based on requirements
