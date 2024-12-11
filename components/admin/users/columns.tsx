import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2, Eye, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/types/user";
import { useToast } from "@/hooks/use-toast";

interface ColumnProps {
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onViewDetails?: (user: User) => void;
  isSuperAdmin?: boolean;
}

// Separate component for the actions cell
const ActionCell = ({
  user,
  onEdit,
  onDelete,
  onViewDetails,
  isSuperAdmin,
}: {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onViewDetails?: (user: User) => void;
  isSuperAdmin?: boolean;
}) => {
  const { toast } = useToast();

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    toast({
      title: "Email copiat",
      description: "Adresa de email a fost copiată în clipboard",
    });
  };

  return (
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
          onClick={() => onViewDetails?.(user)}
          className="cursor-pointer"
        >
          <Eye className="mr-2 h-4 w-4" />
          Vezi detalii
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleCopyEmail(user.email)}
          className="cursor-pointer"
        >
          <Copy className="mr-2 h-4 w-4" />
          Copiază email
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onEdit?.(user)}
          className="cursor-pointer"
        >
          <Pencil className="mr-2 h-4 w-4" />
          Editează
        </DropdownMenuItem>
        {isSuperAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete?.(user)}
              className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-100"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Șterge
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns = ({
  onEdit,
  onDelete,
  onViewDetails,
  isSuperAdmin,
}: ColumnProps): ColumnDef<User>[] => {
  return [
    {
      accessorKey: "uid",
      header: "Id",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "name",
      header: "Nume",
    },
    {
      accessorKey: "isConfirmed",
      header: "Confirmat",
      cell: ({ row }) => (
        <span>{row.getValue("isConfirmed") ? "Da" : "Nu"}</span>
      ),
    },
    {
      accessorKey: "age",
      header: "Ani",
      cell: ({ row }) => {
        const age = row.getValue("age") as number | undefined;
        if (!age) return "-";
        return <span className={age < 18 ? "text-purple-700" : ""}>{age}</span>;
      },
    },
    {
      accessorKey: "phone",
      header: "Telefon",
    },
    {
      accessorKey: "church",
      header: "Biserică",
    },
    {
      accessorKey: "payTaxTo",
      header: "Casier",
    },
    {
      accessorKey: "amountPaid",
      header: "Plătit",
      cell: ({ row }) => {
        const amount = (row.getValue("amountPaid") as number) || 0;
        const withFamily = row.original.withFamilyMember;

        return (
          <span
            className={
              amount === 0
                ? "text-red-500"
                : amount >= (withFamily ? 1000 : 800)
                ? "text-emerald-600"
                : "text-yellow-500"
            }
          >
            {amount}
          </span>
        );
      },
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
            Math.ceil(
              (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
            ) + 1;
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
      id: "actions",
      cell: ({ row }) => (
        <ActionCell
          user={row.original}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
          isSuperAdmin={isSuperAdmin}
        />
      ),
    },
  ];
};
