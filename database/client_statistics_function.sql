-- Create a function to get client statistics efficiently
CREATE OR REPLACE FUNCTION get_client_statistics()
RETURNS TABLE(
    total_clients BIGINT,
    active_clients BIGINT,
    leads BIGINT,
    opportunities BIGINT,
    inactive_clients BIGINT,
    lost_clients BIGINT,
    overdue_follow_ups BIGINT,
    total_estimated_value NUMERIC,
    conversion_rate NUMERIC
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) AS total_clients,
        COUNT(CASE WHEN status = 'active' THEN 1 END) AS active_clients,
        COUNT(CASE WHEN status = 'lead' THEN 1 END) AS leads,
        COUNT(CASE WHEN status = 'opportunity' THEN 1 END) AS opportunities,
        COUNT(CASE WHEN status = 'inactive' THEN 1 END) AS inactive_clients,
        COUNT(CASE WHEN status = 'lost' THEN 1 END) AS lost_clients,
        COUNT(CASE WHEN next_follow_up_date < NOW() AND status IN ('lead', 'opportunity') THEN 1 END) AS overdue_follow_ups,
        COALESCE(SUM(estimated_value), 0) AS total_estimated_value,
        CASE 
            WHEN COUNT(CASE WHEN status IN ('lead', 'opportunity') THEN 1 END) > 0 THEN
                ROUND(
                    (COUNT(CASE WHEN status = 'active' THEN 1 END)::NUMERIC / 
                     COUNT(CASE WHEN status IN ('lead', 'opportunity') THEN 1 END)::NUMERIC) * 100, 
                    2
                )
            ELSE 0 
        END AS conversion_rate
    FROM clients;
END;
$$;