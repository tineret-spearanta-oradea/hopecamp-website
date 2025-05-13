import {RegistrationWithProfile} from '@/types/registrationWithProfile';
import {v4 as uuidv4} from 'uuid';
import {FormData} from "@/types/form";
import {getNewUserMetadata} from "@/lib/supabase/database/user";
import {createTestFormData} from "@/lib/supabase/database/__tests__/helpers/user";
import {supabaseAdmin} from "@/lib/supabase/server";
import {getUserRegistrationByEditionId} from "@/lib/supabase/database/registration"; // Ensure uuid is installed


const testSupabaseAdmin = supabaseAdmin!;

/**
 * Creates a default RegistrationWithProfile object for testing.
 * @param overrides - Partial data to override defaults.
 * @returns A RegistrationWithProfile object.
 */
export function createTestRegistrationWithProfile(overrides: Partial<RegistrationWithProfile> = {}): RegistrationWithProfile {
    const userId = overrides.userId || uuidv4();
    const now = new Date();
    const startDate = overrides.startDate || new Date(2025, 1, 20); // Feb 20, 2025
    const endDate = overrides.endDate || new Date(2025, 1, 23); // Feb 23, 2025

    const defaults: RegistrationWithProfile = {
      // UserProfile fields
      userId: userId,
      name: "Test Reg User",
      phone: `40${770123456 + Math.floor(Math.random() * 10000) + 1}`,
      age: 28,
      imageUrl: "",
      isSuperAdmin: false,
      createdAt: now, // Will be slightly different from DB, used for structure
      updatedAt: now,

      // UserRegistration fields
      id: Math.floor(Math.random() * 10000) + 1, // Registration ID
      editionId: 1, // Default or specify via overrides
      church: "Speranta, Oradea",
      churchOther: "",
      churchContact: "",
      payTaxTo: "Denisa Șandor",
      transport: "personal",
      preferences: "Test registration preferences",
      startDate: startDate,
      endDate: endDate,
      isConfirmed: false,
      amountPaid: 0,
      withFamilyMember: false,
      isAdmin: false,
    };

    return {...defaults, ...overrides};
}

// Please note that the ids will change. Please use the returned object to get the right ids!
export async function createUserWithRegistration(activeEditionId: number, profileOverrides: Partial<RegistrationWithProfile> = {}, formDataOverrides: Partial<FormData> = {}): Promise<RegistrationWithProfile> {
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
        phone: testFormData.authData.phone,
        phone_confirm: true,
        user_metadata: metadata, // Pass the specific metadata part
        app_metadata: {provider: 'email', providers: ['email']}, // Mimic app metadata
        id: testRegData.userId, // Assign the specific UUID from registration data
    });

    expect(authError).toBeNull();
    expect(authUser).toBeDefined();
    expect(authUser.user?.id).toBe(testRegData.userId);

    const createdUser = await getUserRegistrationByEditionId(activeEditionId, {userId: testRegData.userId});

    expect(createdUser).not.toBeNull();

    return createdUser!;
}