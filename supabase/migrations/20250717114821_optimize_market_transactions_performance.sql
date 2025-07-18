-- Optimize market transactions performance with bulk operations and pagination

-- Function to get market transaction summaries with current debt (bulk operation)
CREATE OR REPLACE FUNCTION public.get_market_transaction_summaries(
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
    total_transactions BIGINT,
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
            COALESCE(SUM(mt.amount), 0) as debt,
            COUNT(mt.id) as trans_count,
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

-- Function to get total count for pagination
CREATE OR REPLACE FUNCTION public.get_market_transaction_summaries_count(
    p_edition_id INT DEFAULT 1,
    p_search_query TEXT DEFAULT ''
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    total_count INTEGER;
BEGIN
    SELECT COUNT(DISTINCT r.id)::INTEGER
    INTO total_count
    FROM registrations r
    INNER JOIN user_profiles up ON r.user_id = up.user_id
    INNER JOIN auth_users_view auv ON up.user_id = auv.id
    INNER JOIN market_transactions mt ON r.id = mt.registration_id
    WHERE r.edition_id = p_edition_id
    AND (
        p_search_query = '' OR 
        up.name ILIKE '%' || p_search_query || '%' OR
        auv.phone ILIKE '%' || p_search_query || '%' OR
        mt.description ILIKE '%' || p_search_query || '%'
    );
    
    RETURN COALESCE(total_count, 0);
END;
$$;

-- Function to get detailed transactions for a specific registration (for detail page)
CREATE OR REPLACE FUNCTION public.get_registration_market_transactions_detailed(
    p_registration_id INT,
    p_limit INT DEFAULT 50,
    p_offset INT DEFAULT 0
)
RETURNS TABLE (
    id INT,
    registration_id INT,
    amount INTEGER,
    description TEXT,
    created_at TIMESTAMPTZ,
    created_by UUID,
    created_by_name TEXT,
    running_balance INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    WITH ordered_transactions AS (
        SELECT 
            mt.id,
            mt.registration_id,
            mt.amount,
            mt.description,
            mt.created_at,
            mt.created_by,
            COALESCE(up.name, 'Unknown') as created_by_name,
            SUM(mt2.amount) as running_balance
        FROM market_transactions mt
        LEFT JOIN user_profiles up ON mt.created_by = up.user_id
        LEFT JOIN market_transactions mt2 ON mt2.registration_id = mt.registration_id 
            AND mt2.created_at <= mt.created_at
        WHERE mt.registration_id = p_registration_id
        GROUP BY mt.id, mt.registration_id, mt.amount, mt.description, mt.created_at, mt.created_by, up.name
        ORDER BY mt.created_at DESC
        LIMIT p_limit OFFSET p_offset
    )
    SELECT * FROM ordered_transactions;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_market_transaction_summaries(INT, TEXT, INT, INT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_market_transaction_summaries_count(INT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_registration_market_transactions_detailed(INT, INT, INT) TO authenticated;