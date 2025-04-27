import {supabaseBrowserClient} from "@/lib/supabase/client";
import {RegistrationWithProfile} from "@/types/registrationWithProfile"; // Assuming browser client usage
export {getUserProfile} from "@/lib/supabase/database/user";

type FilterParams = { userId: string } | { phone: string };

export async function getUserRegistrationByEditionId(editionId: number, filterParams: FilterParams): Promise<RegistrationWithProfile | null> {

    let query = supabaseBrowserClient
        .from("registrations")
        .select(`
        *,
        user_registration_roles!left ( is_admin ),
        user_profiles!inner ( user_id, name, image_url, age, ...user_roles!left ( is_super_admin ), ...auth_users_view!inner ( email, phone ) )
        `)
        .eq("edition_id", editionId);

    if ("userId" in filterParams) {
        query = query.eq("user_id", filterParams.userId);
    } else {
        query = query.eq('user_profiles.auth_users_view.phone', `$4{filterParams.phone}`);// add 4 in front
    }


    try {
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

export async function getRegistrationsByEditionId(editionId: number): Promise<RegistrationWithProfile[]> {
    try {
        const {data, error} = await supabaseBrowserClient
            .from("registrations")
            .select(`
                *,
                user_registration_roles!left ( is_admin ),
                user_profiles!inner ( user_id, name, image_url, age, ...user_roles!left ( is_super_admin ), ...auth_users_view!inner ( email, phone ) )
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

function mapRegistrationWithProfile(row: any): RegistrationWithProfile {
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
        phone: row.phone,
        imageUrl: row.user_profiles.image_url,
        age: row.user_profiles.age,
        isSuperAdmin: row.user_profiles?.is_super_admin ?? false,
    });
}

// Allow updating most fields except roles (handled separately)
type UpdateRegistrationProfile = Omit<RegistrationWithProfile, "isAdmin" | "isSuperAdmin">;

// Please note that isAdmin and isSuperAdmin should be updated by calling changeUserAdminStatusForRegistration or changeUserSuperAdminStatus
export async function updateUserRegistrationProfile(registration: UpdateRegistrationProfile): Promise<void> {
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
        const {error: profileError} = await supabaseBrowserClient
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
            transport: registration.transport,
            preferences: registration.preferences,
            slope_activity: registration.slopeActivity,
            start_date: registration.startDate,
            end_date: registration.endDate,
            is_confirmed: registration.isConfirmed,
            amount_paid: registration.amountPaid,
            pay_tax_to: registration.payTaxTo,
            with_family_member: registration.withFamilyMember,
            updated_at: now
        };
        const {error: registrationError} = await supabaseBrowserClient
            .from("registrations")
            .update(registrationUpdates)
            .eq("id", registration.id);
        if (registrationError) {
            console.error("Error updating registration data:", registrationError);
            throw registrationError;
        }
    } catch (error) {
        console.error("Unexpected error during update:", error);
        throw error;
    }
}

export async function changeUserAdminStatusForRegistration(registrationId: number, newIsAdmin: boolean): Promise<void> {
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

/**
 * Updates the payment details (amount paid and collector) for a specific registration.
 * @param registrationId - The ID of the registration to update.
 * @param amountPaid - The new amount paid.
 * @param payTaxTo - The name of the person who collected the payment.
 */
export async function updateRegistrationPayment(registrationId: number, amountPaid: number, payTaxTo: string): Promise<void> {
    if (amountPaid < 0) {
        throw new Error("Amount paid cannot be negative.");
    }

    const { error } = await supabaseBrowserClient
        .from("registrations")
        .update({
            amount_paid: amountPaid,
            pay_tax_to: payTaxTo,
            updated_at: new Date().toISOString(),
        })
        .eq("id", registrationId);

    if (error) {
        console.error(`Error updating payment for registration ${registrationId}:`, error.message);
        throw error;
    }
}
