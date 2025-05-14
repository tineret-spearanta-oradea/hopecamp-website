import {getActiveEdition, insertEdition} from '../edition'; // Import insertEdition
import {createTestEdition, createTestEditionObject, deleteAllEditions} from './helpers/edition'; // Import the helper
import { supabaseAdmin } from '@/lib/supabase/server'; // Import supabaseAdmin

// Mock the browser client. Dynamically require the admin client *inside* the factory.
jest.mock('@/lib/supabase/client', () => {
    return {
        supabaseBrowserClient: supabaseAdmin
    };
});

describe('Edition Database Integration Tests', () => {

    // Clean up before any tests run
    beforeAll(async () => {
        await deleteAllEditions();
    });

    // Clean up after each test
    afterEach(async () => {
        await deleteAllEditions();
    });

    describe('insertEdition & getActiveEdition', () => {
        it('should return the active edition when one exists', async () => {
            // Arrange: Insert an inactive and an active edition
            const startDate = new Date(2024, 0, 1); // Jan 1, 2024
            const endDate = new Date(2024, 0, 10); // Jan 10, 2024
            const createdAt = new Date();
            // Arrange: Insert an inactive and an active edition using the helper and insert function
            const inactiveEditionData = createTestEditionObject({
                name: 'Inactive Edition',
                is_open: false,
                start_date: startDate,
                end_date: endDate,
            });
            const insertedInactive = await createTestEdition(inactiveEditionData);
            expect(insertedInactive).toBeDefined();

            const activeEditionData = createTestEditionObject({
                name: 'Active Edition',
                is_open: true,
                start_date: startDate,
                end_date: endDate,
            });
            const insertedActive = await createTestEdition(activeEditionData);
            expect(insertedActive).toBeDefined();

            // Act
            const activeEdition = await getActiveEdition();

            // Assert
            expect(activeEdition).not.toBeNull();
            // Compare against the data returned by insertEdition
            expect(activeEdition.id).toBe(insertedActive.id);
            expect(activeEdition.name).toBe(insertedActive.name);
            expect(activeEdition.is_open).toBe(true);
            // Compare dates carefully
            expect(activeEdition.start_date.toISOString()).toBe(insertedActive.start_date.toISOString());
            expect(activeEdition.end_date.toISOString()).toBe(insertedActive.end_date.toISOString());
        });
    });
});
