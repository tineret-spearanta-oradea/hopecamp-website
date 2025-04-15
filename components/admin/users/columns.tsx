import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Copy,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserData } from "@/types/userData";
import { sortingFns } from "@tanstack/react-table";
import { sumToPay } from "@/lib/constants";

interface ColumnProps {
  onEdit?: (user: UserData) => void;
  onDelete?: (user: UserData) => void;
  onViewDetails?: (user: UserData) => void;
  isSuperAdmin?: boolean;
}

const SortButton = ({
  column,
  children,
}: {
  column: any;
  children: React.ReactNode;
}) => {
  const sorted = column.getIsSorted();
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(sorted === "asc")}
      className="-ml-4"
    >
      {children}
      {sorted ? (
        sorted === "asc" ? (
          <ArrowUp className="ml-2 h-4 w-4 text-primary" />
        ) : (
          <ArrowDown className="ml-2 h-4 w-4 text-primary" />
        )
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
      )}
    </Button>
  );
};

export const columns = ({
  onEdit,
  onDelete,
  onViewDetails,
  isSuperAdmin,
}: ColumnProps): ColumnDef<UserData>[] => [
  {
    accessorKey: "uid",
    header: "Id",
    cell: ({ row, table }) => {
      const totalRows = table.getCoreRowModel().rows.length;
      return totalRows - row.index;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => <SortButton column={column}>Nume</SortButton>,
  },
  {
    accessorKey: "isConfirmed",
    header: ({ column }) => <SortButton column={column}>Confirmat</SortButton>,
    cell: ({ row }) => <span>{row.getValue("isConfirmed") ? "Da" : "Nu"}</span>,
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId);
      const b = rowB.getValue(columnId);
      return a === b ? 0 : a ? -1 : 1;
    },
  },
  {
    accessorKey: "age",
    header: ({ column }) => <SortButton column={column}>Ani</SortButton>,
    cell: ({ row }) => {
      const age = row.getValue("age") as number | undefined;
      if (!age) return "-";
      return <span className={age < 18 ? "text-purple-700" : ""}>{age}</span>;
    },
    sortingFn: sortingFns.alphanumeric,
  },
  {
    accessorKey: "phone",
    header: "Telefon",
  },
  {
    accessorKey: "church",
    header: ({ column }) => <SortButton column={column}>Biserică</SortButton>,
  },
  {
    accessorKey: "payTaxTo",
    header: "Casier",
  },
  {
    accessorKey: "amountPaid",
    header: ({ column }) => <SortButton column={column}>Plătit</SortButton>,
    cell: ({ row }) => {
      const amount = (row.getValue("amountPaid") as number) || 0;

      return (
        <div className="flex items-center gap-2">
          <span
            className={
              amount === 0
                ? "text-red-500"
                : amount >= sumToPay.normal
                ? "text-emerald-600"
                : amount >= sumToPay.deposit
                ? "text-yellow-500"
                : "text-red-500"
            }
          >
            {amount}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(row.original);
            }}
          >
            <Pencil className="h-3 w-3 text-muted-foreground" />
          </Button>
        </div>
      );
    },
    sortingFn: sortingFns.alphanumeric,
  },
  {
    accessorKey: "numberOfDays",
    header: "Zile",
    cell: ({ row }) => {
      const start = row.original.startDate;
      const end = row.original.endDate;

      if (
        !start ||
        !end ||
        !(start instanceof Date) ||
        !(end instanceof Date)
      ) {
        return "-";
      }

      try {
        const days =
          Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) +
          1;
        return days;
      } catch (error) {
        console.error("Error calculating days:", error);
        return "-";
      }
    },
  },
  {
    accessorKey: "transport",
    header: "Transport",
  },
  {
    accessorKey: "slopeActivity",
    header: ({ column }) => <SortButton column={column}>Pârtie</SortButton>,
    cell: ({ row }) => {
      const activity = row.getValue("slopeActivity") as string;
      return <span>{activity}</span>;
    },
    filterFn: (row, id, value) => {
      return value.length === 0 || value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-background">
          <DropdownMenuLabel>Acțiuni</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(row.original.email);
            }}
            className="cursor-pointer"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copiază email
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onViewDetails?.(row.original)}
            className="cursor-pointer"
          >
            <Eye className="mr-2 h-4 w-4" />
            Vezi detalii
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onEdit?.(row.original)}
            className="cursor-pointer"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Editează
          </DropdownMenuItem>
          {isSuperAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete?.(row.original)}
                className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-100"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Șterge
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
