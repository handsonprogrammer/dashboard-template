# Phase 5 — Data Table + Pagination + Export Design

**Date:** 2026-03-07
**Status:** Approved

---

## Overview

Build three reusable table components: `DataTable` (TanStack Table v8 wrapper with sorting, per-column filtering, row selection, skeleton, and empty state), `Pagination` (URL search param driven), and `ExportButton` (thin wrapper around the existing `exportToCSV()`). The data layer (`users.ts`, `orders.ts`, and their JSON files) is already implemented.

---

## File Structure

```
src/components/tables/
├── DataTable/
│   ├── DataTable.tsx        Main component
│   ├── columns.tsx          Re-exports ColumnDef helper type
│   └── index.ts             Barrel
├── ExportButton/
│   ├── ExportButton.tsx
│   └── index.ts
├── Pagination/
│   ├── Pagination.tsx
│   └── index.ts
└── index.ts                 Barrel: re-exports all 3 + types
```

No new data files needed — `src/data/users.ts`, `orders.ts`, and `analytics.ts` already have `fetchPaged*` helpers and JSON sources.

---

## Component: `DataTable<T>`

### Props

```ts
export interface DataTableProps<T> {
  data: T[];                    // already-paginated slice from server
  columns: ColumnDef<T>[];      // caller-defined TanStack column defs
  total: number;                // total record count (for pagination)
  page: number;                 // current page (1-based)
  limit: number;                // rows per page
  isLoading?: boolean;          // show skeleton rows (default false)
  emptyMessage?: string;        // empty state label
  exportFilename?: string;      // when provided, enables Export button
  className?: string;
}
```

### Behaviour

- **Sorting** — `useSortingState` from TanStack. Clicking a column header cycles asc → desc → unsorted. Active column shows a sort icon (`ArrowUp` / `ArrowDown` from lucide).
- **Per-column filtering** — each column can opt in via TanStack's `enableColumnFilter: true`. A text `<input>` renders below the column header. Filtering is client-side against the current page's `data` slice.
- **Row selection** — checkbox column prepended automatically. Selecting ≥1 row shows a bulk toolbar: `{N} rows selected · [Export Selected]`.
- **Bulk toolbar** — renders `ExportButton` with selected rows as `data`. Only shown when ≥1 row is selected. No delete action.
- **Skeleton** — `isLoading={true}` renders 5 placeholder rows using the existing `Skeleton` component from `src/components/ui`.
- **Empty state** — `data.length === 0` and not loading renders the existing `EmptyState` component from `src/components/ui`.
- **Pagination** — `<Pagination>` rendered at the bottom of `DataTable`, receiving `total`, `page`, `limit`. Only rendered when `total > 0`.

### Internal structure

```tsx
<div className={cn("space-y-2", className)}>
  {/* Bulk action toolbar — visible only when rows selected */}
  {selectedRows.length > 0 && <BulkToolbar ... />}

  {/* Table */}
  <div className="rounded-(--radius-lg) border border-(--color-border) overflow-hidden">
    <table className="w-full text-sm">
      <thead>...</thead>
      <tbody>
        {isLoading ? <SkeletonRows /> : rows.map(...)}
      </tbody>
    </table>
    {!isLoading && data.length === 0 && <EmptyState ... />}
  </div>

  {/* Pagination */}
  {total > 0 && <Pagination total={total} page={page} limit={limit} />}
</div>
```

---

## Component: `Pagination`

### Props

```ts
export interface PaginationProps {
  total: number;       // total record count
  page: number;        // current page (1-based)
  limit: number;       // rows per page
  className?: string;
}
```

### Behaviour

- `"use client"` — uses `useRouter` + `useSearchParams`.
- Writes `?page=N&limit=N` to URL, preserving other search params.
- Changing `limit` resets to `page=1`.
- Layout: `[10 ▾]  Showing 1–10 of 247   ← 1 2 3 … 25 →`
- Page buttons: first, last, current ±1, with `…` ellipsis gaps. Max ~7 visible buttons.
- Prev/Next buttons disabled at boundaries.
- Limit `<select>` options: `[10, 25, 50, 100]`.

---

## Component: `ExportButton`

### Props

```ts
export interface ExportButtonProps {
  data: Record<string, unknown>[];
  filename: string;
  columns?: string[];           // optional key allowlist
  label?: string;               // default "Export CSV"
  className?: string;
}
```

### Behaviour

- `"use client"` — triggers browser download on click.
- Renders `<Button variant="outline" size="sm">` with `Download` lucide icon.
- Calls `exportToCSV(data, filename, columns)` from `src/lib/export.ts` on click.
- Used standalone (export all) and inside DataTable's bulk toolbar (export selected).

---

## Barrel Exports

```ts
// src/components/tables/index.ts
export { DataTable, type DataTableProps } from "./DataTable";
export { ExportButton, type ExportButtonProps } from "./ExportButton";
export { Pagination, type PaginationProps } from "./Pagination";
```

`columns.tsx` re-exports `ColumnDef` from `@tanstack/react-table` so pages can import it from one place:
```ts
export type { ColumnDef } from "@tanstack/react-table";
```

---

## Out of Scope for Phase 5

- Delete / bulk delete — no real API; excluded by design
- Global (cross-column) text filter — per-column filters are sufficient
- Column visibility toggle — not needed for template
- Drag-to-reorder columns — not needed for template
- Server-side sorting/filtering — mock data is fully client-side after the page fetch
- Tests — Phase 8
- Storybook stories — Phase 7
