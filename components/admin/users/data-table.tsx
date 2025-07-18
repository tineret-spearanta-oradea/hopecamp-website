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
  VisibilityState,
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
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Settings2, Eye, EyeOff, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

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
];

// Column labels for visibility toggle
const COLUMN_LABELS: Record<string, string> = {
  userId: "ID",
  name: "Nume",
  isConfirmed: "Confirmat",
  age: "Ani",
  phone: "Telefon",
  church: "Biserică",
  payTaxTo: "Casier",
  amountPaid: "Plătit",
  numberOfDays: "Zile",
  transport: "Transport",
  gender: "Gen",
  actions: "Acțiuni",
};

// Default column visibility
const DEFAULT_COLUMN_VISIBILITY: VisibilityState = {
  payTaxTo: false,
  numberOfDays: false,
};

// LocalStorage key for column visibility
const COLUMN_VISIBILITY_KEY = "admin-users-column-visibility";

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedColumn, setSelectedColumn] = useState<string>("name");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load column visibility from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(COLUMN_VISIBILITY_KEY);
      if (saved) {
        const parsedVisibility = JSON.parse(saved);
        setColumnVisibility(parsedVisibility);
      } else {
        // If no saved preferences, use defaults
        setColumnVisibility(DEFAULT_COLUMN_VISIBILITY);
      }
    } catch (error) {
      console.error(
        "Failed to load column visibility from localStorage:",
        error
      );
      setColumnVisibility(DEFAULT_COLUMN_VISIBILITY);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save column visibility to localStorage whenever it changes (but only after initial load)
  useEffect(() => {
    if (!isLoaded) return; // Don't save during initial load

    try {
      localStorage.setItem(
        COLUMN_VISIBILITY_KEY,
        JSON.stringify(columnVisibility)
      );
    } catch (error) {
      console.error("Failed to save column visibility to localStorage:", error);
    }
  }, [columnVisibility, isLoaded]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
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

  const resetColumnVisibility = () => {
    setColumnVisibility(DEFAULT_COLUMN_VISIBILITY);
  };

  const showAllColumns = () => {
    const allVisible: VisibilityState = {};
    table.getAllColumns().forEach((column) => {
      if (column.getCanHide()) {
        allVisible[column.id] = true;
      }
    });
    setColumnVisibility(allVisible);
  };

  const activeFilters = columnFilters.filter((filter) => filter.value);

  const selectedColumnLabel = FILTERABLE_COLUMNS.find(
    (col) => col.value === selectedColumn
  )?.label;

  const renderFilterInput = () => {
    if (!selectedColumn) return null;

    return (
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={`Caută în ${selectedColumnLabel}...`}
          value={
            (table.getColumn(selectedColumn)?.getFilterValue() as string) ?? ""
          }
          onChange={(event) => handleFilterChange(event.target.value)}
          className="pl-10 min-w-[200px]"
        />
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="space-y-4 py-4">
        {/* Mobile-first responsive layout */}
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          {/* Filtering Section with improved UI */}
          <div className="flex flex-col sm:flex-row gap-2 flex-1 max-w-2xl">
            <div className="flex flex-col sm:flex-row gap-2 flex-1 p-3 border rounded-lg bg-muted/20">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2 sm:mb-0">
                <Search className="h-4 w-4" />
                <span className="font-medium">Filtrare:</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 flex-1">
                <div className="flex flex-col sm:flex-row gap-2 flex-1">
                  <Select
                    value={selectedColumn}
                    onValueChange={setSelectedColumn}
                  >
                    <SelectTrigger className="w-full sm:w-[180px] bg-background">
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
              </div>
            </div>
          </div>

          {/* Column Visibility Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Settings2 className="mr-2 h-4 w-4" />
                <span className="sm:hidden">Vizibilitate coloane</span>
                <span className="hidden sm:inline">Coloane</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[250px] sm:w-[200px]">
              <DropdownMenuLabel>Vizibilitate coloane</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="flex gap-1 p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={showAllColumns}
                  className="h-8 text-xs flex-1"
                >
                  Arată toate
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetColumnVisibility}
                  className="h-8 text-xs flex-1"
                >
                  Reset
                </Button>
              </div>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  const isVisible = column.getIsVisible();
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={isVisible}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      <div className="flex items-center gap-2">
                        {isVisible ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                        {COLUMN_LABELS[column.id] || column.id}
                      </div>
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
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
              <TableRow key={headerGroup.id} className="bg-muted/50">
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
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    "transition-colors hover:bg-muted/50",
                    index % 2 === 1 && "bg-muted/20"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="whitespace-nowrap px-2 sm:px-4"
                    >
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
