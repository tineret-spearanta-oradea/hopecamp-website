import {AuthData, FormData, UserData} from '@/types/form';
import {RegistrationWithProfile} from '@/types/registrationWithProfile';
import {supabaseAdmin} from "@/lib/supabase/server";
import {createTestRegistrationWithProfile} from "@/lib/supabase/database/__tests__/helpers/registration";
import {getNewUserMetadata} from "@/lib/supabase/database/user";

export async function createUser(activeEditionId: number, profileOverrides: Partial<RegistrationWithProfile> = {}, formDataOverrides: Partial<FormData>={}) {
    // 1. Create base registration data using the new helper
    const testRegData = createTestRegistrationWithProfile({
        editionId: activeEditionId, // Ensure it uses the active edition
        ...profileOverrides
    });

    // 2. Create FormData based on the RegistrationWithProfile object
    const testFormDataFromRegistration = createTestFormData(testRegData);
    const testFormData = {...testFormDataFromRegistration, formDataOverrides};

    // 3. Generate metadata required by the trigger
    const metadata = getNewUserMetadata(testFormData, activeEditionId);

    // Act: Create the user using the admin API, passing the generated metadata
    const {data: authUser, error: authError} = await testSupabaseAdmin.auth.admin.createUser({
        email: testFormData.authData.email,
        password: testFormData.authData.password, // Use password from FormData
        email_confirm: true, // Skip email confirmation for test
        user_metadata: metadata, // Pass the specific metadata part
        app_metadata: {provider: 'email', providers: ['email']}, // Mimic app metadata
        id: testRegData.userId, // Assign the specific UUID from registration data
    });

    expect(authError).toBeNull();
    expect(authUser).toBeDefined();
    expect(authUser.user?.id).toBe(testRegData.userId);
    return testRegData;
}

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
function createTestFormData(
    registration: RegistrationWithProfile,
): FormData {
    // Extract UserData fields from RegistrationWithProfile
    const userData: UserData = {
        name: registration.name,
        age: registration.age.toString(), // Convert number back to string for form
        phone: registration.phone,
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

    // Create AuthData using email from registration and any overrides
    const authData: AuthData = {
        email: registration.email,
        password: 'password123', // Default password
        confirmPassword: 'password123',
    };

    return {
        authData: authData,
        userData: userData,
    };
}
