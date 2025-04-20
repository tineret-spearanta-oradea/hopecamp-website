CREATE TABLE expenses
(
    id          SERIAL PRIMARY KEY,
    title       TEXT        NOT NULL,
    amount      NUMERIC     NOT NULL CHECK (amount >= 0),
    description TEXT        NULL,
    created_by  UUID        NOT NULL
        CONSTRAINT fk_expenses_created_by_user_id REFERENCES auth.users ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    category    TEXT        NULL,
    receipt     TEXT        NULL
);

-- Optional: Add RLS policies if needed for security
-- ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow admins to manage all expenses" ON expenses FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid())); -- Assuming an is_admin function exists
-- CREATE POLICY "Allow users to view expenses (if applicable)" ON expenses FOR SELECT USING (true); -- Adjust based on requirements
