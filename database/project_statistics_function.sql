-- Create a function to get project statistics efficiently
CREATE OR REPLACE FUNCTION get_project_statistics()
RETURNS TABLE(
    total_projects BIGINT,
    active_projects BIGINT,
    completed_projects BIGINT,
    on_hold_projects BIGINT,
    average_progress NUMERIC,
    total_budget NUMERIC,
    total_actual_cost NUMERIC,
    total_revenue NUMERIC
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) AS total_projects,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) AS active_projects,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed_projects,
        COUNT(CASE WHEN status = 'on_hold' THEN 1 END) AS on_hold_projects,
        COALESCE(ROUND(AVG(progress)::NUMERIC, 2), 0) AS average_progress,
        COALESCE(SUM(budget), 0) AS total_budget,
        COALESCE(SUM(actual_cost), 0) AS total_actual_cost,
        COALESCE(SUM(actual_revenue), 0) AS total_revenue
    FROM projects;
END;
$$;