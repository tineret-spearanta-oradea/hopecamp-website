CREATE OR REPLACE VIEW public.users_view AS
SELECT ud.*, u.email, u.phone as auth_phone
FROM public.user_profiles ud
LEFT JOIN auth.users u ON u.id = ud.uid;
