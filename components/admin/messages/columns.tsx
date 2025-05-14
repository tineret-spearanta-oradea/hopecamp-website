import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { AdminMessage } from "@/types/message";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, PencilIcon } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

// Separate component for the status cell
function MessageStatusCell({
  row,
  onStatusChange,
}: {
  row: any;
  onStatusChange: (newStatus: boolean) => Promise<void>;
}) {
  const isRead = row.getValue("isRead") as boolean;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onStatusChange(!isRead)}
      className={`flex items-center gap-1 ${
        isRead ? "text-emerald-600" : "text-yellow-600"
      } group hover:bg-muted`}
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
      <PencilIcon className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-50" />
    </Button>
  );
}

// Wrap the status cell with context
function StatusCellWrapper({
  row,
  updateMessageStatus,
}: {
  row: any;
  updateMessageStatus: (
    messageId: number,
    newStatus: boolean,
    userId?: string
  ) => Promise<void>;
}) {
  const { userData:user } = useAuth();

  const handleStatusChange = async (newStatus: boolean) => {
    try {
      await updateMessageStatus(row.original.id, newStatus, user?.userId);
    } catch (error) {
      console.error("Error updating message status:", error);
    }
  };

  return <MessageStatusCell row={row} onStatusChange={handleStatusChange} />;
}

export const createColumns = (
  updateMessageStatus: (
    messageId: number,
    newStatus: boolean,
    readerUserId?: string // Renamed for clarity
  ) => Promise<void>
): ColumnDef<AdminMessage>[] => [ // Use AdminMessage
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
    cell: ({ row }) => (
      <StatusCellWrapper row={row} updateMessageStatus={updateMessageStatus} />
    ),
  },
  {
      id: "readByUserName",
      accessorKey: "readByUserName",
      header: "Citit De",
      cell: ({ row }) => {
          const readBy = row.original.readByUserName;
          const readAt = row.original.readAt;
          if (!readBy) return <span className="text-xs text-muted-foreground">-</span>;
          return (
              <div className="flex flex-col text-xs">
                  <span>{readBy}</span>
                  {readAt && <span className="text-muted-foreground">{format(readAt, "dd/MM HH:mm")}</span>}
              </div>
          );
      },
  },
];
