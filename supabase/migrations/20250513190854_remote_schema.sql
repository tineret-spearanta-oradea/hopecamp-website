set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_ping()
 RETURNS TABLE(last_ping timestamp with time zone, ping_count integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Update the first ping record (id=1)
    UPDATE public.ping_status
    SET 
        last_ping = NOW(),
        ping_count = ping_count + 1
    WHERE id = 1;
    
    -- Return the updated values
    RETURN QUERY
    SELECT 
        p.last_ping,
        p.ping_count
    FROM public.ping_status p
    WHERE id = 1;
END;
$function$
;


