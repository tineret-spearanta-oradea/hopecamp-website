import { useCallback, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { Message } from "@/types/message";
import { toast } from "sonner";

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      const messagesQuery = query(
        collection(db, "messages"),
        orderBy("sentDate", "desc")
      );

      const snapshot = await getDocs(messagesQuery);
      const messagesData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId || "",
          userName: data.userName,
          phone: data.phone,
          text: data.text,
          sentDate: data.sentDate?.toDate() || new Date(),
          isRead: Boolean(data.isRead),
          readBy: data.readBy
            ? {
                userId: data.readBy.userId,
                readAt: data.readBy.readAt.toDate(),
              }
            : undefined,
        } as Message;
      });

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
    async (messageId: string, newStatus: boolean, userId?: string) => {
      try {
        const messageRef = doc(db, "messages", messageId);
        const updateData = {
          isRead: newStatus,
          readBy: newStatus
            ? {
                userId: userId || "Unknown",
                readAt: new Date(),
              }
            : null,
        };

        await updateDoc(messageRef, {
          ...updateData,
          readBy: newStatus
            ? {
                userId: userId || "Unknown",
                readAt: serverTimestamp(),
              }
            : null,
        });

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
