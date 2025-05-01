-- Enable RLS for the messages table
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Grant admins full access to messages
CREATE POLICY "Allow admins full access to messages"
    ON public.messages
    FOR ALL
    USING (is_admin(auth.uid()))
    WITH CHECK (is_admin(auth.uid()));

-- Grant users select access to messages linked to their registrations
CREATE POLICY "Allow users to view messages linked to their registrations"
    ON public.messages
    FOR SELECT
    USING (EXISTS (SELECT 1
                   FROM public.registrations r
                   WHERE r.id = messages.registration_id
                     AND r.user_id = auth.uid()));

-- Grant users insert access for messages linked to their registrations
CREATE POLICY "Allow users to insert messages for their own registrations"
    ON public.messages
    FOR INSERT
    WITH CHECK (EXISTS (SELECT 1
                        FROM public.registrations r
                        WHERE r.id = messages.registration_id
                          AND r.user_id = auth.uid()));

-- Note: No UPDATE or DELETE policies for non-admin users are created,
-- preventing them from modifying or deleting messages. Admins can perform
-- these actions via the "Allow admins full access" policy.
