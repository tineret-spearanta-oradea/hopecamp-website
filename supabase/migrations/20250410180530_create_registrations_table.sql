CREATE TABLE registrations
(
    id                 SERIAL PRIMARY KEY,
    user_id            UUID        NOT NULL
        CONSTRAINT fk_registrations_user_id REFERENCES public.user_profiles (user_id) ON DELETE CASCADE,
    edition_id         INT         NOT NULL
        CONSTRAINT fk_registrations_edition_id REFERENCES editions (id) ON DELETE CASCADE,
    church             TEXT        NOT NULL,
    church_contact     TEXT                 DEFAULT '',
    church_other       TEXT                 DEFAULT '',
    pay_tax_to         TEXT        NOT NULL,
    transport          TEXT        NOT NULL,
    preferences        TEXT,
    slope_activity     TEXT        NOT NULL DEFAULT 'nu',
    start_date         TIMESTAMPTZ NOT NULL,
    end_date           TIMESTAMPTZ NOT NULL,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    is_confirmed       BOOLEAN     NOT NULL DEFAULT false,
    amount_paid        INTEGER     NOT NULL DEFAULT 0 CHECK (amount_paid >= 0), -- maybe we should create a new table for income
    with_family_member BOOLEAN     NOT NULL DEFAULT false
);

-- we want to have only one registration_per_edition_per_user
CREATE UNIQUE INDEX only_one_open_registration_per_edition_per_user
    ON registrations (user_id, edition_id);
