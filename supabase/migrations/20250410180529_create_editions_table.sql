CREATE TABLE editions
(
    id         SERIAL PRIMARY KEY,
    name       TEXT        NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    end_date   TIMESTAMPTZ NOT NULL,
    is_open    BOOLEAN     NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- we want to have only one edition enabled at one time
CREATE UNIQUE INDEX only_one_open_edition
    ON editions (is_open)
    WHERE is_open = true;
