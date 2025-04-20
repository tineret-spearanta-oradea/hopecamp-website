-- Seed data for the editions table

-- Insert a sample edition (adjust dates and name as needed)
INSERT INTO public.editions (name, start_date, end_date, is_open)
VALUES ('Hope Camp 2024', '2024-07-20 00:00:00+00', '2024-07-25 00:00:00+00', true)
ON CONFLICT (is_open) WHERE is_open = true
DO NOTHING; -- current edition

-- Insert another example edition (closed)
INSERT INTO public.editions (name, start_date, end_date, is_open)
VALUES ('Hope Camp 2023', '2023-07-15 00:00:00+00', '2023-07-20 00:00:00+00', false);
