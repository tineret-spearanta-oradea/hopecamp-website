import {supabaseBrowserClient} from "@/lib/supabase/client";
import {UserProfile} from "@/types/userProfile";
import {FormData} from "@/types/form";
import type {SupabaseClient} from "@supabase/supabase-js";

export async function getUserProfile(userId: string, client?: SupabaseClient): Promise<UserProfile | null> {
    // Use the provided client or default to the browser client
    const supabase = client || supabaseBrowserClient;
    try {
        const {data, error} = await supabase
            .from("user_profiles")
            .select('*, user_roles!left ( is_super_admin )')
            .eq("user_id", userId)
            .single();

        if (error) {
            console.error("Error fetching user data:", error.message, `(User ID: ${userId})`);
            return null;
        }
        return mapUserProfileDbRow(data);
    } catch (error: any) {
        console.error("Unexpected error fetching user data:", error.message, `(User ID: ${userId})`);
        return null;
    }
}

export async function getAllUsersData(): Promise<UserProfile[]> {
    try {
        const {data, error} = await supabaseBrowserClient
            .from("users_view")
            .select("*");

        if (error || data === null) {
            // Log the error but don't throw, return null as per function signature
            console.error("Error fetching user data:", error);
            return [];
        }
        return data.map(row => mapUserProfileDbRow(row)).filter(row => row);
    } catch (error) {
        console.error("Unexpected error fetching user data:", error);
        return [];
    }
}

export const getNewUserMetadata = (
    formData: FormData,
    editionId: number // TODO remove this after we have edition selector on the UI
) => {
    return {
        userSignUpMetaData: {
            edition_id: editionId,
            display_name: formData.userData.name,
            age: formData.userData.age,
            phone: formData.userData.phone,
            church:
                formData.userData.church === "alta"
                    ? formData.userData.churchOther
                    : formData.userData.church,
            churchContact: formData.userData.churchContact || "",
            payTaxTo: formData.userData.payTaxTo,
            transport: formData.userData.transport,
            preferences: formData.userData.preferences,
            startDate: formData.userData.startDate,
            endDate: formData.userData.endDate,
            imageUrl: formData.userData.imageUrl,
            slopeActivity: slopeActivityMap[formData.userData.slopeActivity] || "nu",
            withFamilyMember: false,
        },
        display_name: formData.userData.name
    };
};

function mapUserProfileDbRow(data: any): UserProfile {
    return {
        userId: data.user_id,
        name: data.name,
        email: data.email,
        isSuperAdmin: data.user_roles?.is_super_admin ?? false,
        phone: data.phone,
        imageUrl: data.image_url,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        age: data.age,
    };
}

export async function getUsersWithPayments(): Promise<UserProfile[]> {
    try {
        // No join needed, pay_tax_to contains the name directly
        const {data, error} = await supabaseBrowserClient
            .from("users_view")
            .select(`*`) // Select all user fields
            .gt("amount_paid", 0)
            .order("amount_paid", {ascending: false});

        if (error) {
            console.error("Error fetching registrations with payments:", error);
            throw error;
        }
        if (!data) {
            // Should not happen if error is null, but good practice
            return [];
        }
        // Use existing mapping function, filter out nulls just in case mapUserProfileDbRow fails
        return data.map(row => mapUserProfileDbRow(row)).filter((user): user is UserProfile => user !== null);
    } catch (error) {
        // Catch unexpected errors during the operation (e.g., network issues)
        console.error("Unexpected error fetching registrations with payments:", error);
        throw error; // Re-throw the caught error
    }
}

export async function updateUserPayment(userId: string, amount: number, collectedBy: string): Promise<void> {
    try {
        const {error} = await supabaseBrowserClient
            .from("users_view")
            .update({
                amount_paid: amount,
                pay_tax_to: collectedBy,
                paid_on: new Date().toISOString(), // Set paid_on timestamp
                updated_at: new Date().toISOString(), // Also update updated_at
            })
            .eq("userId", userId);

        if (error) {
            console.error("Error updating user payment:", error);
            throw error; // Throw the error instead of returning it
        }
        // No return needed for void on success
    } catch (error) {
        // Catch unexpected errors during the operation
        console.error("Unexpected error updating user payment:", error);
        throw error; // Re-throw the caught error
    }
}


const slopeActivityMap: Record<string, string> = {
    no: "nu",
    visit: "vizita",
    ski: "schi",
    sled: "sanie",
};
export async function makeUserSuperAdmin(userId: string,  newIsAdmin:boolean): Promise<void> {
    const { error } = await supabaseBrowserClient
      .from("user_roles")
      .upsert({
         user_id: userId,
         is_super_admin: newIsAdmin,
         updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
    if (error) {
         console.error("Error updating super admin role:", error.message);
         throw error;
    }
}
