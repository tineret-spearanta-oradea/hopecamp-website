-- Drop and recreate market transaction functions to fix BIGINT/INTEGER type mismatch

-- Drop the existing function first
DROP FUNCTION IF EXISTS public.get_market_transaction_summaries(INT, TEXT, INT, INT);

-- Recreate with correct types
CREATE FUNCTION public.get_market_transaction_summaries(
    p_edition_id INT DEFAULT 1,
    p_search_query TEXT DEFAULT '',
    p_limit INT DEFAULT 10,
    p_offset INT DEFAULT 0
)
RETURNS TABLE (
    registration_id INT,
    registration_name TEXT,
    registration_phone TEXT,
    current_debt INTEGER,
    total_transactions INTEGER,
    latest_transaction_date TIMESTAMPTZ,
    recent_transactions JSONB
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    WITH transaction_summaries AS (
        SELECT 
            r.id as reg_id,
            r.user_id,
            up.name as user_name,
            auv.phone as user_phone,
            COALESCE(SUM(mt.amount), 0)::INTEGER as debt,
            COUNT(mt.id)::INTEGER as trans_count,
            MAX(mt.created_at) as latest_date
        FROM registrations r
        INNER JOIN user_profiles up ON r.user_id = up.user_id
        INNER JOIN auth_users_view auv ON up.user_id = auv.id
        LEFT JOIN market_transactions mt ON r.id = mt.registration_id
        WHERE r.edition_id = p_edition_id
        AND (
            p_search_query = '' OR 
            up.name ILIKE '%' || p_search_query || '%' OR
            auv.phone ILIKE '%' || p_search_query || '%'
        )
        GROUP BY r.id, r.user_id, up.name, auv.phone
        HAVING COUNT(mt.id) > 0  -- Only show registrations with transactions
        ORDER BY latest_date DESC NULLS LAST
        LIMIT p_limit OFFSET p_offset
    ),
    recent_trans AS (
        SELECT 
            ts.reg_id,
            COALESCE(
                jsonb_agg(
                    jsonb_build_object(
                        'id', mt.id,
                        'amount', mt.amount,
                        'description', mt.description,
                        'created_at', mt.created_at,
                        'created_by_name', up_creator.name
                    ) ORDER BY mt.created_at DESC
                ) FILTER (WHERE mt.id IS NOT NULL),
                '[]'::jsonb
            ) as transactions
        FROM transaction_summaries ts
        LEFT JOIN market_transactions mt ON ts.reg_id = mt.registration_id
        LEFT JOIN user_profiles up_creator ON mt.created_by = up_creator.user_id
        GROUP BY ts.reg_id
    )
    SELECT 
        ts.reg_id,
        ts.user_name,
        ts.user_phone,
        ts.debt,
        ts.trans_count,
        ts.latest_date,
        rt.transactions
    FROM transaction_summaries ts
    LEFT JOIN recent_trans rt ON ts.reg_id = rt.reg_id;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_market_transaction_summaries(INT, TEXT, INT, INT) TO authenticated;