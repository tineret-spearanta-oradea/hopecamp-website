import { useCallback, useState } from "react";
import { AdminMessage } from "@/types/message"; // Use AdminMessage for the admin panel
import { toast } from "sonner";
import { getAllMessages, setMessageRead } from "@/lib/supabase/database/message";
import { getActiveEdition } from "@/lib/supabase/database/edition";

export function useMessages() {
  // State holds AdminMessage objects
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      const currentEdition = await getActiveEdition(); // TODO remove this after we have edition selector on the UI
      const messagesData = await getAllMessages(currentEdition.id);
      setMessages(messagesData);
      setError(null);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateMessageStatus = useCallback(
    async (messageId: number, newStatus: boolean, readerUserId?: string) => {
      if (!readerUserId) {
          console.error("Reader user ID is required to update message status.");
          toast.error("Eroare: ID utilizator lipsă pentru actualizare status.");
          return; // Prevent update if reader ID is missing
      }
      try {
        // Call API to update the status in the DB
        // setMessageRead now returns the updated AdminMessage with reader details
        const { data: updatedMessageData, error: updateError } = await setMessageRead(messageId, readerUserId);

        if (updateError || !updatedMessageData) {
            throw updateError || new Error("Failed to update message status or retrieve updated data.");
        }

        // Update local state using the data returned from the API
        setMessages((prevMessages) =>
          prevMessages.map((message) =>
            message.id === messageId
              ? updatedMessageData // Replace the old message with the updated one from DB
              : message
          )
        );

        toast.success(
          newStatus ? "Mesaj marcat ca citit" : "Mesaj marcat ca necitit"
        );
      } catch (err) {
        console.error("Error updating message status:", err);
        toast.error("Nu am putut actualiza statusul mesajului");
        throw err;
      }
    },
    []
  );

  return {
    messages,
    isLoading,
    error,
    fetchMessages,
    updateMessageStatus,
    refetch: fetchMessages,
  };
}
