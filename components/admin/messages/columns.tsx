import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Message } from "@/types/message";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle } from "lucide-react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";

export const columns: ColumnDef<Message>[] = [
  {
    accessorKey: "userName",
    header: "Nume",
  },
  {
    accessorKey: "phone",
    header: "Telefon",
  },
  {
    accessorKey: "text",
    header: "Mesaj",
    cell: ({ row }) => {
      const text = row.getValue("text") as string;
      return (
        <div className="max-w-[500px] truncate" title={text}>
          {text}
        </div>
      );
    },
  },
  {
    accessorKey: "sentDate",
    header: "Data Trimiterii",
    cell: ({ row }) => {
      const date = row.getValue("sentDate") as Date;
      return date ? format(date, "dd/MM/yyyy HH:mm") : "-";
    },
  },
  {
    accessorKey: "isRead",
    header: "Status",
    cell: ({ row }) => {
      const isRead = row.getValue("isRead") as boolean;
      const { toast } = useToast();
      const { user } = useAuth();
      const [isOpen, setIsOpen] = useState(false);
      const [isUpdating, setIsUpdating] = useState(false);

      const toggleStatus = async () => {
        if (!user) return;

        setIsUpdating(true);
        try {
          const messageRef = doc(db, "messages", row.original.id);
          const newIsRead = !isRead;

          await updateDoc(messageRef, {
            isRead: newIsRead,
            readBy: newIsRead
              ? {
                  userId: user.uid,
                  readAt: serverTimestamp(),
                }
              : null,
          });

          toast({
            title: "Status actualizat",
            description: `Mesajul a fost marcat ca ${
              newIsRead ? "citit" : "necitit"
            }`,
          });
        } catch (error) {
          console.error("Error updating message status:", error);
          toast({
            title: "Eroare",
            description: "Nu am putut actualiza statusul mesajului",
            variant: "destructive",
          });
        } finally {
          setIsUpdating(false);
          setIsOpen(false);
        }
      };

      const readByInfo = row.original.readBy ? (
        <span className="text-xs text-muted-foreground block mt-1">
          Citit de {row.original.readBy.userId} la{" "}
          {format(row.original.readBy.readAt, "dd MMM HH:mm")}
        </span>
      ) : null;

      return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-1 ${
                isRead ? "text-emerald-600" : "text-yellow-600"
              }`}
            >
              {isRead ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-xs">Citit</span>
                </>
              ) : (
                <>
                  <Circle className="h-4 w-4" />
                  <span className="text-xs">Necitit</span>
                </>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmare schimbare status</DialogTitle>
              <DialogDescription>
                Ești sigur că vrei să marchezi acest mesaj ca{" "}
                {isRead ? "necitit" : "citit"}?{readByInfo}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2 justify-end">
              <DialogClose asChild>
                <Button variant="outline">Anulează</Button>
              </DialogClose>
              <Button onClick={toggleStatus} disabled={isUpdating}>
                {isUpdating ? "Se actualizează..." : "Confirmă"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    },
  },
];
