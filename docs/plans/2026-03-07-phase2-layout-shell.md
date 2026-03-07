# Phase 2 — Layout Shell Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the Sidebar and Header layout components and wire them into the dashboard layout, completing Phase 2 of the dashboard template.

**Architecture:** Single `Sidebar` component handles both desktop (CSS width transition, always rendered) and mobile (Headless UI `Dialog` overlay with focus trap). `Header` is sticky with inline breadcrumb and placeholder icon buttons. Both components read from `SidebarContext` which is already implemented.

**Tech Stack:** Next.js App Router, Tailwind CSS v4, `@headlessui/react` v2, `lucide-react`, `cn()` from `@/lib/utils`

> **Note:** No tests or Storybook stories in Phase 2. Those land in Phases 8 and 7 respectively. Verification is `npm run build` (zero TS errors) + `npm run dev` (visual check).

---

## Task 1: Create nav config

**Files:**
- Create: `src/components/layout/Sidebar/navConfig.ts`

**Step 1: Create the file**

```ts
import { BarChart2, LayoutDashboard, Puzzle, ShoppingCart, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { label: "Dashboard",  href: "/admin",      icon: LayoutDashboard },
  { label: "Analytics",  href: "/analytics",  icon: BarChart2 },
  { label: "Users",      href: "/users",      icon: Users },
  { label: "Orders",     href: "/orders",     icon: ShoppingCart },
  { label: "Components", href: "/components", icon: Puzzle },
];
```

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors

**Step 3: Commit**

```bash
git add src/components/layout/Sidebar/navConfig.ts
git commit -m "feat: add sidebar nav config"
```

---

## Task 2: Create NavItem component

**Files:**
- Create: `src/components/layout/Sidebar/NavItem.tsx`

**Step 1: Create the file**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavItem as NavItemType } from "./navConfig";

interface NavItemProps {
  item: NavItemType;
  collapsed: boolean;
  onClick?: () => void;
}

export function NavItem({ item, collapsed, onClick }: NavItemProps) {
  const pathname = usePathname();
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + "/");
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-(--color-primary)/10 text-(--color-primary) font-medium"
          : "text-(--color-muted-foreground) hover:bg-(--color-muted) hover:text-(--color-foreground)"
      )}
      title={collapsed ? item.label : undefined}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span
        className={cn(
          "overflow-hidden whitespace-nowrap transition-all duration-200",
          collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
        )}
      >
        {item.label}
      </span>
    </Link>
  );
}
```

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors

**Step 3: Commit**

```bash
git add src/components/layout/Sidebar/NavItem.tsx
git commit -m "feat: add NavItem component with active state and collapsed mode"
```

---

## Task 3: Create Sidebar component

**Files:**
- Create: `src/components/layout/Sidebar/Sidebar.tsx`

**Step 1: Create the file**

```tsx
"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";
import { navItems } from "./navConfig";
import { NavItem } from "./NavItem";

function NavList({
  collapsed,
  onNavClick,
}: {
  collapsed: boolean;
  onNavClick?: () => void;
}) {
  return (
    <nav className="flex-1 space-y-1 px-2 py-4">
      {navItems.map((item) => (
        <NavItem
          key={item.href}
          item={item}
          collapsed={collapsed}
          onClick={onNavClick}
        />
      ))}
    </nav>
  );
}

