import {supabaseBrowserClient} from "@/lib/supabase/client";
import {UserProfile} from "@/types/userProfile"; // Assuming browser client usage

export interface UserRegistration {
    id: number;
    userId: string;
    editionId: number;
    church: string;
    churchOther: string;
    churchContact?: string;
    payTaxTo: string;
    transport: string;
    preferences?: string;
    slopeActivity: string;
    createdAt: Date;
    updatedAt: Date;
    startDate: Date;
    endDate: Date;
    isConfirmed: boolean;
    amountPaid: number;
    withFamilyMember: boolean;
    // Fields from user_registration_roles
    isAdmin: boolean;
}

export interface RegistrationWithProfile extends UserRegistration, UserProfile {
}

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

function mapRegistrationWithProfile(row: any) {
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
                user_profiles: user_profiles!inner ( user_id, name, phone, image_url, age, ...user_roles!left ( is_super_admin ), ...auth_users_view!inner ( email ) )
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
    const query = supabaseBrowserClient
        .from("registrations")
        .select(`
            *,
            user_registration_roles!left ( is_admin ),
            user_profiles: user_profiles!inner ( user_id, name, phone, image_url, age, ...user_roles!left ( is_super_admin ), ...auth_users_view!inner ( email ) )
        `)
        .eq("edition_id", editionId);
    if (email !== undefined)
        query.eq("user_profiles.email", email);
    if (userId !== undefined)
        query.eq("user_id", userId);
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
