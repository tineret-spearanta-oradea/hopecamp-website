"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  Row,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { AdminMessage } from "@/types/message"; // Use AdminMessage
import { MessageDetailsDialog } from "./message-details-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface DataTableProps {
  columns: ColumnDef<AdminMessage>[]; // Use AdminMessage
  data: AdminMessage[]; // Use AdminMessage
}

const FILTERABLE_COLUMNS = [
  { value: "userName", label: "Nume" },
  { value: "phone", label: "Telefon" },
  { value: "text", label: "Mesaj" },
  // isRead is handled by the status component, maybe filter by readByUserName?
  // { value: "isRead", label: "Status" },
  { value: "readByUserName", label: "Citit De" },
];

export function DataTable({ columns, data }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedColumn, setSelectedColumn] = useState<string>("userName");
  const [selectedMessage, setSelectedMessage] = useState<AdminMessage | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  const handleFilterChange = (value: string) => {
    if (selectedColumn) {
      table.getColumn(selectedColumn)?.setFilterValue(value);
    }
  };

  const clearFilter = (columnId: string) => {
    table.getColumn(columnId)?.setFilterValue("");
  };

  const activeFilters = columnFilters.filter((filter) => filter.value);

  const handleRowClick = (message: AdminMessage) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
  };

  return (
    <div className="w-full">
      <div className="space-y-4 py-4">
        <div className="flex flex-wrap gap-2">
          <Select value={selectedColumn} onValueChange={setSelectedColumn}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Alege coloana..." />
            </SelectTrigger>
            <SelectContent>
              {FILTERABLE_COLUMNS.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedColumn && (
            <Input
              placeholder={`Filtrează după ${
                FILTERABLE_COLUMNS.find((col) => col.value === selectedColumn)
                  ?.label
              }...`}
              value={
                (table.getColumn(selectedColumn)?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) => handleFilterChange(event.target.value)}
              className="max-w-sm"
            />
          )}
        </div>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <Badge
                key={filter.id}
                variant="secondary"
                className="flex items-center gap-2"
              >
                {
                  FILTERABLE_COLUMNS.find((col) => col.value === filter.id)
                    ?.label
                }
                : {filter.value as string}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => clearFilter(filter.id)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-md border w-full overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(
                (
                  row: Row<AdminMessage> // Use AdminMessage
                ) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`cursor-pointer transition-colors hover:bg-muted/70 ${
                      !row.original.isRead ? "bg-muted/50" : ""
                    }`}
                    onClick={() => handleRowClick(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              )
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <MessageDetailsDialog
        message={selectedMessage}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
