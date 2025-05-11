-- Seed data for the editions table

-- Insert a sample edition (adjust dates and name as needed)
INSERT INTO public.editions (name, start_date, end_date, is_open)
VALUES ('Hope Camp #6', '2025-08-04 00:00:00+00', '2025-08-09 00:00:00+00', true)
ON CONFLICT (is_open) WHERE is_open = true
DO NOTHING; -- current edition

-- Insert another example edition (closed)
INSERT INTO public.editions (name, start_date, end_date, is_open)
VALUES ('Winter Camp #2', '2024-07-20 00:00:00+00', '2024-07-25 00:00:00+00', false);

-- Initialize the heartbeat table with a single record
INSERT INTO public.heartbeat (description)
VALUES ('Initial project heartbeat')
ON CONFLICT DO NOTHING;

-- Call the update function to ensure the last_beat timestamp is current
SELECT update_heartbeat();
