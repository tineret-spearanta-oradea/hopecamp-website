CREATE TABLE user_registration_roles
(
    registration_id INT PRIMARY KEY
        CONSTRAINT fk_user_registration_roles_registration_id REFERENCES registrations (id) ON DELETE CASCADE,
    is_admin        BOOLEAN NOT NULL DEFAULT false,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);
