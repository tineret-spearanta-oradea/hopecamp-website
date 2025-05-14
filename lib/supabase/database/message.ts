import { supabaseBrowserClient } from "@/lib/supabase/client";
import { UserMessage, AdminMessage } from "@/types/message"; // Import both types
import { PostgrestError } from "@supabase/supabase-js";

// Helper function to map database row to UserMessage type
function mapUserMessageDbRow(data: any): UserMessage {
  return {
    id: data.id,
    registrationId: data.registration_id,
    text: data.text,
    sentDate: new Date(data.sent_date),
    isRead: data.is_read,
    readAt: data.read_at ? new Date(data.read_at) : undefined,
  };
}

// Helper function to map database row to AdminMessage type
function mapAdminMessageDbRow(data: any): AdminMessage {
  // Access nested data based on the aliases used in the select statements
  const senderProfile = data.sender_registration?.user_profiles;
  const readerProfile = data.reader_profile;

  return {
    // UserMessage fields
    id: data.id,
    registrationId: data.registration_id,
    text: data.text,
    sentDate: new Date(data.sent_date),
    isRead: data.is_read,
    readAt: data.read_at ? new Date(data.read_at) : undefined,
    // AdminMessage specific fields
    userId: data.sender_registration?.user_id ?? 'Unknown User ID', // Sender's user_id
    userName: senderProfile?.name ?? 'Unknown Sender', // Sender's name
    phone: senderProfile?.phone ?? 'N/A', // Sender's phone
    readByUserId: data.read_by_user_id, // Reader's user ID (might be null)
    readByUserName: readerProfile?.name, // Reader's name (might be null if not read)
  };
}


// Function to get the last message for a specific registration (user-facing)
export async function getLastUserMessage(registrationId: number): Promise<UserMessage | null> {
  const { data, error } = await supabaseBrowserClient
      .from("messages")
      // Select only fields needed for UserMessage
      .select(`id, registration_id, text, sent_date, is_read, read_at`)
      .eq("registration_id", registrationId)
      .order("sent_date", { ascending: false })
      .limit(1)
      .maybeSingle(); // Use maybeSingle to return one row or null

  if (error) {
    console.error(`Error fetching last message for registration ${registrationId}:`, error);
    return null; // Return null on error
  }

  if (!data) {
    return null; // Return null if no message found
  }

  // Use the UserMessage mapper
  return mapUserMessageDbRow(data);
}

// Function to insert a new message (user-facing)
// Throws an error if insertion fails
export async function insertMessage(messageData: { registrationId: number; text: string }): Promise<UserMessage> {
  const { data, error } = await supabaseBrowserClient
      .from("messages")
      .insert({
        registration_id: messageData.registrationId,
        text: messageData.text,
      })
      // Select only fields needed for UserMessage after insert
      .select(`id, registration_id, text, sent_date, is_read, read_at`)
      .single();

  if (error || !data) {
    console.error("Error inserting message:", error);
    // Throw the error to be caught by the calling function
    throw error || new Error("Failed to insert message and received no data.");
  }

  // Use the UserMessage mapper
  return mapUserMessageDbRow(data);
}


// --- Admin Functionality ---

// Function to get all messages for a specific user (admin-facing)
// Throws an error if fetching fails
export async function getUserMessages(userId: string): Promise<AdminMessage[]> {
  const { data, error } = await supabaseBrowserClient
      .from("messages")
      // Keep the detailed select for AdminMessage
      .select(`
        *,
        sender_registration:registrations!inner ( user_id, user_profiles!inner(name, ...auth_users_view!inner ( email, phone )) ),
        reader_profile:user_profiles!fk_messages_read_by_user_id ( name )
      `)
      // Filter by the user_id within the nested sender_registration -> user_profiles structure
      .eq("sender_registration.user_id", userId)
      .order("sent_date", { ascending: true }); // Order by oldest first for conversation flow

  if (error) {
    console.error(`Error fetching messages for user ${userId}:`, error);
    throw error; // Throw the error to be caught by the calling function
  }

  // Use the AdminMessage mapper
  return data?.map(mapAdminMessageDbRow) || [];
}

// Function to get all messages for an edition (admin-facing)
// Throws an error if fetching fails
export async function getAllMessages(editionId:number): Promise<AdminMessage[]> {
  const { data, error } = await supabaseBrowserClient
    .from("messages")
    // Keep the detailed select for AdminMessage
    .select(`
      *,
      sender_registration:registrations!inner ( edition_id, user_id, user_profiles!inner(name, ...auth_users_view!inner ( email, phone )) ),
      reader_profile:user_profiles!fk_messages_read_by_user_id ( name )
    `)
    // Filter by edition_id within the nested sender_registration structure
    .eq('sender_registration.edition_id', editionId)
    .order("sent_date", { ascending: false }); // Order by most recent

  if (error) {
    console.error("Error fetching all messages:", error);
    throw error; // Throw the error to be caught by the calling function
  }

  // Use the AdminMessage mapper
  return data?.map(mapAdminMessageDbRow) || [];
}

// Function to mark a message as read (admin-facing)
export async function setMessageRead(messageId: number, readByUserId: string): Promise<{ data: AdminMessage | null; error: PostgrestError | null }> {
  const { data, error } = await supabaseBrowserClient
    .from("messages")
    .update({
      is_read: true,
      read_by_user_id: readByUserId,
      read_at: new Date(),
    })
    .eq("id", messageId)
    // Keep the detailed select for AdminMessage
    .select(`
      *,
      sender_registration:registrations!inner ( user_id, user_profiles!inner(name, ...auth_users_view!inner ( email, phone )) ),
      reader_profile:user_profiles!fk_messages_read_by_user_id ( name )
    `)
    .single();

  if (error) {
    console.error(`Error marking message ${messageId} as read:`, error);
    return { data: null, error };
  }

  // Use the AdminMessage mapper
  return { data: data ? mapAdminMessageDbRow(data) : null, error: null };
}
