-- Create a heartbeat table to prevent the Supabase project from pausing
-- This table will be used to store a timestamp that gets updated periodically

CREATE TABLE IF NOT EXISTS public.heartbeat (
    id SERIAL PRIMARY KEY,
    last_beat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    description TEXT
);

-- Add comment to the table
COMMENT ON TABLE public.heartbeat IS 'Table used to prevent project pausing by updating timestamp periodically';

-- Create a function to update the heartbeat
CREATE OR REPLACE FUNCTION public.update_heartbeat()
RETURNS VOID AS $$
BEGIN
    -- If no record exists, insert one
    IF NOT EXISTS (SELECT 1 FROM public.heartbeat LIMIT 1) THEN
        INSERT INTO public.heartbeat (description) VALUES ('Project activity heartbeat');
    ELSE
        -- Otherwise update the existing record
        UPDATE public.heartbeat
        SET last_beat = NOW()
        WHERE id = (SELECT id FROM public.heartbeat LIMIT 1);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to prevent this table from being dropped
CREATE OR REPLACE FUNCTION prevent_heartbeat_drop()
RETURNS event_trigger AS $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT * FROM pg_event_trigger_dropped_objects()
    LOOP
        IF r.object_name = 'heartbeat' AND r.object_type = 'table' THEN
            RAISE EXCEPTION 'Cannot drop the heartbeat table as it is required for maintaining project activity';
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create an event trigger on DROP
CREATE EVENT TRIGGER prevent_heartbeat_drop_trigger
ON sql_drop
EXECUTE FUNCTION prevent_heartbeat_drop();

-- Enable RLS but make it accessible to authenticated users
ALTER TABLE public.heartbeat ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow authenticated users to update the heartbeat
CREATE POLICY "Allow authenticated users to update heartbeat" 
ON public.heartbeat 
FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Allow anonymous users to read the heartbeat (useful for health checks)
CREATE POLICY "Allow anonymous users to read heartbeat" 
ON public.heartbeat 
FOR SELECT 
TO anon
USING (true);

-- Also update the heartbeat when an authenticated user logs in
CREATE OR REPLACE FUNCTION public.update_heartbeat_on_auth()
RETURNS trigger AS $$
BEGIN
    PERFORM update_heartbeat();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auth_user_login_trigger
AFTER INSERT ON auth.audit_log_entries
FOR EACH ROW
WHEN (NEW.type = 'token' AND NEW.event = 'token_refreshed')
EXECUTE FUNCTION public.update_heartbeat_on_auth(); 