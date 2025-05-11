-- Seed data for the editions table

-- Insert a sample edition (adjust dates and name as needed)
INSERT INTO public.editions (name, start_date, end_date, is_open)
VALUES ('Hope Camp #6', '2025-08-04 00:00:00+00', '2025-08-09 00:00:00+00', true)
ON CONFLICT (is_open) WHERE is_open = true
DO NOTHING; -- current edition

-- Insert another example edition (closed)
INSERT INTO public.editions (name, start_date, end_date, is_open)
VALUES ('Winter Camp #2', '2024-07-20 00:00:00+00', '2024-07-25 00:00:00+00', false);

-- Ensure ping_status table has an entry for keeping the database active
INSERT INTO public.ping_status (id, last_ping, ping_count, notes)
VALUES (1, NOW(), 0, 'Initial ping record. This is used to prevent database pausing due to inactivity.')
ON CONFLICT (id) DO UPDATE
SET 
    last_ping = NOW(),
    notes = 'Ping record refreshed during seeding on ' || NOW();
