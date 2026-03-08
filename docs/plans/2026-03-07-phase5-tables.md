# Phase 5 — Data Table + Pagination + Export Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build `DataTable`, `Pagination`, and `ExportButton` components — the reusable table layer used by the Users and Orders pages.

**Architecture:** `DataTable` is a thin TanStack Table v8 wrapper: caller provides `data` and `columns`, DataTable owns sorting/filtering/selection state and renders the toolbar, table, empty state, and pagination slot. `Pagination` is a client-side URL-writer (reads/writes `?page=N&limit=N`). `ExportButton` wraps the already-implemented `exportToCSV()` from `src/lib/export.ts`.

**Tech Stack:** `@tanstack/react-table` v8, `next/navigation` (`useRouter`, `useSearchParams`), lucide-react, Tailwind CSS v4 (CSS variable syntax), existing UI components (`SkeletonTableRow`, `EmptyState`, `Button`).

---

## Context

**Data layer is already done.** Do not create or modify:
- `src/data/users.ts` — `fetchPagedUsers(page, limit)` + `fetchUserById(id)`
- `src/data/orders.ts` — `fetchPagedOrders(page, limit)` + `fetchOrderById(id)`
- `src/data/users.json`, `src/data/orders.json`
- `src/lib/export.ts` — `exportToCSV(data, filename, columns?)` already implemented
- `src/types/index.ts` — `PaginatedResult<T>` already defined

**Existing components you WILL import:**
- `SkeletonTableRow` from `@/components/ui` — renders a `<tr>` with animated skeleton cells
- `EmptyState` from `@/components/ui` — takes `title?: string`, `description?: string`, `icon?`
- `Button` from `@/components/ui` — `variant="outline"`, `size="sm"` are valid props
- `cn` from `@/lib/utils`

**Tailwind CSS v4 note:** CSS variables are referenced as `bg-(--color-primary)`, `text-(--color-muted-foreground)`, `border-(--color-border)`, etc. Do NOT use `bg-[var(--color-primary)]` — the parenthesis syntax is correct.

**No test files in this phase.** Tests are Phase 8. No Storybook stories either (Phase 7).

---

## Task 1: `ExportButton` component

**Files:**
- Create: `src/components/tables/ExportButton/ExportButton.tsx`
- Create: `src/components/tables/ExportButton/index.ts`

**Step 1: Create the component**

Create `src/components/tables/ExportButton/ExportButton.tsx`:

```tsx
"use client";

import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { exportToCSV } from "@/lib/export";
import { Button } from "@/components/ui";

export interface ExportButtonProps {
    data: Record<string, unknown>[];
    filename: string;
    columns?: string[];
    label?: string;
    className?: string;
}

export function ExportButton({
    data,
    filename,
    columns,
    label = "Export CSV",
    className,
}: ExportButtonProps) {
    function handleClick() {
        exportToCSV(data, filename, columns);
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleClick}
            className={cn("gap-2", className)}
        >
            <Download size={14} />
            {label}
        </Button>
    );
}
```

**Step 2: Create the barrel**

Create `src/components/tables/ExportButton/index.ts`:

```ts
export { ExportButton, type ExportButtonProps } from "./ExportButton";
```

**Step 3: Verify TypeScript**

```bash
cd /Users/ram/projects/dashboard-template && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors referencing ExportButton files.

**Step 4: Commit**

```bash
git add src/components/tables/ExportButton/ && git commit -m "feat: add ExportButton component wrapping exportToCSV"
```

---

## Task 2: `Pagination` component

**Files:**
- Create: `src/components/tables/Pagination/Pagination.tsx`
- Create: `src/components/tables/Pagination/index.ts`

**Step 1: Create the component**

Create `src/components/tables/Pagination/Pagination.tsx`:

```tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
    total: number;
    page: number;
    limit: number;
    className?: string;
}

const LIMIT_OPTIONS = [10, 25, 50, 100];

function getPageNumbers(current: number, totalPages: number): (number | "...")[] {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (current <= 4) {
        return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (current >= totalPages - 3) {
        return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", current - 1, current, current + 1, "...", totalPages];
}

export function Pagination({ total, page, limit, className }: PaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);
    const pages = getPageNumbers(page, totalPages);

    function navigate(newPage: number, newLimit: number) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(newPage));
        params.set("limit", String(newLimit));
        router.push(`?${params.toString()}`);
    }

    return (
        <div className={cn("flex flex-wrap items-center justify-between gap-4 text-sm", className)}>
            {/* Left: limit selector + count */}
            <div className="flex items-center gap-2 text-(--color-muted-foreground)">
                <select
                    value={limit}
                    onChange={(e) => navigate(1, Number(e.target.value))}
                    className="rounded-(--radius) border border-(--color-border) bg-(--color-card) px-2 py-1 text-sm text-(--color-foreground) focus:outline-none focus:ring-2 focus:ring-(--color-ring)"
                    aria-label="Rows per page"
                >
                    {LIMIT_OPTIONS.map((o) => (
                        <option key={o} value={o}>
                            {o}
                        </option>
                    ))}
                </select>
                <span>
                    Showing {start}–{end} of {total}
                </span>
            </div>

            {/* Right: page buttons */}
            <div className="flex items-center gap-1">
                <button
                    onClick={() => navigate(page - 1, limit)}
                    disabled={page <= 1}
                    aria-label="Previous page"
                    className="rounded-(--radius) p-1.5 text-(--color-muted-foreground) hover:bg-(--color-muted) disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <ChevronLeft size={16} />
                </button>

                {pages.map((p, i) =>
                    p === "..." ? (
                        <span
                            key={`ellipsis-${i}`}
                            className="px-2 text-(--color-muted-foreground)"
                        >
                            …
                        </span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => navigate(p as number, limit)}
                            aria-current={p === page ? "page" : undefined}
                            className={cn(
                                "min-w-[2rem] rounded-(--radius) px-2 py-1 text-sm transition-colors",
                                p === page
                                    ? "bg-(--color-primary) text-(--color-primary-foreground)"
                                    : "text-(--color-foreground) hover:bg-(--color-muted)",
                            )}
                        >
                            {p}
                        </button>
                    ),
                )}

                <button
                    onClick={() => navigate(page + 1, limit)}
                    disabled={page >= totalPages}
                    aria-label="Next page"
                    className="rounded-(--radius) p-1.5 text-(--color-muted-foreground) hover:bg-(--color-muted) disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}
