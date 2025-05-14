CREATE TABLE user_profiles
(
    user_id        UUID        NOT NULL PRIMARY KEY
        CONSTRAINT fk_user_profiles_user_id REFERENCES auth.users ON DELETE CASCADE,
    name           TEXT        NOT NULL,
    age            INTEGER     NOT NULL,
    image_url      TEXT        NULL,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
