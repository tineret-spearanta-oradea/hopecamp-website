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
            .select('*, user_roles!left ( is_super_admin ), ...auth_users_view!inner ( email, phone )')
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

export function mapUserProfileDbRow(data: any): UserProfile { // Add export
    return {
        userId: data.user_id,
        name: data.name,
        phone: data.phone,
        isSuperAdmin: data.user_roles?.is_super_admin ?? false,
        imageUrl: data.image_url,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        age: data.age,
        gender: data.gender || 'unknown',
    };
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
        gender: formData.userData.gender,
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
        withFamilyMember: false,
      },
      display_name: formData.userData.name,
    };

};

export async function changeUserSuperAdminStatus(userId: string, newIsSuperAdmin:boolean): Promise<void> {
    const { error } = await supabaseBrowserClient
      .from("user_roles")
      .upsert({
         user_id: userId,
         is_super_admin: newIsSuperAdmin,
         updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
    if (error) {
         console.error("Error updating super admin role:", error.message);
         throw error;
    }
}

export async function getUserNameById(userId: string): Promise<string | null> {
    try {
        const { data, error } = await supabaseBrowserClient
            .from("user_profiles")
            .select('name')
            .eq("user_id", userId)
            .single();

        if (error) {
            console.error("Error fetching user name:", error.message);
            return null;
        }
        return data?.name || null;
    } catch (error: any) {
        console.error("Unexpected error fetching user name:", error.message);
        return null;
    }
}

export async function updateUserGender(userId: string, gender: 'male' | 'female' | 'unknown'): Promise<void> {
    try {
        const { error } = await supabaseBrowserClient
            .from("user_profiles")
            .update({
                gender: gender,
                updated_at: new Date().toISOString()
            })
            .eq("user_id", userId);

        if (error) {
            console.error("Error updating user gender:", error.message);
            throw error;
        }
    } catch (error: any) {
        console.error("Unexpected error updating user gender:", error.message);
        throw error;
    }
}

/**
 * Check if a phone number exists in the database
 * Used for determining new vs returning user flow
 * IMPORTANT: This should be used with rate limiting
 */
export async function checkPhoneExists(phone: string, client?: SupabaseClient): Promise<{ exists: boolean; userId?: string }> {
    // Use the provided client or default to the browser client
    const supabase = client || supabaseBrowserClient;

    try {
        console.log("Checking phone:", phone);
        const { data, error } = await supabase
            .from("auth_users_view")
            .select("id")
            .eq("phone", phone)
            .maybeSingle();

        if (error) {
            console.error("Error checking phone:", error);
            return { exists: false };
        }

        return {
            exists: !!data,
            userId: data?.id
        };
    } catch (err) {
        console.error("Unexpected error checking phone:", err);
        return { exists: false };
    }
}