```

**Step 2: Create the barrel**

Create `src/components/tables/Pagination/index.ts`:

```ts
export { Pagination, type PaginationProps } from "./Pagination";
```

**Step 3: Verify TypeScript**

```bash
cd /Users/ram/projects/dashboard-template && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors referencing Pagination files.

**Step 4: Commit**

```bash
git add src/components/tables/Pagination/ && git commit -m "feat: add Pagination component with URL search param navigation"
```

---

## Task 3: `DataTable` component

**Files:**
- Create: `src/components/tables/DataTable/columns.tsx`
- Create: `src/components/tables/DataTable/DataTable.tsx`
- Create: `src/components/tables/DataTable/index.ts`

### What `DataTable` must do

- Prepend a checkbox selection column automatically (callers don't need to add it)
- Sort on column header click — cycles asc → desc → none; shows sort icon
- Filter per column — input appears below column header when `enableColumnFilter: true` on a column def
- Bulk toolbar appears when ≥1 row selected: `"{N} rows selected · [Export Selected]"` (only shown when `exportFilename` prop is provided)
- Loading state: 5 `SkeletonTableRow` rows (already imported from `@/components/ui`)
- Empty state: `EmptyState` component (already imported from `@/components/ui`)
- `Pagination` rendered below the table when `total > 0`

### Step 1: Create `columns.tsx`

Create `src/components/tables/DataTable/columns.tsx`:

```ts
// Convenience re-export so pages import ColumnDef from one place
// instead of from @tanstack/react-table directly.
export type { ColumnDef } from "@tanstack/react-table";
```

### Step 2: Create `DataTable.tsx`

Create `src/components/tables/DataTable/DataTable.tsx`:

```tsx
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
import { useState } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SkeletonTableRow, EmptyState } from "@/components/ui";
import { ExportButton } from "../ExportButton";
import { Pagination } from "../Pagination";

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

    // Prepend checkbox selection column
    const allColumns: ColumnDef<T>[] = [
        {
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
        },
        ...columns,
    ];

    const table = useReactTable({
        data,
        columns: allColumns,
        state: { sorting, rowSelection },
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
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
                                        style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                                        className="px-4 py-3 text-left font-medium text-(--color-muted-foreground)"
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div className="space-y-1.5">
                                                {/* Sort trigger */}
                                                <div
                                                    className={cn(
                                                        "flex items-center gap-1",
                                                        header.column.getCanSort() &&
                                                            "cursor-pointer select-none hover:text-(--color-foreground)",
                                                    )}
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext(),
                                                    )}
                                                    {header.column.getCanSort() && (
                                                        <span className="shrink-0 text-(--color-muted-foreground)">
                                                            {header.column.getIsSorted() === "asc" ? (
                                                                <ArrowUp size={12} />
                                                            ) : header.column.getIsSorted() === "desc" ? (
                                                                <ArrowDown size={12} />
                                                            ) : (
                                                                <ArrowUpDown size={12} />
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
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
```

### Step 3: Create the barrel

Create `src/components/tables/DataTable/index.ts`:

```ts
export { DataTable, type DataTableProps } from "./DataTable";
export type { ColumnDef } from "./columns";
```

### Step 4: Verify TypeScript

```bash
cd /Users/ram/projects/dashboard-template && npx tsc --noEmit 2>&1 | head -40
```

Expected: zero errors.

### Step 5: Commit

```bash
git add src/components/tables/DataTable/ && git commit -m "feat: add DataTable with sorting, per-column filter, row selection, skeleton, empty state"
```

---

## Task 4: Tables barrel

**Files:**
- Create: `src/components/tables/index.ts`

**Step 1: Create the barrel**

Create `src/components/tables/index.ts`:

```ts
export { DataTable, type DataTableProps } from "./DataTable";
export type { ColumnDef } from "./DataTable";
export { ExportButton, type ExportButtonProps } from "./ExportButton";
export { Pagination, type PaginationProps } from "./Pagination";
```

**Step 2: Commit**

```bash
git add src/components/tables/index.ts && git commit -m "feat: add tables barrel export"
```

---

## Task 5: Build verification

**Step 1: Run TypeScript check**

```bash
cd /Users/ram/projects/dashboard-template && npx tsc --noEmit 2>&1
```

Expected: no output (zero errors).

**Step 2: Run Next.js build**

```bash
cd /Users/ram/projects/dashboard-template && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully` with exit code 0.

**Step 3: Mark Phase 5 complete in agents.md**

In `agents.md`, find the Phase 5 section and mark all items `[x]`:

```markdown
### Phase 5 — Data Table + Pagination + Export
- [x] `src/components/tables/DataTable/` (sort, filter, select, skeleton, empty)
- [x] `src/components/tables/ExportButton/`
- [x] `src/data/` — mock JSON + `fetchPagedData(page, limit)` async helpers
- [x] URL search param Pagination component
```

**Step 4: Commit**

```bash
git add agents.md && git commit -m "chore: mark Phase 5 complete in agents.md"
```
