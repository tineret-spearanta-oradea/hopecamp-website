import {supabaseAdmin} from '@/lib/supabase/server';
import {getUserProfile} from '../user';
import {insertEdition} from '../edition';
import {
    getUserRegistrationByEditionId,
    getRegistrationsByEditionId,
    changeUserAdminStatusForRegistration,
    updateRegistrationPayment // Import the new function
} from '../registration';
import {createTestEdition, createTestEditionObject, deleteAllEditions} from './helpers/edition';
import { deleteAllAuthUsers, createTestFormData } from './helpers/user'; // Import createTestFormData
import { Edition } from '@/types/edition';
import { FormData } from "@/types/form";
import {createTestRegistrationWithProfile, createUserWithRegistration} from './helpers/registration'; // Import helper

describe('Registration Database Integration Tests', () => {
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

    describe('when creating a user with metadata', () => {
        it('handle_new_user trigger should create a user_profile and registration when a user is inserted into auth.users with valid metadata', async () => {
            // Arrange
            // 1. Define the registration data we want to create
            const registrationInput = createTestRegistrationWithProfile({
                editionId: activeEdition.id,
                name: "Full Data Test User",
                age: 30,
                phone: "0712312312",
                church: "Betel, Oradea",
                payTaxTo: "Andrei Micula",
                transport: "autocar",
                preferences: "Vegetarian meal",
                slopeActivity: "ski", // Use the key expected by the form/metadata mapping
                startDate: new Date(2025, 1, 20),
                endDate: new Date(2025, 1, 23),
                imageUrl: "http://example.com/image.jpg",
            });

            // 2. Create the corresponding FormData using the helper
            const formData: FormData = createTestFormData(registrationInput);

            // 3. Create the user using the helper, passing the specific formData
            // Note: createUserWithRegistration internally generates metadata based on formData
            const testRegData = await createUserWithRegistration(activeEdition.id, registrationInput, formData);

            // Assert: Fetch the profile created by the trigger
            // Need a short delay for the trigger to potentially complete
            await new Promise(resolve => setTimeout(resolve, 100)); // Adjust delay if needed

            // Also check if the registration was created by the trigger
            const registration = await getUserRegistrationByEditionId(activeEdition.id, {userId: testRegData.userId});
            expect(registration).not.toBeNull();
            expect(registration?.userId).toBe(testRegData.userId);
            expect(registration?.editionId).toBe(activeEdition.id);
            // Verify registration fields against the original formData.userData
            expect(registration?.name).toBe(formData.userData.name);
            expect(registration?.age).toBe(parseInt(formData.userData.age, 10));
            expect(registration?.phone).toBe(formData.userData.phone);
            expect(registration?.church).toBe(formData.userData.church);
            expect(registration?.payTaxTo).toBe(formData.userData.payTaxTo);
            expect(registration?.transport).toBe(formData.userData.transport);
            expect(registration?.preferences).toBe(formData.userData.preferences);
            // The trigger stores the mapped value ('schi'), not the key ('ski')
            expect(registration?.slopeActivity).toBe('schi');
            expect(registration?.startDate.toISOString()).toBe(formData.userData.startDate?.toISOString());
            expect(registration?.endDate.toISOString()).toBe(formData.userData.endDate?.toISOString());
            expect(registration?.imageUrl).toBe(formData.userData.imageUrl);
            // Check default values set by trigger/table
            expect(registration?.isConfirmed).toBe(false);
            expect(registration?.amountPaid).toBe(0);
            expect(registration?.withFamilyMember).toBe(false);
            expect(registration?.isAdmin).toBe(false);
        });
    });

    describe('getUserRegistrationByEditionId', () => {
        it('should return the correct registration by userId', async () => {
            // Arrange
            const testRegData = await createUserWithRegistration(activeEdition.id, {name: "Fetch Me By ID"});
            await new Promise(resolve => setTimeout(resolve, 100)); // Allow trigger to complete

            // Act
            const registration = await getUserRegistrationByEditionId(activeEdition.id, {userId: testRegData.userId});

            // Assert
            expect(registration).not.toBeNull();
            expect(registration?.userId).toBe(testRegData.userId);
            expect(registration?.editionId).toBe(activeEdition.id);
            expect(registration?.name).toBe("Fetch Me By ID");
            expect(registration?.email).toBe(testRegData.email);
            expect(registration?.isAdmin).toBe(false); // Default
            expect(registration?.isSuperAdmin).toBe(false); // Default
        });

        it('should return the correct registration by email', async () => {
            // Arrange
            const testRegData = await createUserWithRegistration(activeEdition.id, {name: "Fetch Me By Email"});
            await new Promise(resolve => setTimeout(resolve, 100)); // Allow trigger to complete

            // Act
            const registration = await getUserRegistrationByEditionId(activeEdition.id, {email: testRegData.email});

            // Assert
            expect(registration).not.toBeNull();
            expect(registration?.userId).toBe(testRegData.userId);
            expect(registration?.editionId).toBe(activeEdition.id);
            expect(registration?.name).toBe("Fetch Me By Email");
            expect(registration?.email).toBe(testRegData.email);
        });

        it('should return null if email does not exist', async () => {
            // Arrange
            const nonExistentEmail = 'nonexistent@example.com';

            await createUserWithRegistration(activeEdition.id);
            await new Promise(resolve => setTimeout(resolve, 100));

            // Act
            const registration = await getUserRegistrationByEditionId(activeEdition.id, {email: nonExistentEmail});

            // Assert
            expect(registration).toBeNull();
        });
    });

    describe('getRegistrationsByEditionId', () => {
        it('should return all registrations for the active edition', async () => {
            // Arrange: Create multiple users for the active edition
            const user1Data = await createUserWithRegistration(activeEdition.id, {name: "Reg List User 1"});
            const user2Data = await createUserWithRegistration(activeEdition.id, {name: "Reg List User 2"});
            const user3Data = await createUserWithRegistration(activeEdition.id, {name: "Reg List User 3"});
            await new Promise(resolve => setTimeout(resolve, 200)); // Allow triggers to complete

            // Act
            const registrations = await getRegistrationsByEditionId(activeEdition.id);

            // Assert
            expect(registrations).toHaveLength(3);
            // Check if all created users are in the list (order might vary)
            expect(registrations.some(r => r.userId === user1Data.userId && r.name === "Reg List User 1")).toBe(true);
            expect(registrations.some(r => r.userId === user2Data.userId && r.name === "Reg List User 2")).toBe(true);
            expect(registrations.some(r => r.userId === user3Data.userId && r.name === "Reg List User 3")).toBe(true);
        });
    });

    describe('changeUserAdminStatusForRegistration', () => {
        it('should correctly set and unset the isAdmin flag for a registration', async () => {
            // Arrange
            const testRegData = await createUserWithRegistration(activeEdition.id, {name: "Admin Status Test"});
            await new Promise(resolve => setTimeout(resolve, 100)); // Allow trigger to complete

            // Fetch the initial registration to get its ID
            const initialRegistration = await getUserRegistrationByEditionId(activeEdition.id, {userId: testRegData.userId});
            expect(initialRegistration).not.toBeNull();
            expect(initialRegistration?.isAdmin).toBe(false); // Verify initial state
            const registrationId = initialRegistration!.id;

            // Act 1: Set isAdmin to true
            await changeUserAdminStatusForRegistration(registrationId, true);

            // Assert 1: Fetch again and check if isAdmin is true
            const adminRegistration = await getUserRegistrationByEditionId(activeEdition.id, {userId: testRegData.userId});
            expect(adminRegistration).not.toBeNull();
            expect(adminRegistration?.isAdmin).toBe(true);

            // Act 2: Set isAdmin back to false
            await changeUserAdminStatusForRegistration(registrationId, false);

            // Assert 2: Fetch again and check if isAdmin is false
            const nonAdminRegistration = await getUserRegistrationByEditionId(activeEdition.id, {userId: testRegData.userId});
            expect(nonAdminRegistration).not.toBeNull();
            expect(nonAdminRegistration?.isAdmin).toBe(false);
        });
    });

    describe('updateRegistrationPayment', () => {
        it('should update amount_paid and pay_tax_to for a registration', async () => {
            // Arrange
            const testRegData = await createUserWithRegistration(activeEdition.id, { name: "Payment Update Test" });
            await new Promise(resolve => setTimeout(resolve, 100)); // Allow trigger

            // Fetch initial registration to get ID and verify initial state
            const initialReg = await getUserRegistrationByEditionId(activeEdition.id, { userId: testRegData.userId });
            expect(initialReg).not.toBeNull();
            expect(initialReg?.amountPaid).toBe(0); // Initial amount should be 0
            expect(initialReg?.payTaxTo).toBe(testRegData.payTaxTo); // Initial collector
            const registrationId = initialReg!.id;

            const newAmount = 150;
            const newCollector = "Test Collector";

            // Act: Update the payment details
            await updateRegistrationPayment(registrationId, newAmount, newCollector);

            // Assert: Fetch the registration again and verify updated fields
            const updatedReg = await getUserRegistrationByEditionId(activeEdition.id, { userId: testRegData.userId });
            expect(updatedReg).not.toBeNull();
            expect(updatedReg?.amountPaid).toBe(newAmount);
            expect(updatedReg?.payTaxTo).toBe(newCollector);
            // Check that other fields haven't changed unexpectedly
            expect(updatedReg?.name).toBe("Payment Update Test");
            expect(updatedReg?.id).toBe(registrationId);
        });

        it('should throw an error if amount is negative', async () => {
             // Arrange
            const testRegData = await createUserWithRegistration(activeEdition.id);
            await new Promise(resolve => setTimeout(resolve, 100));
            const initialReg = await getUserRegistrationByEditionId(activeEdition.id, { userId: testRegData.userId });
            const registrationId = initialReg!.id;

            // Act & Assert
            await expect(updateRegistrationPayment(registrationId, -50, "Negative Collector"))
                .rejects
                .toThrow("Amount paid cannot be negative.");
        });
    });
});
