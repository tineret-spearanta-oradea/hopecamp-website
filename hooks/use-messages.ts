import { useCallback, useState } from "react";
import { Message } from "@/types/message";
import { toast } from "sonner";
import {getAllMessages, setMessageRead} from "@/lib/supabase/database/message";
import {getActiveEdition} from "@/lib/supabase/database/edition";

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
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
    async (messageId: number, newStatus: boolean, userId?: string) => {
      try {
          await setMessageRead(messageId,userId || "Unknown");
        // Update local state
        setMessages((prevMessages) =>
          prevMessages.map((message) =>
            message.id === messageId
              ? {
                  ...message,
                  isRead: newStatus,
                  readBy: newStatus
                    ? {
                        userId: userId || "Unknown",
                        readAt: new Date(),
                      }
                    : undefined,
                }
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
