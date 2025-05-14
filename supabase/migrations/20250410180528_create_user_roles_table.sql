CREATE TABLE user_roles
(
    user_id        UUID        NOT NULL PRIMARY KEY
        CONSTRAINT fk_user_roles_user_id REFERENCES public.user_profiles (user_id) ON DELETE CASCADE,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    is_super_admin BOOLEAN     NOT NULL DEFAULT false
);
