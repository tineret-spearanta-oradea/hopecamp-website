import {supabaseBrowserClient} from "@/lib/supabase/client";
import {Message} from "@/types/message";
import {PostgrestError} from "@supabase/supabase-js";

// Helper function to map database row to Message type
function mapMessageDbRow(data: any): Message {
  // When specifying the FK relationship, the joined data is nested under the table name by default.
  const senderData = data.registrations;
  return {
    id: data.id,
    userId: data.user_id,
    userName: senderData?.name || "Utilizator Necunoscut",
    phone: senderData?.phone || "Telefon indisponibil",
    text: data.text,
    sentDate: new Date(data.sent_date),
    isRead: data.is_read,
    readByUserId: data.user_profiles?.name,
    readAt: data.read_at ? new Date(data.read_at) : undefined,
  };
}

// Function to get all messages with user names
// Throws an error if fetching fails
export async function getAllMessages(editionId:number): Promise<Message[]> {
  const { data, error } = await supabaseBrowserClient
    .from("messages")
    .select(`
      *,
      user_profiles!fk_messages_read_by_user_id ( name ),
      registrations!fk_messages_registration_id ( edition_id, ...user_profiles(name, phone) )
    `)
    .eq('registrations.edition_id', editionId)
    .order("sent_date", { ascending: false }); // Order by most recent

  if (error) {
    console.error("Error fetching all messages:", error);
    throw error; // Throw the error to be caught by the calling function
  }

  return data?.map(mapMessageDbRow) || []; // Return only the array of messages
}

// Function to get all messages for a specific user
// Throws an error if fetching fails
export async function getUserMessages(userId: string): Promise<Message[]> {
  const { data, error } = await supabaseBrowserClient
    .from("messages")
    .select(`
      *,
      user_profiles!fk_messages_read_by_user_id ( name, phone )
    `)
    .eq("user_id", userId)
    .order("sent_date", { ascending: true }); // Order by oldest first for conversation flow

  if (error) {
    console.error(`Error fetching messages for user ${userId}:`, error);
    throw error; // Throw the error to be caught by the calling function
  }

  return data?.map(mapMessageDbRow) || []; // Return the array of messages
}

// Function to get the last message sent by a specific user
export async function getLastUserMessage(registrationId: number): Promise<Message | null> {
  const { data, error } = await supabaseBrowserClient
    .from("messages")
    .select(`
      *,
      registrations!fk_messages_registration_id ( edition_id, user_id, user_profiles!inner(name, phone) )
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
      user_profiles!fk_messages_read_by_user_id ( name, phone )
    `) // Select the newly inserted row with user name and phone
    .single();

  if (error || !data) {
    console.error("Error inserting message:", error);
    // Throw the error to be caught by the calling function
    throw error || new Error("Failed to insert message and received no data.");
  }

  // Return only the mapped message data on success
  return mapMessageDbRow(data);
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
      user_profiles!fk_messages_read_by_user_id ( name, phone )
    `) // Select the updated row with user name and phone
    .single();

  if (error) {
    console.error(`Error marking message ${messageId} as read:`, error);
    return { data: null, error };
  }

  return { data: data ? mapMessageDbRow(data) : null, error: null };
}
