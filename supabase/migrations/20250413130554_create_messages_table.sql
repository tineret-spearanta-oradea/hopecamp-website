-- Create the messages table
-- Create the messages table
CREATE TABLE messages
(
    id              SERIAL PRIMARY KEY,
    user_id         uuid        NOT NULL
        CONSTRAINT fk_messages_user_id REFERENCES public.users_data (uid) ON DELETE CASCADE,
    text            TEXT        NOT NULL,
    sent_date       TIMESTAMPTZ NOT NULL DEFAULT now(),
    is_read         BOOLEAN     NOT NULL DEFAULT false,
    read_by_user_id uuid        NULL
        CONSTRAINT fk_messages_read_by_user_id REFERENCES public.users_data (uid) ON DELETE SET NULL, -- Foreign key for the user who read the message
    read_at         TIMESTAMPTZ NULL                                                                  -- Timestamp when the message was read
);

-- Add indexes for frequently queried columns
CREATE INDEX idx_messages_user_id ON messages (user_id);
CREATE INDEX idx_messages_is_read ON messages (is_read);
CREATE INDEX idx_messages_sent_date ON messages (sent_date);

-- Optional: Add RLS policies if needed for security
-- ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow users to see their own messages" ON messages FOR SELECT USING (auth.uid() = user_id);
-- CREATE POLICY "Allow admins to see all messages" ON messages FOR SELECT USING (is_admin(auth.uid())); -- Assuming an is_admin function exists
-- CREATE POLICY "Allow users to insert their own messages" ON messages FOR INSERT WITH CHECK (auth.uid() = user_id);
-- CREATE POLICY "Allow admins to update message read status" ON messages FOR UPDATE USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
