import { supabaseAdmin } from '@/lib/supabase/server';
import {
    insertMessage,
    getLastUserMessage,
    getUserMessages,
    getAllMessages,
    setMessageRead
} from '../message';
import { createTestEdition, createTestEditionObject, deleteAllEditions } from './helpers/edition';
import { deleteAllAuthUsers } from './helpers/user';
import { deleteAllMessages } from './helpers/message'; // Import the helper
import { Edition } from '@/types/edition';
import { RegistrationWithProfile } from '@/types/registrationWithProfile';
import {createUserWithRegistration} from "@/lib/supabase/database/__tests__/helpers/registration";


describe('Message Database Integration Tests', () => {
    let activeEdition: Edition;
    let senderUserReg: RegistrationWithProfile;
    let readerUserReg: RegistrationWithProfile; // User who will mark messages as read

    beforeAll(async () => {
        // Clean up potential leftovers
        await deleteAllMessages();
        await deleteAllAuthUsers();
        await deleteAllEditions();

        // Create common resources
        activeEdition = await createTestEdition(createTestEditionObject());
        senderUserReg = await createUserWithRegistration(activeEdition.id, { name: "Sender User" });
        readerUserReg = await createUserWithRegistration(activeEdition.id, { name: "Reader User" }); // Assume reader is also registered

        // Wait briefly for triggers if necessary
        await new Promise(resolve => setTimeout(resolve, 100));
    });

    afterEach(async () => {
        // Clean up messages after each test
        await deleteAllMessages();
    });

    afterAll(async () => {
        // Clean up users and edition
        await deleteAllAuthUsers();
        await deleteAllEditions();
    });

    describe('insertMessage', () => {
        it('should insert a message and return the created message object', async () => {
            // Arrange
            const messageText = "Hello from insert test!";
            // Note: insertMessage expects registrationId, not userId
            const messageData = { registrationId: senderUserReg.id, text: messageText };

            // Act
            const insertedMessage = await insertMessage(messageData);

            // Assert
            expect(insertedMessage).toBeDefined();
            expect(insertedMessage.id).toBeGreaterThan(0);
            expect(insertedMessage.text).toBe(messageText);
            // mapMessageDbRow joins registrations -> user_profiles to get name/phone
            expect(insertedMessage.userName).toBe(senderUserReg.name);
            expect(insertedMessage.phone).toBe(senderUserReg.phone);
            expect(insertedMessage.isRead).toBe(false);
            expect(insertedMessage.sentDate).toBeInstanceOf(Date);
            // userId is not directly populated by mapMessageDbRow in its current form
            // expect(insertedMessage.userId).toBe(senderUserReg.userId);
        });
    });

    describe('getLastUserMessage', () => {
        it('should return the most recent message for a given registration', async () => {
            // Arrange
            await insertMessage({ registrationId: senderUserReg.id, text: "Message 1" });
            await new Promise(resolve => setTimeout(resolve, 50)); // Ensure different timestamps
            const message2 = await insertMessage({ registrationId: senderUserReg.id, text: "Message 2 (Last)" });

            // Act
            const lastMessage = await getLastUserMessage(senderUserReg.id);

            // Assert
            expect(lastMessage).not.toBeNull();
            expect(lastMessage!.id).toBe(message2.id);
            expect(lastMessage!.text).toBe("Message 2 (Last)");
            expect(lastMessage!.userName).toBe(senderUserReg.name);
        });

        it('should return null if no messages exist for the registration', async () => {
            // Arrange: No messages inserted for senderUserReg in this test scope (afterEach cleans up)

            // Act
            const lastMessage = await getLastUserMessage(senderUserReg.id);

            // Assert
            expect(lastMessage).toBeNull();
        });
    });

    describe('getUserMessages (Admin)', () => {
        it('should return all messages for a specific user, ordered by sent date ascending', async () => {
            // Arrange
            const message1 = await insertMessage({ registrationId: senderUserReg.id, text: "User Message 1" });
            await new Promise(resolve => setTimeout(resolve, 50));
            const message2 = await insertMessage({ registrationId: senderUserReg.id, text: "User Message 2" });
            // Insert message for another user to ensure filtering works
            await insertMessage({ registrationId: readerUserReg.id, text: "Reader Message" });


            // Act: Note getUserMessages uses userId, not registrationId
            const userMessages = await getUserMessages(senderUserReg.userId);

            // Assert
            expect(userMessages).toHaveLength(2);
            expect(userMessages[0].id).toBe(message1.id);
            expect(userMessages[0].text).toBe("User Message 1");
            expect(userMessages[1].id).toBe(message2.id);
            expect(userMessages[1].text).toBe("User Message 2");
            // Check sender details on one message
            expect(userMessages[0].userName).toBe(senderUserReg.name);
            // userId is not directly populated by mapMessageDbRow
            // expect(userMessages[0].userId).toBe(senderUserReg.userId);
        });

        it('should return an empty array if the user has no messages', async () => {
             // Arrange: Create a user but don't send messages
             const noMessageUser = await createUserWithRegistration(activeEdition.id, { name: "No Message User" });

            // Act
            const userMessages = await getUserMessages(noMessageUser.userId);

            // Assert
            expect(userMessages).toHaveLength(0);
        });
    });

    describe('getAllMessages (Admin)', () => {
        it('should return all messages for a specific edition, ordered by sent date descending', async () => {
            // Arrange
            const message1 = await insertMessage({ registrationId: senderUserReg.id, text: "Sender All Message 1" });
            await new Promise(resolve => setTimeout(resolve, 50));
            const message2 = await insertMessage({ registrationId: readerUserReg.id, text: "Reader All Message 1" });
            await new Promise(resolve => setTimeout(resolve, 50));
            const message3 = await insertMessage({ registrationId: senderUserReg.id, text: "Sender All Message 2" });

            // Act
            const allMessages = await getAllMessages(activeEdition.id);

            // Assert
            expect(allMessages).toHaveLength(3);
            // Check order (most recent first)
            expect(allMessages[0].id).toBe(message3.id);
            expect(allMessages[0].text).toBe("Sender All Message 2");
            expect(allMessages[0].userName).toBe(senderUserReg.name);

            expect(allMessages[1].id).toBe(message2.id);
            expect(allMessages[1].text).toBe("Reader All Message 1");
            expect(allMessages[1].userName).toBe(readerUserReg.name);

            expect(allMessages[2].id).toBe(message1.id);
            expect(allMessages[2].text).toBe("Sender All Message 1");
            expect(allMessages[2].userName).toBe(senderUserReg.name);
        });

         it('should return an empty array if no messages exist for the edition', async () => {
            // Arrange: No messages inserted in this scope

            // Act
            const allMessages = await getAllMessages(activeEdition.id);

            // Assert
            expect(allMessages).toHaveLength(0);
        });
    });

    describe('setMessageRead (Admin)', () => {
        it('should mark a message as read and update read fields', async () => {
            // Arrange
            const message = await insertMessage({ registrationId: senderUserReg.id, text: "Mark me as read" });
            expect(message.isRead).toBe(false); // Verify initial state

            // Act
            const { data: updatedMessageData, error } = await setMessageRead(message.id, readerUserReg.userId);

            // Assert
            expect(error).toBeNull();
            expect(updatedMessageData).not.toBeNull();
            const updatedMessage = updatedMessageData!;

            expect(updatedMessage.id).toBe(message.id);
            expect(updatedMessage.isRead).toBe(true);
            // mapMessageDbRow maps read_by_user_id to the reader's name via join
            expect(updatedMessage.readByUserName).toBe(readerUserReg.name);
            expect(updatedMessage.readAt).toBeInstanceOf(Date);
            // Check that the read time is recent (e.g., within the last few seconds)
            expect(updatedMessage.readAt!.getTime()).toBeGreaterThan(Date.now() - 5000);
        });

        it('should return an error if the message ID does not exist', async () => {
             // Arrange
             const nonExistentMessageId = 999999;

            // Act
            const { data, error } = await setMessageRead(nonExistentMessageId, readerUserReg.userId);

            // Assert
            expect(error).not.toBeNull();
            // Supabase might return a specific error code (e.g., PGRST116 for no rows found on update/select)
            // Or the error message might indicate 0 rows updated. Adjust check as needed.
            expect(error?.message).toContain('JSON object requested, multiple (or no) rows returned');
            expect(data).toBeNull();
        });
    });
});
