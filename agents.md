# agents.md — Dashboard Template Project Context

> **Read this file first.** It gives you everything needed to understand,
> navigate, and extend this codebase without asking the user for context.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [Conventions & Patterns](#4-conventions--patterns)
5. [Design Token System](#5-design-token-system)
6. [Phase Implementation Status](#6-phase-implementation-status)
7. [How to Run](#7-how-to-run)
8. [Component Authoring Guide](#8-component-authoring-guide)
9. [Page / Route Guide](#9-page--route-guide)
10. [Data & Pagination](#10-data--pagination)
11. [Testing Guide](#11-testing-guide)
12. [Storybook Guide](#12-storybook-guide)
13. [Key Decisions](#13-key-decisions)
14. [Task Checklist](#14-task-checklist)

---

## 1. Project Overview

A **reusable, multi-layout dashboard template** built with Next.js 15
(App Router). The goal is a portable component library that any project can
adopt by copying folders and updating 3 CSS variables.

Key capabilities:
- Dark / light theming with zero flash on reload
- Multi-level collapsible sidebar (desktop) + drawer (mobile)
- Keyboard-accessible command palette (⌘K)
- Server-side pagination via URL search params (RSC-compatible)
- CSV export from any data table
- Full Storybook catalog of every component
- Vitest + RTL unit / integration tests
- Playwright E2E tests with axe accessibility audits

---

## 2. Tech Stack

| Concern | Package |
|---|---|
| Framework | `next` 16 — App Router, TypeScript |
| Styling | `tailwindcss` v4 |
| Theming | `next-themes` + `@custom-variant dark` |
| Accessible primitives | `@headlessui/react` v2 |
| Charts | `recharts` with `ResponsiveContainer` |
| Icons | `lucide-react` |
| Toasts | `sonner` |
| Table | `@tanstack/react-table` v8 |
| Date picker | `react-day-picker` v9 + `date-fns` |
| Command palette | `cmdk` |
| Class util | `clsx` + `tailwind-merge` → `cn()` |
| CSV export | `papaparse` |
| State | React Context (theme, sidebar, notifications) |
| Forms | Native React state + HTML5 validation |
| Data | Static mock JSON in `src/data/` |
| Unit tests | `vitest` + `@testing-library/react` |
| E2E tests | `@playwright/test` |
| Component catalog | `storybook` 8 + `@storybook/nextjs` |

---

## 3. Folder Structure

```
/
├── .storybook/
│   ├── main.ts            Storybook config — addons, stories glob
│   └── preview.tsx        Global decorators, globals.css import
├── playwright.config.ts   Playwright E2E config
├── vitest.config.ts       Vitest unit test config
├── .prettierrc            Prettier + prettier-plugin-tailwindcss
├── agents.md              ← YOU ARE HERE
└── src/
    ├── app/
    │   ├── globals.css            Design tokens + Tailwind base
    │   ├── layout.tsx             Root layout (ThemeProvider, Toaster)
    │   ├── not-found.tsx          Styled 404 page
    │   ├── page.tsx               Redirect → /admin
    │   ├── (auth)/
    │   │   ├── layout.tsx         Split-panel centered layout, no sidebar
    │   │   ├── login/page.tsx     Mock login form
    │   │   └── register/page.tsx  Mock register form
    │   └── (dashboard)/
    │       ├── layout.tsx         Sidebar + Header shell
    │       ├── loading.tsx        Page-level skeleton (Suspense fallback)
    │       ├── error.tsx          Error boundary with retry
    │       ├── admin/page.tsx     Admin dashboard
    │       ├── analytics/page.tsx Analytics dashboard
    │       ├── users/
    │       │   ├── page.tsx       Paginated user table
    │       │   └── [id]/page.tsx  User detail (Tabs: Profile/Activity/Settings)
    │       ├── orders/
    │       │   ├── page.tsx       Paginated order table
    │       │   └── [id]/page.tsx  Order detail (Stepper + Timeline)
    │       └── components/page.tsx Living component showcase
    ├── components/
    │   ├── ui/                    Portable, zero-app-dependency primitives
    │   │   ├── index.ts           Barrel export of ALL ui components
    │   │   ├── Button/
    │   │   ├── Badge/
    │   │   ├── Avatar/
    │   │   ├── Spinner/
    │   │   ├── Progress/
    │   │   ├── Alert/
    │   │   ├── Skeleton/
    │   │   ├── EmptyState/
    │   │   ├── Modal/
    │   │   ├── Drawer/
    │   │   ├── Tooltip/
    │   │   ├── Tabs/
    │   │   ├── Accordion/
    │   │   ├── Dropdown/
    │   │   ├── Breadcrumbs/
    │   │   ├── CommandPalette/
    │   │   ├── NotificationBell/
    │   │   ├── ThemeToggle/
    │   │   ├── Input/
    │   │   ├── Textarea/
    │   │   ├── Select/
    │   │   ├── Checkbox/
    │   │   ├── RadioGroup/
    │   │   ├── Toggle/
    │   │   ├── DateRangePicker/
    │   │   ├── Card/
    │   │   ├── StatCard/
    │   │   ├── TextCard/
    │   │   ├── ImageCard/
    │   │   ├── Stepper/
    │   │   └── Timeline/
    │   ├── layout/
    │   │   ├── Sidebar/           Desktop collapsible + mobile drawer
    │   │   └── Header/            Hamburger, breadcrumbs, ⌘K, bell, avatar
    │   ├── charts/
    │   │   ├── LineChart/
    │   │   ├── BarChart/
    │   │   ├── AreaChart/
    │   │   ├── PieChart/
    │   │   └── DonutChart/
    │   └── tables/
    │       ├── DataTable/         TanStack Table v8, sort/filter/select
    │       └── ExportButton/      papaparse CSV export
    ├── contexts/
    │   ├── SidebarContext.tsx     isOpen, isCollapsed, toggle(), collapse()
    │   ├── ThemeContext.tsx       (thin wrapper — next-themes does the work)
    │   └── NotificationContext.tsx  notifications[], markAllRead()
    ├── data/                      Static mock JSON + async fetch helpers
    ├── hooks/                     Custom React hooks (useMediaQuery, etc.)
    ├── lib/
    │   ├── utils.ts               cn(), formatNumber(), getInitials(), truncate()
    │   ├── export.ts              exportToCSV(data, filename, columns?)
    │   └── toast.ts               toast.success/error/info/warning/loading
    ├── styles/
    │   └── typography.css         @layer base — h1–h6, p, small, .caption
    ├── types/                     Shared TypeScript interfaces / enums
    └── tests/
        ├── setup.ts               @testing-library/jest-dom import
        └── e2e/                   Playwright spec files
```

---

## 4. Conventions & Patterns

### Component file layout

Every component lives in its own folder:

```
src/components/ui/Button/
├── Button.tsx          Main export
├── Button.test.tsx     Vitest + RTL tests
└── Button.stories.tsx  Storybook stories
```

### TypeScript prop interface

```ts
// Always export the prop interface
export interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "destructive" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}
```

### `cn()` for class merging

```ts
import { cn } from "@/lib/utils";

// Always use cn() so consumers can override classes via className
<button className={cn(base, variantClasses[variant], sizeClasses[size], className)} />
```

### Barrel export

Every new UI component **must** be added to `src/components/ui/index.ts`:

```ts
export { Button, type ButtonProps } from "./Button/Button";
```

### "use client" boundary

- Components that use `useState`, `useEffect`, event handlers, browser APIs,
  or Context → add `"use client"` at the top.
- Pages in `(dashboard)/` that only display server data → keep as RSC (no directive).
- Layout files → `"use client"` only if they use context/state directly.

### Context usage

Access contexts via custom hooks, not raw `useContext`:

```ts
// contexts/SidebarContext.tsx exports:
export function useSidebar() {
  return useContext(SidebarContext);
}
```

---

## 5. Design Token System

All tokens are CSS custom properties defined in `src/app/globals.css`.

### Color tokens (key ones)

| Variable | Purpose |
|---|---|
| `--color-primary` | Brand color — buttons, links, focus rings |
| `--color-destructive` | Danger actions |
| `--color-surface` | Card / panel background |
| `--color-sidebar-bg` | Sidebar background |
| `--color-muted` | Subdued backgrounds (skeleton, tags) |
| `--color-muted-foreground` | Placeholder / secondary text |
| `--color-border` | All borders, dividers |
| `--color-background` | Page background |
| `--color-foreground` | Primary text |

### Changing the brand color

Only change 3 variables in `:root`:

```css
:root {
  --color-primary: oklch(0.55 0.22 160);          /* green */
  --color-primary-foreground: oklch(0.99 0 0);
  --color-ring: oklch(0.55 0.22 160);
}
```

### Typography scale override

```css
:root {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --text-base: 1.0625rem;   /* nudge body size */
}
```

---

## 6. Phase Implementation Status

Track progress here. Mark items `[x]` when complete.

### Phase 1 — Scaffolding
- [x] create-next-app (TypeScript, Tailwind, ESLint, App Router, src/)
- [x] Install all runtime dependencies
- [x] Install all dev dependencies (Vitest, Playwright, Storybook, etc.)
- [x] `src/app/globals.css` — design tokens + Tailwind custom-variant dark
- [x] `src/styles/typography.css` — h1–h6 + body/small/caption via CSS vars
- [x] `src/lib/utils.ts` — cn(), formatNumber(), getInitials(), truncate()
- [x] `src/lib/export.ts` — exportToCSV() wrapping papaparse
- [x] `src/lib/toast.ts` — typed sonner wrappers
- [x] `tsconfig.json` — `@/*` alias covers all src/ sub-paths
- [x] Full folder structure created
- [x] `vitest.config.ts`
- [x] `playwright.config.ts`
- [x] `src/tests/setup.ts`
- [x] `.storybook/main.ts`
- [x] `.storybook/preview.tsx`
- [x] `.prettierrc`
- [x] `package.json` scripts (storybook, test:unit, test:e2e, etc.)

### Phase 2 — Layout Shell
- [x] `src/contexts/SidebarContext.tsx`
- [x] `src/contexts/NotificationContext.tsx`
- [x] `src/components/layout/Sidebar/` (desktop collapse + mobile drawer)
- [x] `src/components/layout/Header/` (hamburger, breadcrumbs, ⌘K, bell, avatar)
- [x] `src/app/(dashboard)/layout.tsx`
- [x] `src/app/(auth)/layout.tsx`
- [x] `src/app/layout.tsx` (ThemeProvider, Toaster)

### Phase 3 — UI Component Library
- [x] Button
- [x] Badge
- [x] Avatar + AvatarGroup
- [x] Spinner
- [x] Progress (linear + ring)
- [x] Alert
- [x] Skeleton (card, table-row, chart, avatar variants)
- [x] EmptyState
- [x] Modal + ConfirmDialog
- [x] Drawer
- [x] Tooltip
- [x] Tabs
- [x] Accordion
- [x] Dropdown
- [x] Breadcrumbs
- [x] CommandPalette
- [x] NotificationBell
- [x] ThemeToggle
- [x] Input
- [x] Textarea
- [x] Select (native + Listbox)
- [x] Checkbox
- [x] RadioGroup
- [x] Toggle (switch)
- [x] DateRangePicker
- [x] Card + CardHeader + CardBody + CardFooter
- [x] StatCard
- [x] TextCard
- [x] ImageCard
- [x] Stepper (horizontal + vertical)
- [x] Timeline
- [x] `src/components/ui/index.ts` barrel

### Phase 4 — Charts
- [ ] LineChart (multi-series, monotone, custom tooltip)
- [ ] BarChart (grouped + stacked)
- [ ] AreaChart (gradient fill)
- [ ] PieChart
- [ ] DonutChart

### Phase 5 — Data Table + Pagination + Export
- [ ] `src/components/tables/DataTable/` (sort, filter, select, skeleton, empty)
- [ ] `src/components/tables/ExportButton/`
- [ ] `src/data/` — mock JSON + `fetchPagedData(page, limit)` async helpers
- [ ] URL search param Pagination component

### Phase 6 — Pages
- [ ] `src/app/(dashboard)/admin/page.tsx`
- [ ] `src/app/(dashboard)/analytics/page.tsx`
- [ ] `src/app/(dashboard)/users/page.tsx` (server-paginated)
- [ ] `src/app/(dashboard)/users/[id]/page.tsx`
- [ ] `src/app/(dashboard)/orders/page.tsx` (server-paginated)
- [ ] `src/app/(dashboard)/orders/[id]/page.tsx`
- [ ] `src/app/(auth)/login/page.tsx`
- [ ] `src/app/(auth)/register/page.tsx`
- [ ] `src/app/(dashboard)/components/page.tsx`
- [ ] `src/app/not-found.tsx`
- [ ] `src/app/(dashboard)/error.tsx`
- [ ] `src/app/(dashboard)/loading.tsx`

### Phase 7 — Storybook
- [ ] Stories for every `src/components/ui/` component
- [ ] Stories for `layout/Sidebar` and `layout/Header`
- [ ] Stories for all chart components

### Phase 8 — Testing
- [ ] Unit tests: Button, Modal, DataTable, Pagination, Badge, Avatar, Alert, Stepper, Tabs, Accordion
- [ ] Util tests: `cn()`, `exportToCSV()`
- [ ] Integration tests: Login page, Users page pagination + export, theme toggle
- [ ] E2E: `navigation.spec.ts`, `theme.spec.ts`, `tables.spec.ts`, `auth.spec.ts`, `a11y.spec.ts`

### Phase 9 — Polish
- [ ] ESLint `jsx-a11y` configured
- [ ] `README.md` with setup, theming, and contribution guide
- [ ] Build passes with zero TS / ESLint errors

---

## 7. How to Run

```bash
# Development
npm run dev           # http://localhost:3000

# Storybook
npm run storybook     # http://localhost:6006

# Unit tests (watch)
npm run test:unit:watch

# Unit tests (CI)
npm run test:unit

# E2E tests (requires dev server or will start one)
npm run test:e2e

# Build
npm run build

# All tests
npm run test:all
```

---

## 8. Component Authoring Guide

### Step-by-step: adding a new UI component `Foo`

1. Create the folder: `src/components/ui/Foo/`
2. Create `Foo.tsx`:

```tsx
"use client"; // only if needed

import { cn } from "@/lib/utils";

export interface FooProps {
  variant?: "default" | "outlined";
  className?: string;
  children: React.ReactNode;
}

export function Foo({ variant = "default", className, children }: FooProps) {
  return (
    <div
      className={cn(
        "rounded-md px-4 py-2",
        variant === "outlined" && "border border-(--color-border)",
        className
      )}
    >
      {children}
    </div>
  );
}
```

3. Add to barrel: `src/components/ui/index.ts`

```ts
export { Foo, type FooProps } from "./Foo/Foo";
```

4. Create `Foo.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { Foo } from "./Foo";

describe("Foo", () => {
  it("renders children", () => {
    render(<Foo>Hello</Foo>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
```

5. Create `Foo.stories.tsx`:

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Foo } from "./Foo";

const meta: Meta<typeof Foo> = {
  component: Foo,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Foo>;

export const Default: Story = { args: { children: "Foo component" } };
export const Outlined: Story = { args: { variant: "outlined", children: "Foo component" } };
```

### Headless UI usage pattern

```tsx
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

// Always include focus trap, portal, Esc-to-close (Headless UI handles these)
<Dialog open={isOpen} onClose={onClose}>
  <div className="fixed inset-0 z-50 bg-black/50" aria-hidden="true" />
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <DialogPanel className="w-full max-w-md rounded-xl bg-(--color-card) p-6 shadow-xl">
      <DialogTitle className="text-lg font-semibold">Title</DialogTitle>
      {/* content */}
    </DialogPanel>
  </div>
</Dialog>
```

### Dark-mode aware Recharts tooltip

```tsx
function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-(--color-border) bg-(--color-card) px-3 py-2 shadow-lg text-sm">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}
```

---

## 9. Page / Route Guide

### Route groups

| Group | Layout | Purpose |
|---|---|---|
| `(dashboard)` | Sidebar + Header | All authenticated pages |
| `(auth)` | Split-panel, no sidebar | Login, Register |

### Server-side pagination pattern

Page receives search params as RSC props:

```tsx
// src/app/(dashboard)/users/page.tsx
export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string }>;
}) {
  const { page = "1", limit = "10" } = await searchParams;
  const { data, total } = await fetchPagedUsers(Number(page), Number(limit));

  return (
    <DataTable
      data={data}
      columns={columns}
      total={total}
      page={Number(page)}
      limit={Number(limit)}
    />
  );
}
```

The `Pagination` component (client) reads/writes `?page=N&limit=N` via
`useRouter` + `useSearchParams`.

### Mock data helper pattern

```ts
// src/data/users.ts
import usersJson from "./users.json";

export async function fetchPagedUsers(page: number, limit: number) {
  await sleep(200); // simulate network
  const start = (page - 1) * limit;
  return {
    data: usersJson.slice(start, start + limit),
    total: usersJson.length,
  };
}
```

---

## 10. Data & Pagination

- All data lives in `src/data/*.json` (static mocks — no real API).
- Each entity (users, orders, etc.) has a `fetchPaged*(page, limit)` async
  helper that simulates a server roundtrip with `sleep(200)`.
- Page routes receive `searchParams` as RSC props and pass `{ data, total,
  page, limit }` down to `DataTable`.
- `DataTable` is a **client component** (uses TanStack Table hooks) but
  receives already-paginated `data` from the server.
- Pagination component writes back to the URL; the RSC reruns automatically.

---

## 11. Testing Guide

### Unit / integration tests (Vitest + RTL)

Files: `src/**/*.test.tsx` (colocated with component or in `src/tests/`)

```bash
npm run test:unit       # one-shot
npm run test:unit:watch # watch mode
npm run test:unit:ui    # browser UI
```

Config: `vitest.config.ts` — jsdom environment, globals: true.

Setup file: `src/tests/setup.ts` — imports `@testing-library/jest-dom`.

### E2E tests (Playwright)

Files: `src/tests/e2e/*.spec.ts`

```bash
npm run test:e2e        # headless
npm run test:e2e:ui     # Playwright UI mode
```

Config: `playwright.config.ts` — base URL `http://localhost:3000`,
Chromium + Firefox, webServer auto-starts `npm run dev`.

### axe accessibility audit pattern

```ts
// src/tests/e2e/a11y.spec.ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("admin page has no a11y violations", async ({ page }) => {
  await page.goto("/admin");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

---

## 12. Storybook Guide

- Start: `npm run storybook` → http://localhost:6006
- Every story file: `ComponentName.stories.tsx` colocated in the component folder
- All props wired to `argTypes` for the interactive Controls panel
- Dark mode: toggle "dark" background in the Storybook toolbar →
  preview.tsx decorator adds/removes `.dark` class on `<html>`

### Story template

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["primary","secondary","ghost","destructive","outline"] },
    size:    { control: "radio",  options: ["sm", "md", "lg"] },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary:     Story = { args: { variant: "primary",     children: "Click me" } };
export const Secondary:   Story = { args: { variant: "secondary",   children: "Click me" } };
export const Destructive: Story = { args: { variant: "destructive", children: "Delete" } };
export const Loading:     Story = { args: { variant: "primary",     loading: true, children: "Saving…" } };
export const Disabled:    Story = { args: { variant: "primary",     disabled: true, children: "Disabled" } };
```

---

## 13. Key Decisions

| Decision | Rationale |
|---|---|
| URL search params for pagination | Compatible with RSC — page component gets params as props, enabling true server-side data fetching without client state |
| `papaparse` for CSV only | Sufficient for a template; consuming projects needing `.xlsx` can swap in SheetJS without changing `exportToCSV` call signature |
| ⌘K only for search | A visible search input would duplicate the palette; the ⌘K trigger in the Header IS the visible entry point |
| Vitest (not Jest) | Faster, native Vite compatibility; Playwright handles E2E separately — clean separation of concerns |
| `@storybook/nextjs` framework | Handles App Router, Tailwind, and `next/image` automatically — no manual webpack config needed |
| Headless UI v2 for overlay/nav | Full ARIA conformance, focus trapping, and Esc handling out of the box — avoids reimplementing accessibility primitives |
| `next-themes` + CSS `.dark` class | Standard pattern; works with Tailwind `@custom-variant dark`; persists via `localStorage`; no FOUC when `defaultTheme="system"` |
| Static mock data in `src/data/` | Zero backend dependency for the template; consuming projects replace mock helpers with real fetch calls |
| `oklch()` for color tokens | Perceptually uniform, future-proof; supported in all modern browsers |

---

## 14. Task Checklist

When implementing a phase, work top-to-bottom through the checklist in
[§ 6 Phase Implementation Status](#6-phase-implementation-status).

After completing each item:
1. Mark it `[x]` in this file.
2. Ensure `npm run build` still passes (zero TS errors).
3. Run `npm run test:unit` — all existing tests must pass.
4. If adding a component, ensure it has a Story and a test file.

> **Do not skip steps.** The template's value is its completeness.
