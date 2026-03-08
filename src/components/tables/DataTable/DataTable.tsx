"use client";

import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
    type ColumnDef,
    type SortingState,
} from "@tanstack/react-table";
import { useState, useEffect, useRef } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SkeletonTableRow, EmptyState } from "@/components/ui";
import { ExportButton } from "../ExportButton";
import { Pagination } from "../Pagination";

// TanStack Table v8 default column size — used to detect unconfigured columns
const TANSTACK_DEFAULT_COLUMN_SIZE = 150;

export interface DataTableProps<T extends object> {
    data: T[];
    columns: ColumnDef<T>[];
    total: number;
    page: number;
    limit: number;
    isLoading?: boolean;
    emptyMessage?: string;
    exportFilename?: string;
    className?: string;
}

export function DataTable<T extends object>({
    data,
    columns,
    total,
    page,
    limit,
    isLoading = false,
    emptyMessage = "No results found.",
    exportFilename,
    className,
}: DataTableProps<T>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

    const prevDataRef = useRef(data);
    useEffect(() => {
        if (prevDataRef.current !== data) {
            setRowSelection({});
            prevDataRef.current = data;
        }
    }, [data]);

    // Prepend checkbox selection column
    const selectionColumn: ColumnDef<T> = {
        id: "select",
        header: ({ table }) => (
            <input
                type="checkbox"
                checked={table.getIsAllPageRowsSelected()}
                ref={(el) => {
                    if (el) {
                        el.indeterminate = table.getIsSomePageRowsSelected();
                    }
                }}
                onChange={table.getToggleAllPageRowsSelectedHandler()}
                aria-label="Select all rows"
                className="rounded border border-(--color-border) accent-(--color-primary)"
            />
        ),
        cell: ({ row }) => (
            <input
                type="checkbox"
                checked={row.getIsSelected()}
                disabled={!row.getCanSelect()}
                onChange={row.getToggleSelectedHandler()}
                aria-label="Select row"
                className="rounded border border-(--color-border) accent-(--color-primary)"
            />
        ),
        enableSorting: false,
        enableColumnFilter: false,
        size: 40,
    };
    const allColumns = [selectionColumn, ...columns];

    const table = useReactTable({
        data,
        columns: allColumns,
        state: { sorting, rowSelection },
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        // NOTE: Column filters operate on the current page's data only (client-side).
        // For full-dataset filtering, integrate server-side via URL search params.
        getFilteredRowModel: getFilteredRowModel(),
        enableRowSelection: true,
    });

    const selectedRows = table.getSelectedRowModel().rows;
    const hasSelected = selectedRows.length > 0;
    const selectedData = selectedRows.map((row) => row.original as Record<string, unknown>);
    const visibleColumnCount = allColumns.length;

    return (
        <div className={cn("space-y-3", className)}>
            {/* Bulk action toolbar */}
            {hasSelected && (
                <div className="flex items-center justify-between rounded-(--radius-lg) border border-(--color-border) bg-(--color-muted) px-4 py-2">
                    <span className="text-sm text-(--color-foreground)">
                        {selectedRows.length} row{selectedRows.length !== 1 ? "s" : ""} selected
                    </span>
                    {exportFilename && (
                        <ExportButton
                            data={selectedData}
                            filename={exportFilename}
                            label="Export Selected"
                        />
                    )}
                </div>
            )}

            {/* Table */}
            <div className="overflow-hidden rounded-(--radius-lg) border border-(--color-border)">
                <table className="w-full text-sm">
                    <thead className="border-b border-(--color-border) bg-(--color-muted)">
                        {table.getHeaderGroups().map((hg) => (
                            <tr key={hg.id}>
                                {hg.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        style={{ width: header.getSize() !== TANSTACK_DEFAULT_COLUMN_SIZE ? header.getSize() : undefined }}
                                        className="px-4 py-3 text-left font-medium text-(--color-muted-foreground)"
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div className="space-y-1.5">
                                                {/* Sort trigger */}
                                                {header.column.getCanSort() ? (
                                                    <button
                                                        type="button"
                                                        onClick={header.column.getToggleSortingHandler()}
                                                        className="flex items-center gap-1 cursor-pointer select-none hover:text-(--color-foreground) bg-transparent border-0 p-0 w-full text-left font-medium text-(--color-muted-foreground)"
                                                    >
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext(),
                                                        )}
                                                        <span className="shrink-0">
                                                            {header.column.getIsSorted() === "asc" ? (
                                                                <ArrowUp size={12} />
                                                            ) : header.column.getIsSorted() === "desc" ? (
                                                                <ArrowDown size={12} />
                                                            ) : (
                                                                <ArrowUpDown size={12} />
                                                            )}
                                                        </span>
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center gap-1">
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext(),
                                                        )}
                                                    </div>
                                                )}
                                                {/* Column filter input */}
                                                {header.column.getCanFilter() && (
                                                    <input
                                                        value={
                                                            (header.column.getFilterValue() as string) ?? ""
                                                        }
                                                        onChange={(e) =>
                                                            header.column.setFilterValue(e.target.value)
                                                        }
                                                        placeholder="Filter…"
                                                        className="w-full rounded-(--radius) border border-(--color-border) bg-(--color-card) px-2 py-0.5 text-xs font-normal text-(--color-foreground) placeholder:text-(--color-muted-foreground) focus:outline-none focus:ring-1 focus:ring-(--color-ring)"
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody className="divide-y divide-(--color-border) bg-(--color-card)">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <SkeletonTableRow key={i} cols={visibleColumnCount} />
                            ))
                        ) : table.getRowModel().rows.length === 0 ? null : (
                            table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className={cn(
                                        "transition-colors hover:bg-(--color-muted)/50",
                                        row.getIsSelected() && "bg-(--color-primary)/5",
                                    )}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="px-4 py-3 text-(--color-foreground)"
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Empty state — rendered inside the border container */}
                {!isLoading && table.getRowModel().rows.length === 0 && (
                    <EmptyState title={emptyMessage} className="py-12" />
                )}
            </div>

            {/* Pagination */}
            {total > 0 && <Pagination total={total} page={page} limit={limit} />}
        </div>
    );
}
