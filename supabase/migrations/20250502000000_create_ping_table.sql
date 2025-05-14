-- Create a table specifically for pinging the database to prevent it from pausing due to inactivity
CREATE TABLE public.ping_status (
    id SERIAL PRIMARY KEY,
    last_ping TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ping_count INTEGER DEFAULT 0,
    notes TEXT
);

-- Add a comment to explain the purpose of this table
COMMENT ON TABLE public.ping_status IS 'Used to store ping information to keep the database active';

-- Insert initial row that will be updated by the ping script
INSERT INTO public.ping_status (notes) 
VALUES ('Initial ping row. This table is used to prevent the Supabase project from pausing due to inactivity.');

-- Create a function to update the ping status
CREATE OR REPLACE FUNCTION public.update_ping()
RETURNS TABLE (
    last_ping TIMESTAMP WITH TIME ZONE,
    ping_count INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    updated_record RECORD;
BEGIN
    -- Update the first ping record (id=1) and store the result in updated_record
    UPDATE public.ping_status
    SET 
        last_ping = NOW(),
        ping_count = ping_status.ping_count + 1
    WHERE id = 1
    RETURNING ping_status.last_ping, ping_status.ping_count INTO updated_record;
    
    -- Return the updated values using the variables instead of a query
    last_ping := updated_record.last_ping;
    ping_count := updated_record.ping_count;
    RETURN NEXT;
END;
$$; 