import { useCallback, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Message } from "@/types/message";

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

  return {
    messages,
    isLoading,
    error,
    fetchMessages,
    refetch: fetchMessages, // alias for clarity when manually refetching
  };
}
