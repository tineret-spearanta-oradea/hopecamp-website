CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public
AS
$$
DECLARE
    meta            JSONB;
    edition_id_val  INT;
    edition_is_open BOOLEAN;
BEGIN
    -- Extract the userSignUpMetaData object
    meta := NEW.raw_user_meta_data -> 'userSignUpMetaData';

    -- Check if userSignUpMetaData exists
    IF meta IS NULL THEN
        RAISE WARNING '[AUTH_TRIGGER] userSignUpMetaData not found in raw_user_meta_data for user %', NEW.id;
        RETURN NEW;
    END IF;

    -- 1) Insert into public.user_profiles
    INSERT INTO public.user_profiles (user_id,
                                      name,
                                      age,
                                      phone,
                                      image_url)
    VALUES (NEW.id, -- from auth.users
            meta ->> 'display_name',
            (meta ->> 'age')::INTEGER,
            meta ->> 'phone',
            COALESCE(meta ->> 'imageUrl', ''));

    -- 2) Parse edition_id (if provided) and check if that edition is open
    edition_id_val := NULLIF(meta ->> 'edition_id', '')::INT;

    IF edition_id_val IS NOT NULL THEN
        SELECT is_open
        INTO edition_is_open
        FROM editions
        WHERE id = edition_id_val;

        IF edition_is_open THEN
            -- If the edition is open, insert into registrations
            INSERT INTO public.registrations (user_id,
                                              edition_id,
                                              church,
                                              church_contact,
                                              pay_tax_to,
                                              transport,
                                              preferences,
                                              slope_activity,
                                              start_date,
                                              end_date,
                                              with_family_member)
            VALUES (NEW.id,
                    edition_id_val,
                    meta ->> 'church',
                    COALESCE(meta ->> 'churchContact', ''),
                    meta ->> 'payTaxTo',
                    meta ->> 'transport',
                    COALESCE(meta ->> 'preferences', ''),
                    COALESCE(meta ->> 'slopeActivity', 'nu'),
                    (meta ->> 'startDate')::TIMESTAMPTZ,
                    (meta ->> 'endDate')::TIMESTAMPTZ,
                    COALESCE((meta ->> 'withFamilyMember')::BOOLEAN, FALSE));
        ELSE
            -- Edition exists but isn't open
            RAISE WARNING '[AUTH_TRIGGER] Edition % is not open. Skipping registration for user %.',
                edition_id_val,
                NEW.id;
        END IF;

    ELSE
        -- No edition_id provided
        RAISE WARNING '[AUTH_TRIGGER] No edition_id provided for user %', NEW.id;
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT
    ON auth.users
    FOR EACH ROW
EXECUTE PROCEDURE public.handle_new_user();
