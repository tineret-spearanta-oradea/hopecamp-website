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
        user_profiles!inner ( user_id, name, image_url, age, gender, ...user_roles!left ( is_super_admin ), ...auth_users_view!inner ( email, phone ) )
        `)
        .eq("edition_id", editionId);

    if ("userId" in filterParams) {
        query = query.eq("user_id", filterParams.userId);
    } else {
        query = query.eq('user_profiles.auth_users_view.phone', filterParams.phone);
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

export async function getRegistrationById(registrationId: number): Promise<RegistrationWithProfile | null> {
    try {
        const { data, error } = await supabaseBrowserClient
            .from("registrations")
            .select(`
                *,
                user_registration_roles!left ( is_admin ),
                user_profiles!inner ( user_id, name, image_url, age, gender, ...user_roles!left ( is_super_admin ), ...auth_users_view!inner ( email, phone ) )
            `)
            .eq("id", registrationId)
            .single();

        if (error) {
            console.error("Error fetching registration by ID:", error.message);
            return null;
        }

        if (!data) {
            return null;
        }

        return mapRegistrationWithProfile(data);
    } catch (err) {
        console.error("Unexpected error fetching registration by ID:", err);
        return null;
    }
}

export async function getRegistrationsByEditionId(editionId: number): Promise<RegistrationWithProfile[]> {
    try {
        const { data, error } = await supabaseBrowserClient
          .from("registrations")
          .select(
            `
                *,
                user_registration_roles!left ( is_admin ),
                user_profiles!inner ( user_id, name, image_url, age, gender, ...user_roles!left ( is_super_admin ), ...auth_users_view!inner ( email, phone ) )
            `
          )
          .order("created_at", { ascending: false })
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
    return {
      id: row.id,
      userId: row.user_id,
      editionId: row.edition_id,
      church: row.church,
      churchOther: row.church_other,
      churchContact: row.church_contact,
      payTaxTo: row.pay_tax_to,
      transport: row.transport,
      preferences: row.preferences,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      updatedBy: row.updated_by,
      startDate: new Date(row.start_date),
      endDate: new Date(row.end_date),
      isConfirmed: row.is_confirmed,
      amountPaid: row.amount_paid,
      paymentUpdatedAt: row.payment_updated_at ? new Date(row.payment_updated_at) : undefined,
      paymentUpdatedBy: row.payment_updated_by,
      withFamilyMember: row.with_family_member,
      isAdmin: row.user_registration_roles?.is_admin ?? false,
      name: row.user_profiles.name,
      phone: row.user_profiles.phone.slice(1), // REMOVE THE PREFIX "4"
      imageUrl: row.user_profiles.image_url,
      age: row.user_profiles.age,
      gender: row.user_profiles.gender || 'unknown',
      isSuperAdmin: row.user_profiles?.is_super_admin ?? false,
    };
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
            image_url: registration.imageUrl,
            age: registration.age,
            gender: registration.gender,
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
          start_date: registration.startDate,
          end_date: registration.endDate,
          is_confirmed: registration.isConfirmed,
          amount_paid: registration.amountPaid,
          pay_tax_to: registration.payTaxTo,
          with_family_member: registration.withFamilyMember,
          updated_at: now,
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

/**
 * Get user's most recent registration (any edition)
 * Used for pre-filling registration form
 */
export async function getUserMostRecentRegistration(userId: string): Promise<RegistrationWithProfile | null> {
    try {
        const { data, error } = await supabaseBrowserClient
            .from("registrations")
            .select(`
                *,
                user_registration_roles!left ( is_admin ),
                user_profiles!inner ( user_id, name, image_url, age, gender, ...user_roles!left ( is_super_admin ), ...auth_users_view!inner ( email, phone ) )
            `)
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error) {
            console.error("Error fetching most recent registration:", error.message);
            return null;
        }

        if (!data) {
            return null;
        }

        return mapRegistrationWithProfile(data);
    } catch (err) {
        console.error("Unexpected error fetching most recent registration:", err);
        return null;
    }
}

/**
 * Get all registrations for a user, ordered by date (newest first)
 * Used for displaying registration history
 * Optionally exclude a specific edition (e.g., current one)
 */
export async function getUserRegistrationHistory(
    userId: string,
    excludeEditionId?: number
): Promise<Array<{
    id: number;
    editionId: number;
    editionName: string;
    editionTitle?: string;
    startDate: Date;
    endDate: Date;
}>> {
    try {
        let query = supabaseBrowserClient
            .from("registrations")
            .select(`
                id,
                edition_id,
                start_date,
                end_date,
                editions!inner (
                    name,
                    title
                )
            `)
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (excludeEditionId !== undefined) {
            query = query.neq("edition_id", excludeEditionId);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching registration history:", error.message);
            return [];
        }

        if (!data || data.length === 0) {
            return [];
        }

        return data.map((row: any) => ({
            id: row.id,
            editionId: row.edition_id,
            editionName: row.editions.name,
            editionTitle: row.editions.title,
            startDate: new Date(row.start_date),
            endDate: new Date(row.end_date),
        }));
    } catch (err) {
        console.error("Unexpected error fetching registration history:", err);
        return [];
    }
}

/**
 * Check if user has an existing registration for a specific edition
 * Used to prevent duplicate registrations
 */
export async function checkUserRegistrationExists(
    userId: string,
    editionId: number
): Promise<boolean> {
    try {
        const { data, error } = await supabaseBrowserClient
            .from("registrations")
            .select("id")
            .eq("user_id", userId)
            .eq("edition_id", editionId)
            .maybeSingle();

        if (error) {
            console.error("Error checking user registration existence:", error.message);
            return false;
        }

        return !!data;
    } catch (err) {
        console.error("Unexpected error checking registration existence:", err);
        return false;
    }
}

/**
 * Create a new registration for a returning user
 * Used when a user registers for a new edition
 */
export async function createRegistrationForReturningUser(
    userId: string,
    editionId: number,
    registrationData: {
        church: string;
        churchContact: string;
        payTaxTo: string;
        transport: string;
        preferences: string;
        startDate: Date;
        endDate: Date;
        withFamilyMember: boolean;
    }
): Promise<{ success: boolean; error?: string }> {
    try {
        const { error } = await supabaseBrowserClient
            .from("registrations")
            .insert({
                user_id: userId,
                edition_id: editionId,
                church: registrationData.church,
                church_contact: registrationData.churchContact,
                pay_tax_to: registrationData.payTaxTo,
                transport: registrationData.transport,
                preferences: registrationData.preferences,
                start_date: registrationData.startDate.toISOString(),
                end_date: registrationData.endDate.toISOString(),
                with_family_member: registrationData.withFamilyMember,
            });

        if (error) {
            console.error("Error creating registration for returning user:", error.message);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        console.error("Unexpected error creating registration:", err);
        return { success: false, error: "Unexpected error" };
    }
}
