import {supabaseBrowserClient} from "@/lib/supabase/client"; // Assuming browser client usage

export interface UserRegistration {
    id: number;
    userId: string;
    editionId: number;
    church: string;
    churchContact?: string;
    payTaxTo: string;
    transport: string;
    preferences?: string;
    slopeActivity: string;
    createdAt: Date;
    updatedAt: Date;
    isConfirmed: boolean;
    amountPaid: number;
    withFamilyMember: boolean;
    isAdmin: boolean; // From user_registration_roles
}

export async function getUserRegistrationByUserId(userId: string): Promise<UserRegistration | null> {
    try {
        const { data, error } = await supabaseBrowserClient
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

        // Map the database result to the UserRegistration interface
        // The join returns user_registration_roles as an object or null
        const isAdmin = data.user_registration_roles ? data.user_registration_roles.is_admin : false;

        return {
            id: data.id,
            userId: data.user_id,
            editionId: data.edition_id,
            church: data.church,
            churchContact: data.church_contact,
            payTaxTo: data.pay_tax_to,
            transport: data.transport,
            preferences: data.preferences,
            slopeActivity: data.slope_activity,
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at),
            isConfirmed: data.is_confirmed,
            amountPaid: data.amount_paid,
            withFamilyMember: data.with_family_member,
            isAdmin: isAdmin,
        };

    } catch (err) {
        console.error("Unexpected error fetching user registration:", err);
        return null;
    }
}
