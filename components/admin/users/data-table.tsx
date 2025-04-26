"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
  sortingFns,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const FILTERABLE_COLUMNS = [
  { value: "name", label: "Nume" },
  { value: "userId", label: "UID" },
  { value: "isConfirmed", label: "Confirmat" },
  { value: "age", label: "Ani" },
  { value: "phone", label: "Telefon" },
  { value: "church", label: "Biserică" },
  { value: "payTaxTo", label: "Casier" },
  { value: "transport", label: "Transport" },
  { value: "amountPaid", label: "Plătit" },
  { value: "slopeActivity", label: "Pârtie" },
];

const slopeActivityOptions = [
  { value: "nu", label: "Nu merge" },
  { value: "vizita", label: "Doar vizită" },
  { value: "schi", label: "Ski/Snowboard" },
  { value: "sanie", label: "Sanie" },
];

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedColumn, setSelectedColumn] = useState<string>("name");

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
    sortingFns: {
      numeric: (rowA, rowB, columnId) => {
        const a = rowA.getValue(columnId) as number;
        const b = rowB.getValue(columnId) as number;
        if (!a && !b) return 0;
        if (!a) return -1;
        if (!b) return 1;
        return a < b ? -1 : a > b ? 1 : 0;
      },
      boolean: (rowA, rowB, columnId) => {
        const a = rowA.getValue(columnId) as boolean;
        const b = rowB.getValue(columnId) as boolean;
        if (a === b) return 0;
        return a ? 1 : -1;
      },
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

  const renderFilterInput = () => {
    if (!selectedColumn) return null;

    if (selectedColumn === "slopeActivity") {
      return (
        <Select
          value={
            (table.getColumn(selectedColumn)?.getFilterValue() as string) ?? ""
          }
          onValueChange={(value) => handleFilterChange(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Alege activitatea..." />
          </SelectTrigger>
          <SelectContent>
            {slopeActivityOptions.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <Input
        placeholder={`Filtrează după ${
          FILTERABLE_COLUMNS.find((col) => col.value === selectedColumn)?.label
        }... (poți selecta altă coloană)`}
        value={
          (table.getColumn(selectedColumn)?.getFilterValue() as string) ?? ""
        }
        onChange={(event) => handleFilterChange(event.target.value)}
        className="max-w-sm"
      />
    );
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

          {selectedColumn && renderFilterInput()}
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
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
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
              ))
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
    </div>
  );
}
