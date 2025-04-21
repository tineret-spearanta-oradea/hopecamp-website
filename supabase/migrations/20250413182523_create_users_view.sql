-- auth.users is not visible. Expose the user and phone number from it
CREATE OR REPLACE VIEW public.auth_users_view AS
SELECT id, email, auth.users.phone as auth_phone
FROM auth.users
         INNER JOIN public.user_profiles up on users.id = up.user_id;



