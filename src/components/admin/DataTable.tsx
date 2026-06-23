"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminT } from "@/lib/i18n/admin-en";
import { cn } from "@/lib/utils";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  sortable?: boolean;
  sortValue?: (row: T) => string | number;
  className?: string;
  headerClassName?: string;
};

type DataTableProps<T> = {
  data: T[];
  columns: DataTableColumn<T>[];
  onRowClick?: (row: T) => void;
  getRowKey: (row: T) => string;
  emptyMessage?: string;
};

type SortState = {
  key: string;
  direction: "asc" | "desc";
} | null;

export function DataTable<T>({
  data,
  columns,
  onRowClick,
  getRowKey,
  emptyMessage,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<SortState>(null);

  const sortedData = [...data].sort((a, b) => {
    if (!sort) return 0;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortValue) return 0;
    const aVal = col.sortValue(a);
    const bVal = col.sortValue(b);
    const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return sort.direction === "asc" ? cmp : -cmp;
  });

  const toggleSort = (key: string) => {
    setSort((prev) => {
      if (prev?.key !== key) return { key, direction: "asc" };
      if (prev.direction === "asc") return { key, direction: "desc" };
      return null;
    });
  };

  if (data.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        {emptyMessage ?? adminT("table.noData")}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-ink/10">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={cn(col.headerClassName)}
              >
                {col.sortable ? (
                  <button
                    type="button"
                    className="inline-flex min-h-11 items-center gap-1 font-medium hover:text-gold"
                    onClick={() => toggleSort(col.key)}
                  >
                    {col.header}
                    {sort?.key === col.key ? (
                      sort.direction === "asc" ? (
                        <ArrowUp className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowDown className="h-3.5 w-3.5" />
                      )
                    ) : (
                      <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
                    )}
                  </button>
                ) : (
                  col.header
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((row) => (
            <TableRow
              key={getRowKey(row)}
              className={onRowClick ? "cursor-pointer hover:bg-muted/50" : undefined}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <TableCell key={col.key} className={cn(col.className)}>
                  {col.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
