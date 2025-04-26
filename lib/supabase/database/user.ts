import { supabaseBrowserClient } from "@/lib/supabase/client";
import { UserData } from "@/types/userData";
import { FormData } from "@/types/form";
import type { SupabaseClient } from "@supabase/supabase-js"; // Import type

// Modify getUserData to accept an optional client
export async function getUserData(userId: string, client?: SupabaseClient): Promise<UserData | null> {
    // Use the provided client or default to the browser client
    const supabase = client || supabaseBrowserClient;
    try {
        const { data, error } = await supabase
            .from("users_data")
            .select("*")
            .eq("uid", userId)
            .single();

        if (error) {
            console.error("Error fetching user data:", error.message, `(User ID: ${userId})`);
            // Handle specific errors like 'PGRST116' (resource not found) gracefully
            if (error.code === 'PGRST116') {
                return null; // User data not found is not necessarily a system error
            }
            // For other errors, still return null
            return null;
        }
        // Ensure data is not null before mapping (though .single() should handle this)
        return data ? mapUserDataDbRow(data) : null;
    } catch (error: any) {
        console.error("Unexpected error fetching user data:", error.message, `(User ID: ${userId})`);
        return null;
    }
}

export async function getUserDataByEmail(email: string): Promise<UserData | null> {
    try {
        const { data, error } = await supabaseBrowserClient
            .from("users_view")
            .select("*")
            .eq("email", email)
            .single();

        if (error) {
            // Log the error but don't throw, return null as per function signature
            console.error("Error fetching user data:", error);
            return null;
        }
        return mapUserDataDbRow(data);
    } catch (error) {
        console.error("Unexpected error fetching user data:", error);
        return null;
    }
}

export async function getAllUsersData(): Promise<UserData[]> {
    try {
        const { data, error } = await supabaseBrowserClient
            .from("users_view")
            .select("*");

        if (error || data === null) {
            // Log the error but don't throw, return null as per function signature
            console.error("Error fetching user data:", error);
            return [];
        }
        return data.map(row => mapUserDataDbRow(row)).filter(row => row);
    } catch (error) {
        console.error("Unexpected error fetching user data:", error);
        return [];
    }
}

export const getNewUserMetadata=  (
    formData: FormData,
) => {
    return {userSignUpMetaData:{
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
            createdAt: new Date(),
            updatedAt: new Date(),
            withFamilyMember: false,
        },
        display_name: formData.userData.name};
};

function mapUserDataDbRow(data: any):UserData {
    return {
        uid: data.uid,
        name: data.name,
        email: data.email,
        isAdmin: data.is_admin,
        isSuperAdmin: data.is_super_admin,
        phone: data.phone,
        church: data.church,
        churchContact: data.church_contact,
        imageUrl: data.image_url,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        isConfirmed: data.is_confirmed,
        startDate: data.start_date ? new Date(data.start_date) : undefined,
        endDate: data.end_date ? new Date(data.end_date) : undefined,
        transport: data.transport,
        preferences: data.preferences,
        amountPaid: data.amount_paid,
        payTaxTo: data.pay_tax_to,
        age: data.age,
        withFamilyMember: data.with_family_member,
        slopeActivity: data.slope_activity,
        paidOn: data.paid_on ? new Date(data.paid_on) : undefined,
    };
}

export async function getUsersWithPayments(): Promise<UserData[]> {
    try {
        // No join needed, pay_tax_to contains the name directly
        const { data, error } = await supabaseBrowserClient
            .from("users_view")
            .select(`*`) // Select all user fields
            .gt("amount_paid", 0)
            .order("amount_paid", { ascending: false });

        if (error) {
            console.error("Error fetching users with payments:", error);
            throw error;
        }
        if (!data) {
             // Should not happen if error is null, but good practice
            return [];
        }
        // Use existing mapping function, filter out nulls just in case mapUserDataDbRow fails
        return data.map(row => mapUserDataDbRow(row)).filter((user): user is UserData => user !== null);
    } catch (error) {
        // Catch unexpected errors during the operation (e.g., network issues)
        console.error("Unexpected error fetching users with payments:", error);
        throw error; // Re-throw the caught error
    }
}

// Function to update user data
export async function updateUserData(userData: UserData): Promise<void> {
    try {
        // Map UserData fields to database column names
        const updates = {
            name: userData.name,
            phone: userData.phone,
            church: userData.church,
            church_contact: userData.churchContact,
            image_url: userData.imageUrl,
            is_confirmed: userData.isConfirmed,
            start_date: userData.startDate?.toISOString(),
            end_date: userData.endDate?.toISOString(),
            transport: userData.transport,
            preferences: userData.preferences,
            amount_paid: userData.amountPaid,
            pay_tax_to: userData.payTaxTo,
            age: userData.age,
            with_family_member: userData.withFamilyMember,
            slope_activity: userData.slopeActivity,
            is_admin: userData.isAdmin,
            is_super_admin: userData.isSuperAdmin,
            paid_on: userData.paidOn?.toISOString(),
            updated_at: new Date().toISOString(), // Always update the timestamp
        };

        // Remove undefined fields to avoid overwriting existing data with null
        Object.keys(updates).forEach(key => {
            if ((updates as any)[key] === undefined) {
                delete (updates as any)[key];
            }
        });


        const { error } = await supabaseBrowserClient
            .from("users_data")
            .update(updates)
            .eq("uid", userData.uid);

        if (error) {
            console.error("Error updating user data:", error);
            throw error;
        }
    } catch (error) {
        console.error("Unexpected error updating user data:", error);
        throw error;
    }
}

export async function updateUserPayment(userId: string, amount: number, collectedBy: string): Promise<void> {
    try {
        const { error } = await supabaseBrowserClient
            .from("users_view")
            .update({
                amount_paid: amount,
                pay_tax_to: collectedBy,
                paid_on: new Date().toISOString(), // Set paid_on timestamp
                updated_at: new Date().toISOString(), // Also update updated_at
             })
            .eq("uid", userId);

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
