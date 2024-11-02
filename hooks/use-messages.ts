import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, Timestamp } from "firebase/firestore";
import { Message } from "@/types/message";

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const messagesQuery = query(collection(db, "messages"));

    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const messagesData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            sentDate:
              data.sentDate instanceof Timestamp
                ? data.sentDate.toDate()
                : null,
            isRead: Boolean(data.isRead),
          } as Message;
        });
        setMessages(messagesData);
        setIsLoading(false);
      },
      (err) => {
        console.error("Error fetching messages:", err);
        setError(err as Error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return {
    messages,
    isLoading,
    error,
  };
}
