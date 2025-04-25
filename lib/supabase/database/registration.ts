import {supabaseBrowserClient} from "@/lib/supabase/client";
import {UserRegistration} from "@/types/userRegistration";
import {RegistrationWithProfile} from "@/types/registrationWithProfile"; // Assuming browser client usage
export { getUserProfile } from "@/lib/supabase/database/user";

export async function getUserRegistrationByUserId(userId: string): Promise<UserRegistration | null> {
    try {
        const {data, error} = await supabaseBrowserClient
            .from("registrations")
            .select(
                '*, user_registration_roles!left (is_admin)'
            )
            .eq("user_id", userId)
            .maybeSingle(); // Use maybeSingle() as a user might not have a registration

        if (error) {
            console.error("Error fetching user registration:", error.message);
            return null;
        }

        if (!data) {
            return null; // No registration found for this user
        }

        return {
            id: data.id,
            userId: data.user_id,
            editionId: data.edition_id,
            church: data.church,
            churchOther: data.church_other,
            churchContact: data.church_contact,
            payTaxTo: data.pay_tax_to,
            transport: data.transport,
            preferences: data.preferences,
            slopeActivity: data.slope_activity,
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at),
            startDate: new Date(data.start_date),
            endDate: new Date(data.end_date),
            isConfirmed: data.is_confirmed,
            amountPaid: data.amount_paid,
            withFamilyMember: data.with_family_member,
            isAdmin: data.user_registration_roles?.is_admin ?? false,
        };

    } catch (err) {
        console.error("Unexpected error fetching user registration:", err);
        return null;
    }
}

function mapRegistrationWithProfile(row: any):RegistrationWithProfile {
    return ({
        id: row.id,
        userId: row.user_id,
        editionId: row.edition_id,
        church: row.church,
        churchOther: row.church_other,
        churchContact: row.church_contact,
        payTaxTo: row.pay_tax_to,
        transport: row.transport,
        preferences: row.preferences,
        slopeActivity: row.slope_activity,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
        startDate: new Date(row.start_date),
        endDate: new Date(row.end_date),
        isConfirmed: row.is_confirmed,
        amountPaid: row.amount_paid,
        withFamilyMember: row.with_family_member,
        isAdmin: row.user_registration_roles?.is_admin ?? false,
        name: row.user_profiles.name,
        email: row.user_profiles.email,
        phone: row.user_profiles.phone,
        imageUrl: row.user_profiles.image_url,
        age: row.user_profiles.age,
        isSuperAdmin: row.user_profiles?.is_super_admin ?? false,
    });
}

export async function getRegistrationsByEditionId(editionId: number): Promise<RegistrationWithProfile[]> {
    try {
        const {data, error} = await supabaseBrowserClient
            .from("registrations")
            .select(`
                *,
                user_registration_roles!left ( is_admin ),
                user_profiles!inner ( user_id, name, phone, image_url, age, ...user_roles!left ( is_super_admin ), ...auth_users_view!inner ( email ) )
            `)
            .eq("edition_id", editionId);

        if (error) {
            console.error("Error fetching registrations:", error.message);
            return [];
        }

        if (!data) {
            return [];
        }

        return data.map(mapRegistrationWithProfile);
    } catch (err) {
        console.error("Unexpected error fetching registrations by edition:", err);
        return [];
    }
}

export async function getUserRegistrationByEditionId(editionId: number, userId?: string, email?: string): Promise<RegistrationWithProfile | null> {
    // Base select string
    let selectString = `
        *,
        user_registration_roles!left ( is_admin ),
        user_profiles!inner ( user_id, name, phone, image_url, age, ...user_roles!left ( is_super_admin ), ...auth_users_view!inner ( email ) )
    `;

    // If email is provided, modify the select string to filter within the join
    // Note: This approach might be less efficient if the email filter significantly reduces the primary results.
    // However, it directly addresses the filtering on the joined table's column.
    // We are essentially telling it to only join auth_users_view where email matches.
    if (email !== undefined) {
         selectString = `
            *,
            user_registration_roles!left ( is_admin ),
            user_profiles!inner ( user_id, name, phone, image_url, age, ...user_roles!left ( is_super_admin ), ...auth_users_view!inner ( email ) )
        `;
        // The filter needs to be applied *after* the select, targeting the joined view's column
    }


    let query = supabaseBrowserClient
        .from("registrations")
        .select(selectString)
        .eq("edition_id", editionId);

    // Apply filters directly on the primary table or explicitly joined columns if possible
    if (userId !== undefined) {
        query = query.eq("user_id", userId);
    }
     // Apply the email filter using the correct syntax for filtering on related tables
     if (email !== undefined) {
        // Use the foreign table name and the column name with the 'inner' keyword hint if needed
        query = query.eq('user_profiles.auth_users_view.email', email);
     }


    try {
        // Use maybeSingle as we expect at most one result per user/email per edition
        const {data, error} = await query.maybeSingle();

        if (error) {
            console.error("Error fetching registration of the user", error.message);
            return null;
        }

        if (!data) {
            return null;
        }

        return mapRegistrationWithProfile(data);
    } catch (err) {
        console.error("Unexpected error fetching registration by edition and by user:", err);
        return null;
    }
}

export async function makeUserAdminForEdition(userId: string, registrationId: number, newIsAdmin: boolean): Promise<void> {
    // Upsert in the user_registration_roles table to mark as admin
    const {error: roleError} = await supabaseBrowserClient
        .from("user_registration_roles")
        .upsert({
            registration_id: registrationId,
            is_admin: newIsAdmin,
            updated_at: new Date().toISOString(),
        }, {onConflict: 'registration_id'});
    if (roleError) {
        console.error("Error updating admin role:", roleError.message);
        throw roleError;
    }
}
export async function updateUserData(registration: RegistrationWithProfile): Promise<void> {
    try {
        const now = new Date().toISOString();

        // Update user_profiles table
        const userUpdates = {
            name: registration.name,
            phone: registration.phone,
            image_url: registration.imageUrl,
            age: registration.age,
            updated_at: now
        };
        const { error: profileError } = await supabaseBrowserClient
            .from("user_profiles")
            .update(userUpdates)
            .eq("user_id", registration.userId);
        if (profileError) {
            console.error("Error updating user profile data:", profileError);
            throw profileError;
        }

        // Update registrations table
        const registrationUpdates = {
            church: registration.church,
            church_other: registration.churchOther,
            church_contact: registration.churchContact || "",
            pay_tax_to: registration.payTaxTo,
            transport: registration.transport,
            preferences: registration.preferences,
            slope_activity: registration.slopeActivity,
            start_date: registration.startDate,
            end_date: registration.endDate,
            amount_paid: registration.amountPaid,
            updated_at: now
        };
        const { error: registrationError } = await supabaseBrowserClient
            .from("registrations")
            .update(registrationUpdates)
            .eq("id", registration.id);
        if (registrationError) {
            console.error("Error updating registration data:", registrationError);
            throw registrationError;
        }

        // Upsert the role in user_roles table
        const { error: roleError } = await supabaseBrowserClient
            .from("user_roles")
            .upsert(
                {
                    user_id: registration.userId,
                    is_super_admin: registration.isSuperAdmin,
                    updated_at: now
                },
                { onConflict: 'user_id' }
            );
        if (roleError) {
            console.error("Error upserting user role:", roleError);
            throw roleError;
        }
    } catch (error) {
        console.error("Unexpected error during update:", error);
        throw error;
    }
}