export function Sidebar() {
  const { isOpen, isCollapsed, close, collapse } = useSidebar();

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside
        className={cn(
          "hidden md:flex flex-col h-screen sticky top-0 bg-(--color-sidebar-bg) border-r border-(--color-border) transition-[width] duration-200 overflow-hidden shrink-0",
          isCollapsed ? "w-16" : "w-60"
        )}
      >
        {/* Logo / brand */}
        <div
          className={cn(
            "flex h-16 items-center border-b border-(--color-border) px-4 shrink-0",
            isCollapsed ? "justify-center" : "gap-2"
          )}
        >
          {!isCollapsed && (
            <span className="font-semibold text-sm truncate">
              Dashboard
            </span>
          )}
        </div>

        <NavList collapsed={isCollapsed} />

        {/* Collapse toggle */}
        <div className="border-t border-(--color-border) p-2 shrink-0">
          <button
            onClick={collapse}
            className="flex w-full items-center justify-center rounded-md p-2 text-(--color-muted-foreground) hover:bg-(--color-muted) hover:text-(--color-foreground) transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </aside>

      {/* ── Mobile drawer ── */}
      <Dialog open={isOpen} onClose={close} className="relative z-50 md:hidden">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

        <div className="fixed inset-0 flex">
          <DialogPanel className="flex flex-col w-60 h-full bg-(--color-sidebar-bg) border-r border-(--color-border)">
            {/* Drawer header */}
            <div className="flex h-16 items-center justify-between border-b border-(--color-border) px-4 shrink-0">
              <span className="font-semibold text-sm">Dashboard</span>
              <button
                onClick={close}
                className="rounded-md p-1 text-(--color-muted-foreground) hover:bg-(--color-muted) hover:text-(--color-foreground) transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <NavList collapsed={false} onNavClick={close} />
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
```

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors

**Step 3: Commit**

```bash
git add src/components/layout/Sidebar/Sidebar.tsx
git commit -m "feat: add Sidebar — desktop collapse + mobile Dialog drawer"
```

---

## Task 4: Create Sidebar barrel export

**Files:**
- Create: `src/components/layout/Sidebar/index.ts`

**Step 1: Create the file**

```ts
export { Sidebar } from "./Sidebar";
export { NavItem } from "./NavItem";
export { navItems, type NavItem as NavItemConfig } from "./navConfig";
```

**Step 2: Commit**

```bash
git add src/components/layout/Sidebar/index.ts
git commit -m "feat: add Sidebar barrel export"
```

---

## Task 5: Create Header component

**Files:**
- Create: `src/components/layout/Header/Header.tsx`

**Step 1: Create the file**

```tsx
"use client";

import { Bell, Menu, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/contexts/SidebarContext";

function Breadcrumb() {
  const pathname = usePathname();
  // Split path and remove empty strings (leading slash produces one)
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-sm">
      <span className="text-(--color-muted-foreground)">Dashboard</span>
      {segments.map((segment, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span className="text-(--color-muted-foreground)">/</span>
          <span
            className={cn(
              "capitalize",
              i === segments.length - 1
                ? "text-(--color-foreground) font-medium"
                : "text-(--color-muted-foreground)"
            )}
          >
            {segment.replace(/-/g, " ")}
          </span>
        </span>
      ))}
    </nav>
  );
}

export function Header() {
  const { toggle } = useSidebar();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-(--color-border) bg-(--color-surface)/80 backdrop-blur-sm px-4 shrink-0">
      {/* Left: menu toggle */}
      <button
        onClick={toggle}
        className="rounded-md p-2 text-(--color-muted-foreground) hover:bg-(--color-muted) hover:text-(--color-foreground) transition-colors"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Center: breadcrumb */}
      <div className="flex-1 min-w-0">
        <Breadcrumb />
      </div>

      {/* Right: placeholder actions + avatar */}
      <div className="flex items-center gap-1">
        {/* Phase 3: CommandPalette trigger */}
        <button
          className="rounded-md p-2 text-(--color-muted-foreground) hover:bg-(--color-muted) hover:text-(--color-foreground) transition-colors"
          aria-label="Open command palette"
          aria-disabled="true"
          tabIndex={-1}
        >
          <Search className="h-5 w-5" />
        </button>

        {/* Phase 3: NotificationBell */}
        <button
          className="rounded-md p-2 text-(--color-muted-foreground) hover:bg-(--color-muted) hover:text-(--color-foreground) transition-colors"
          aria-label="Notifications"
          aria-disabled="true"
          tabIndex={-1}
        >
          <Bell className="h-5 w-5" />
        </button>

        {/* Avatar — hardcoded placeholder until auth is wired */}
        <div
          className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-(--color-primary) text-(--color-primary-foreground) text-xs font-semibold select-none"
          role="img"
          aria-label="User avatar: Jane Doe"
        >
          JD
        </div>
      </div>
    </header>
  );
}
```

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors

**Step 3: Commit**

```bash
git add src/components/layout/Header/Header.tsx
git commit -m "feat: add Header — breadcrumb, placeholder ⌘K + bell, avatar"
```

---

## Task 6: Create Header barrel export

**Files:**
- Create: `src/components/layout/Header/index.ts`

**Step 1: Create the file**

```ts
export { Header } from "./Header";
```

**Step 2: Commit**

```bash
git add src/components/layout/Header/index.ts
git commit -m "feat: add Header barrel export"
```

---

## Task 7: Wire Sidebar + Header into dashboard layout

**Files:**
- Modify: `src/app/(dashboard)/layout.tsx`

**Step 1: Replace the file contents**

```tsx
"use client";

import { SidebarProvider } from "@/contexts/SidebarContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <NotificationProvider>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex flex-1 flex-col min-w-0">
            <Header />
            <main className="flex-1 p-6 bg-(--color-background)">
              {children}
            </main>
          </div>
        </div>
      </NotificationProvider>
    </SidebarProvider>
  );
}
```

`min-w-0` on the inner div prevents content overflow when the sidebar expands.

**Step 2: Verify full build**

Run: `npm run build`
Expected: exits 0, zero TS / ESLint errors

**Step 3: Start dev server and verify visually**

Run: `npm run dev`

Check:
- [ ] Desktop: sidebar visible at 240px with all 5 nav items
- [ ] Desktop: collapse button shrinks sidebar to 64px (icons only)
- [ ] Desktop: active nav item highlighted in primary color
- [ ] Mobile (resize to <768px): sidebar hidden, hamburger in header opens drawer
- [ ] Mobile drawer: Esc key and backdrop click close the drawer
- [ ] Mobile drawer: clicking a nav link closes the drawer
- [ ] Header: breadcrumb updates as you navigate
- [ ] Header: sticky — scrolling content stays behind it
- [ ] Dark mode (add `?theme=dark` or toggle OS): tokens switch correctly

**Step 4: Commit**

```bash
git add src/app/(dashboard)/layout.tsx
git commit -m "feat: wire Sidebar and Header into dashboard layout — Phase 2 complete"
```

---

## Task 8: Update agents.md phase status

**Files:**
- Modify: `agents.md`

**Step 1: Mark Phase 2 items complete**

In the `### Phase 2 — Layout Shell` section, change all `- [ ]` to `- [x]`:

```markdown
### Phase 2 — Layout Shell
- [x] `src/contexts/SidebarContext.tsx`
- [x] `src/contexts/NotificationContext.tsx`
- [x] `src/components/layout/Sidebar/` (desktop collapse + mobile drawer)
- [x] `src/components/layout/Header/` (hamburger, breadcrumbs, ⌘K, bell, avatar)
- [x] `src/app/(dashboard)/layout.tsx`
- [x] `src/app/(auth)/layout.tsx`
- [x] `src/app/layout.tsx` (ThemeProvider, Toaster)
```

**Step 2: Commit**

```bash
git add agents.md
git commit -m "docs: mark Phase 2 complete in agents.md"
```
