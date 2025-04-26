import {supabaseBrowserClient} from "@/lib/supabase/client";
import {Message} from "@/types/message";
import {PostgrestError} from "@supabase/supabase-js";

// Function to get the last message sent by a specific user
export async function getLastUserMessage(registrationId: number): Promise<Message | null> {
  const { data, error } = await supabaseBrowserClient
      .from("messages")
      .select(`
        *,
        sender_registration:registrations!inner ( user_id, user_profiles!inner(name, phone) ),
        reader_profile:user_profiles!fk_messages_read_by_user_id ( name )
      `)
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

  return mapMessageDbRow(data);
}

// Function to insert a new message
// Throws an error if insertion fails
export async function insertMessage(messageData: { registrationId: number; text: string }): Promise<Message> {
  const { data, error } = await supabaseBrowserClient
      .from("messages")
      .insert({
        registration_id: messageData.registrationId,
        text: messageData.text,
      })
      .select(`
        *,
        sender_registration:registrations!inner ( user_id, user_profiles!inner(name, phone) ),
        reader_profile:user_profiles!fk_messages_read_by_user_id ( name )
      `) // Select the newly inserted row with sender and reader info
      .single();

  if (error || !data) {
    console.error("Error inserting message:", error);
    // Throw the error to be caught by the calling function
    throw error || new Error("Failed to insert message and received no data.");
  }

  // Return only the mapped message data on success
  return mapMessageDbRow(data);
}

// Helper function to map database row to Message type
function mapMessageDbRow(data: any): Message {
  // Access nested data based on the aliases used in the select statements
  const senderProfile = data.sender_registration?.user_profiles;
  const readerProfile = data.reader_profile;

  return {
    id: data.id,
    // userId is the sender's user_id from the registration join
    userId: data.sender_registration?.user_id,
    userName: senderProfile?.name ?? 'Unknown Sender', // Sender's name
    phone: senderProfile?.phone ?? 'N/A', // Sender's phone
    text: data.text,
    sentDate: new Date(data.sent_date),
    isRead: data.is_read,
    readByUserName: readerProfile?.name, // Reader's name (might be null if not read)
    readAt: data.read_at ? new Date(data.read_at) : undefined,
  };
}

// admin functionality

// Function to get all messages for a specific user
// Throws an error if fetching fails
export async function getUserMessages(userId: string): Promise<Message[]> {
  const { data, error } = await supabaseBrowserClient
      .from("messages")
      .select(`
        *,
        sender_registration:registrations!inner ( user_id, user_profiles!inner(name, phone) ),
        reader_profile:user_profiles!fk_messages_read_by_user_id ( name )
      `)
      // Filter by the user_id within the nested sender_registration -> user_profiles structure
      .eq("sender_registration.user_id", userId)
      .order("sent_date", { ascending: true }); // Order by oldest first for conversation flow

  if (error) {
    console.error(`Error fetching messages for user ${userId}:`, error);
    throw error; // Throw the error to be caught by the calling function
  }

  return data?.map(mapMessageDbRow) || []; // Return the array of messages
}

// Function to get all messages with user names
// Throws an error if fetching fails
export async function getAllMessages(editionId:number): Promise<Message[]> {
  const { data, error } = await supabaseBrowserClient
    .from("messages")
    .select(`
      *,
      sender_registration:registrations!inner ( edition_id, user_id, user_profiles!inner(name, phone) ),
      reader_profile:user_profiles!fk_messages_read_by_user_id ( name )
    `)
    // Filter by edition_id within the nested sender_registration structure
    .eq('sender_registration.edition_id', editionId)
    .order("sent_date", { ascending: false }); // Order by most recent

  if (error) {
    console.error("Error fetching all messages:", error);
    throw error; // Throw the error to be caught by the calling function
  }

  return data?.map(mapMessageDbRow) || []; // Return only the array of messages
}

// Function to mark a message as read
export async function setMessageRead(messageId: number, readByUserId: string): Promise<{ data: Message | null; error: PostgrestError | null }> { // Changed messageId type to number
  const { data, error } = await supabaseBrowserClient
    .from("messages")
    .update({
      is_read: true,
      read_by_user_id: readByUserId,
      read_at: new Date(),
    })
    .eq("id", messageId)
    .select(`
      *,
      sender_registration:registrations!inner ( user_id, user_profiles!inner(name, phone) ),
      reader_profile:user_profiles!fk_messages_read_by_user_id ( name )
    `) // Select the updated row with sender and reader info
    .single();

  if (error) {
    console.error(`Error marking message ${messageId} as read:`, error);
    return { data: null, error };
  }

  return { data: data ? mapMessageDbRow(data) : null, error: null };
}
