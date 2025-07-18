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
  CreditCard,
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
import { sortingFns } from "@tanstack/react-table";
import { sumToPay } from "@/lib/constants";

import {RegistrationWithProfile} from "@/types/registrationWithProfile";
import { toast } from "sonner";
import { useEffect, useState } from "react";

interface ColumnProps {
  onEdit?: (user: RegistrationWithProfile) => void;
  onDelete?: (user: RegistrationWithProfile) => void;
  onViewDetails?: (user: RegistrationWithProfile) => void;
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
}: ColumnProps): ColumnDef<RegistrationWithProfile>[] => [
  {
    accessorKey: "userId",
    header: "Id",
    enableHiding: false,
    cell: ({ row, table }) => {
      const totalRows = table.getCoreRowModel().rows.length;
      return totalRows - row.index;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => <SortButton column={column}>Nume</SortButton>,
    enableHiding: false,
  },
  {
    accessorKey: "isConfirmed",
    header: ({ column }) => <SortButton column={column}>Confirmat</SortButton>,
    enableHiding: true,
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
    enableHiding: true,
    cell: ({ row }) => {
      const age = row.getValue("age") as number | undefined;
      if (!age) return "-";
      return <span className={age < 18 ? "text-purple-700" : ""}>{age}</span>;
    },
    sortingFn: sortingFns.alphanumeric,
  },
  {
    accessorKey: "gender",
    header: ({ column }) => <SortButton column={column}>Gen</SortButton>,
    enableHiding: true,
    cell: ({ row }) => {
      const gender = row.getValue("gender") as 'male' | 'female' | 'unknown';
      if (!gender || gender === 'unknown') return "-";
      return (
        <span className={gender === 'male' ? "text-blue-600" : "text-pink-600"}>
          {gender === 'male' ? 'M' : 'F'}
        </span>
      );
    },
    sortingFn: sortingFns.alphanumeric,
  },
  {
    accessorKey: "phone",
    header: "Telefon",
    enableHiding: true,
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string;
      const handleCopy = () => {
        navigator.clipboard.writeText(phone);
        toast.info("Telefonul a fost copiat în clipboard.");
      };
      return (
        <div>
          <span className="text-blue-500 cursor-pointer" onClick={handleCopy}>
            {phone}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "church",
    header: ({ column }) => <SortButton column={column}>Biserică</SortButton>,
    enableHiding: true,
  },
  {
    accessorKey: "payTaxTo",
    header: "Casier",
    enableHiding: true,
  },
  {
    accessorKey: "amountPaid",
    header: ({ column }) => <SortButton column={column}>Plătit</SortButton>,
    enableHiding: true,
    cell: ({ row }) => {
      const amount = (row.getValue("amountPaid") as number) || 0;

      return (
        <div className="flex items-center gap-2">
          <span
            className={
              amount === 0
                ? "text-red-500"
                : amount >= sumToPay.withFamilyMember
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
    enableHiding: true,
    cell: ({ row }) => {
      const start = row.original.startDate;
      const end = row.original.endDate;

      if (!start || !end) {
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
    enableHiding: true,
  },
  {
    id: "actions",
    enableHiding: false,
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
              navigator.clipboard.writeText(row.original.phone);
            }}
            className="cursor-pointer"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copiază telefon
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
