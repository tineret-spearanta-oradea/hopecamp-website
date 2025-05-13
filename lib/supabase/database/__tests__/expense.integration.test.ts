import { supabaseAdmin } from '@/lib/supabase/server';
import { addExpense, getAllExpenses } from '../expense';
import { createTestEdition, createTestEditionObject, deleteAllEditions } from './helpers/edition';
import { deleteAllAuthUsers } from './helpers/user';
import { deleteAllExpenses, createTestNewExpense } from './helpers/expense'; // Import expense helpers
import { Edition } from '@/types/edition';
import { RegistrationWithProfile } from '@/types/registrationWithProfile';
import { createUserWithRegistration } from "@/lib/supabase/database/__tests__/helpers/registration";

// Mock the browser client. Dynamically require the admin client *inside* the factory.
jest.mock('@/lib/supabase/client', () => {
    return {
        supabaseBrowserClient: supabaseAdmin
    };
});

describe('Expense Database Integration Tests', () => {
    let activeEdition: Edition;
    let creatorUserReg: RegistrationWithProfile; // User who creates expenses

    beforeAll(async () => {
        // Clean up potential leftovers
        await deleteAllExpenses();
        await deleteAllAuthUsers();
        await deleteAllEditions();

        // Create common resources
        activeEdition = await createTestEdition(createTestEditionObject());
        // Create a user who will be the creator of expenses
        creatorUserReg = await createUserWithRegistration(activeEdition.id, { name: "Expense Creator" });

        // Wait briefly for triggers if necessary
        await new Promise(resolve => setTimeout(resolve, 100));
    });

    afterEach(async () => {
        // Clean up expenses after each test
        await deleteAllExpenses();
    });

    afterAll(async () => {
        // Clean up users and edition
        await deleteAllAuthUsers();
        await deleteAllEditions();
    });

    describe('addExpense', () => {
        it('should add an expense and return the created expense object with creator name', async () => {
            // Arrange
            const newExpenseData = createTestNewExpense(creatorUserReg.userId, {
                title: "Test Add Expense",
                amount: 123.45,
                category: "Food",
            });

            // Act
            const addedExpense = await addExpense(newExpenseData);

            // Assert
            expect(addedExpense).toBeDefined();
            expect(addedExpense.id).toBeGreaterThan(0);
            expect(addedExpense.title).toBe("Test Add Expense");
            expect(addedExpense.amount).toBe(123.45);
            expect(addedExpense.category).toBe("Food");
            expect(addedExpense.created_by).toBe(creatorUserReg.userId);
            // Check if the creator's name was joined correctly
            expect(addedExpense.creatorName).toBe(creatorUserReg.name);
            expect(addedExpense.created_at).toBeDefined();
        });

        it('should throw an error if amount is invalid', async () => {
            // Arrange
            const invalidExpenseData = createTestNewExpense(creatorUserReg.userId, {
                amount: NaN, // Invalid amount
            });

            // Act & Assert
            await expect(addExpense(invalidExpenseData))
                .rejects
                .toThrow("Invalid amount provided. Amount must be a number.");
        });
    });

    describe('getAllExpenses', () => {
        it('should return all added expenses with creator names, ordered by creation date descending', async () => {
            // Arrange: Add multiple expenses
            const expense1Data = createTestNewExpense(creatorUserReg.userId, { title: "Expense Item 1", amount: 50 });
            const expense2Data = createTestNewExpense(creatorUserReg.userId, { title: "Expense Item 2", amount: 75 });
            const expense1 = await addExpense(expense1Data);
            await new Promise(resolve => setTimeout(resolve, 50)); // Ensure different timestamps
            const expense2 = await addExpense(expense2Data);

            // Act
            const allExpenses = await getAllExpenses();

            // Assert
            expect(allExpenses).toHaveLength(2);
            // Check order (most recent first)
            expect(allExpenses[0].id).toBe(expense2.id);
            expect(allExpenses[0].title).toBe("Expense Item 2");
            expect(allExpenses[0].amount).toBe(75);
            expect(allExpenses[0].creatorName).toBe(creatorUserReg.name);

            expect(allExpenses[1].id).toBe(expense1.id);
            expect(allExpenses[1].title).toBe("Expense Item 1");
            expect(allExpenses[1].amount).toBe(50);
            expect(allExpenses[1].creatorName).toBe(creatorUserReg.name);
        });

        it('should return an empty array if no expenses exist', async () => {
            // Arrange: No expenses added in this scope (afterEach cleans up)

            // Act
            const allExpenses = await getAllExpenses();

            // Assert
            expect(allExpenses).toHaveLength(0);
        });
    });
});
