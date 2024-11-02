"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

type ConfirmedUserProps = {
  userData: {
    name: string;
    phone: string;
    // add other fields as needed
  };
};

export default function ConfirmedUser({ userData }: ConfirmedUserProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast({
        title: "Eroare",
        description: "Mesajul nu poate fi gol",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      await addDoc(collection(db, "messages"), {
        userName: userData.name,
        phone: userData.phone,
        text: message,
        sentDate: serverTimestamp(),
        isRead: false,
      });

      toast({
        title: "Succes",
        description: "Mesajul a fost trimis cu succes",
      });
      setMessage(""); // Clear the message input
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Eroare",
        description:
          "Nu am putut trimite mesajul. Te rugăm să încerci din nou.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <p>✅ Contul tău este confirmat!</p>
        <p>
          📝 În curând vei primi mai multe informații despre tabără și următorii
          pași.
        </p>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-semibold">Ai întrebări? Trimite-ne un mesaj:</h3>
        <div className="space-y-2">
          <Textarea
            placeholder="Scrie mesajul tău aici..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isSending}
            className="w-full"
          >
            {isSending ? "Se trimite..." : "Trimite mesaj"}
          </Button>
        </div>
      </div>
    </div>
  );
}
