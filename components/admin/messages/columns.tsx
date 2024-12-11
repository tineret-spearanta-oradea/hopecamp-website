import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Message } from "@/types/message";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle } from "lucide-react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

// Separate component for the status cell
function MessageStatusCell({
  row,
  onStatusChange,
}: {
  row: any;
  onStatusChange: (newStatus: boolean) => Promise<void>;
}) {
  const isRead = row.getValue("isRead") as boolean;
  const readByInfo = row.original.readBy ? (
    <span className="text-xs text-muted-foreground block mt-1">
      Citit de {row.original.readBy.userId} la{" "}
      {format(row.original.readBy.readAt, "dd MMM HH:mm")}
    </span>
  ) : null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onStatusChange(!isRead)}
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
      {readByInfo}
    </Button>
  );
}

// Wrap the status cell with context
function StatusCellWrapper({ row }: { row: any }) {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: boolean) => {
    try {
      const messageRef = doc(db, "messages", row.original.id);
      await updateDoc(messageRef, {
        isRead: newStatus,
        readBy: newStatus
          ? {
              userId: user?.name || "Unknown",
              readAt: serverTimestamp(),
            }
          : null,
      });
      toast({
        title: newStatus ? "Mesaj marcat ca citit" : "Mesaj marcat ca necitit",
      });
    } catch (error) {
      console.error("Error updating message status:", error);
      toast({
        title: "Eroare",
        description: "Nu am putut actualiza statusul mesajului",
        variant: "destructive",
      });
    }
  };

  return <MessageStatusCell row={row} onStatusChange={handleStatusChange} />;
}

export const columns: ColumnDef<Message>[] = [
  {
    id: "userName",
    accessorKey: "userName",
    header: "Nume",
  },
  {
    id: "phone",
    accessorKey: "phone",
    header: "Telefon",
  },
  {
    id: "text",
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
    id: "sentDate",
    accessorKey: "sentDate",
    header: "Data Trimiterii",
    cell: ({ row }) => {
      const date = row.getValue("sentDate") as Date;
      return date ? format(date, "dd/MM/yyyy HH:mm") : "-";
    },
  },
  {
    id: "isRead",
    accessorKey: "isRead",
    header: "Status",
    cell: ({ row }) => <StatusCellWrapper row={row} />,
  },
];
