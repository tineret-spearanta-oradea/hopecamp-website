import {RegistrationWithProfile} from '@/types/registrationWithProfile';
import {v4 as uuidv4} from 'uuid'; // Ensure uuid is installed


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
        name: 'Test Reg User',
        email: `reg-test-${userId}@example.com`,
        phone: '0711223344',
        age: 28,
        imageUrl: '',
        isSuperAdmin: false,
        createdAt: now, // Will be slightly different from DB, used for structure
        updatedAt: now,

        // UserRegistration fields
        id: Math.floor(Math.random() * 10000) + 1, // Registration ID
        editionId: 1, // Default or specify via overrides
        church: 'Speranta, Oradea',
        churchOther: '',
        churchContact: '',
        payTaxTo: 'Denisa Șandor',
        transport: 'personal',
        preferences: 'Test registration preferences',
        slopeActivity: 'nu',
        startDate: startDate,
        endDate: endDate,
        isConfirmed: false,
        amountPaid: 0,
        withFamilyMember: false,
        isAdmin: false,
    };

    return {...defaults, ...overrides};
}
