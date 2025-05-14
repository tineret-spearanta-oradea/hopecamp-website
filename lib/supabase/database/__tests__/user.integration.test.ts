import { supabaseAdmin } from '@/lib/supabase/server';
import { getUserProfile } from '../user';
import { createTestEdition, createTestEditionObject, deleteAllEditions } from './helpers/edition';
import { deleteAllAuthUsers } from './helpers/user'; // Still needed
import { Edition } from '@/types/edition';
import { createUserWithRegistration } from "@/lib/supabase/database/__tests__/helpers/registration";

jest.mock('@/lib/supabase/client', () => {
    return {
        supabaseBrowserClient: supabaseAdmin
    };
});

describe('User Database Integration Tests', () => {
    let activeEdition: Edition;

    beforeAll(async () => {
        // Clean up all existing users first to handle leftovers from previous runs
        await deleteAllAuthUsers();
        // Ensure clean slate for editions
        await deleteAllEditions();
        // Create an active edition required for registration trigger
        activeEdition = await createTestEdition(createTestEditionObject());
        expect(activeEdition).toBeDefined();
        expect(activeEdition.is_open).toBe(true);
    });

    afterEach(async () => {
        // Clean up all existing users first to handle leftovers from previous runs
        await deleteAllAuthUsers();
    });

    afterAll(async () => {
        // Clean up the edition
        await deleteAllEditions();
    });

    describe('handle_new_user trigger', () => {
        it('should create a user_profile when a user is inserted into auth.users with valid metadata', async () => {
            // Arrange
            const testRegData = await createUserWithRegistration(activeEdition.id, {});

            // Assert: Fetch the profile created by the trigger
            // Need a short delay for the trigger to potentially complete
            await new Promise(resolve => setTimeout(resolve, 100)); // Adjust delay if needed

            const userProfile = await getUserProfile(testRegData.userId);

            // Verify the profile exists and matches the input data
            expect(userProfile).not.toBeNull();
            expect(userProfile?.userId).toBe(testRegData.userId);
            expect(userProfile?.name).toBe(testRegData.name); // Compare against Registration data
            expect(userProfile?.age).toBe(testRegData.age); // Compare against Registration data (number)
            expect(userProfile?.imageUrl).toBe(testRegData.imageUrl || ''); // Check default/provided value
            expect(userProfile?.isSuperAdmin).toBe(false); // Default value from registration helper
        });
    });
});
