import {AuthData, FormData, UserData} from '@/types/form';
import {RegistrationWithProfile} from '@/types/registrationWithProfile';
import {supabaseAdmin} from "@/lib/supabase/server";

const testSupabaseAdmin = supabaseAdmin!;


// Helper to delete ALL users from auth.users using the view
export async function deleteAllAuthUsers() {
    console.debug('Attempting to delete all auth users...');
    try {
        // 1. Fetch all user IDs from the view
        const {data: users, error: fetchError} = await testSupabaseAdmin
            .from('auth_users_view')
            .select('id');

        if (fetchError) {
            console.error("Error fetching users from auth_users_view:", fetchError);
            // Don't throw, allow tests to potentially run, but log the issue
            return;
        }

        if (!users || users.length === 0) {
            return;
        }

        console.debug(`Found ${users.length} users to delete.`);

        // 2. Delete each user
        const deletePromises = users.map(user => deleteAuthUser(user.id));
        const results = await Promise.allSettled(deletePromises);

        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                console.warn(`Failed to delete user ${users[index].id}:`, result.reason);
            }
        });
        console.debug('Finished deleting auth users.');

    } catch (error) {
        console.error("Unexpected error during deleteAllAuthUsers:", error);
    }
}

// Helper to delete users from auth.users - USE WITH CAUTION
async function deleteAuthUser(userId: string) {
    // Using the admin client to interact with the auth schema
    const {error} = await testSupabaseAdmin.auth.admin.deleteUser(userId);
    if (error && error.message !== 'User not found') { // Ignore error if user already deleted
        console.error(`Error deleting auth user ${userId}:`, error);
        // Decide if test should fail or just warn
        // throw error;
    }
}
/**
 * Creates a complete FormData object based on RegistrationWithProfile data.
 * @param registration - The RegistrationWithProfile object containing the base data.
 */
export function createTestFormData( // Add export
    registration: RegistrationWithProfile,
): FormData {
    // Extract UserData fields from RegistrationWithProfile
    const userData: UserData = {
        name: registration.name,
        age: registration.age.toString(), // Convert number back to string for form

        startDate: registration.startDate,
        endDate: registration.endDate,
        church: registration.church,
        churchOther: registration.churchOther,
        churchContact: registration.churchContact,
        payTaxTo: registration.payTaxTo,
        transport: registration.transport,
        imageUrl: registration.imageUrl,
        preferences: registration.preferences,
        slopeActivity: registration.slopeActivity, // Assuming slopeActivity string matches form values
    };

    // Create AuthData using phone from registration and any overrides
    const authData: AuthData = {
        phone: registration.phone,
    };

    return {
        authData: authData,
        userData: userData,
    };
}
