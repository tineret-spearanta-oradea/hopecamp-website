import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Message } from "@/types/message";
import { Badge } from "@/components/ui/badge";

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
      return (
        <Badge variant={isRead ? "secondary" : "destructive"}>
          {isRead ? "Citit" : "Necitit"}
        </Badge>
      );
    },
  },
];
