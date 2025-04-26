-- Renamed table from users to userData
CREATE TABLE users_data
(
    uid                uuid        NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    name               TEXT        NOT NULL,
    age                INTEGER     NOT NULL,
    phone              TEXT        NOT NULL,
    church             TEXT        NOT NULL,
    church_contact     TEXT                 DEFAULT '',
    pay_tax_to         TEXT        NOT NULL,
    transport          TEXT        NOT NULL,
    preferences        TEXT,
    start_date         TIMESTAMPTZ,
    end_date           TIMESTAMPTZ,
    image_url          TEXT        NULL,
    slope_activity     TEXT        NOT NULL DEFAULT 'nu',
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    is_confirmed       BOOLEAN     NOT NULL DEFAULT false,
    is_admin           BOOLEAN     NOT NULL DEFAULT false,
    is_super_admin     BOOLEAN     NOT NULL DEFAULT false,
    amount_paid        INTEGER     NOT NULL DEFAULT 0,
    with_family_member BOOLEAN     NOT NULL DEFAULT false
);

-- inserts a row into public.users_data when a new user is created
create or replace function public.handle_new_user() -- Use 'create or replace' for idempotency
    returns trigger
    language plpgsql
    security definer set search_path = public -- Set search path to find public.users_data
as
$$
declare
    meta jsonb;
begin
    -- Extract the userSignUpMetaData object
    meta := new.raw_user_meta_data -> 'userSignUpMetaData';

    -- Check if userSignUpMetaData exists
    if meta is null then
        raise warning '[AUTH_TRIGGER] userSignUpMetaData not found in raw_user_meta_data for user %', new.id;
        -- Optionally insert a minimal record or just exit
        -- Example minimal insert:
        return new; -- Exit gracefully if metadata is missing
    end if;

    -- Insert into public.users_data table, extracting data from meta
    insert into public.users_data (uid,
                                   name,
                                   age,
                                   phone,
                                   church,
                                   church_contact,
                                   pay_tax_to,
                                   transport,
                                   preferences,
                                   start_date,
                                   end_date,
                                   image_url,
                                   slope_activity,
                                   created_at, -- Use the timestamp from metadata if available, otherwise default
                                   updated_at, -- Use the timestamp from metadata if available, otherwise default
                                   is_confirmed,
                                   is_admin,
                                   is_super_admin,
                                   amount_paid,
                                   with_family_member)
    values (new.id, -- UserData's UUID from auth.users
            meta ->> 'display_name',
            (meta ->> 'age')::integer, -- Cast age string to integer
            meta ->> 'phone',
            meta ->> 'church',
            COALESCE(meta ->> 'churchContact', ''), -- Default to empty string if null
            meta ->> 'payTaxTo',
            meta ->> 'transport',
            COALESCE(meta ->> 'preferences', ''), -- Default to empty string if null
            (meta ->> 'startDate')::timestamptz, -- Cast date string to timestamp with time zone
            (meta ->> 'endDate')::timestamptz, -- Cast date string to timestamp with time zone
            COALESCE(meta ->> 'imageUrl', ''), -- Default to empty string if null
            COALESCE(meta ->> 'slopeActivity', 'nu'), -- Default to 'nu' if null
            COALESCE((meta ->> 'createdAt')::timestamptz, now()), -- Use metadata timestamp or current time
            COALESCE((meta ->> 'updatedAt')::timestamptz, now()), -- Use metadata timestamp or current time
            false,
            false,
            false,
            0,
            COALESCE((meta ->> 'withFamilyMember')::boolean, false) -- Default to false if null
           );
    return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
    after insert
    on auth.users
    for each row
execute procedure public.handle_new_user();
