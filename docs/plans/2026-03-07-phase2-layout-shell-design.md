# Phase 2 — Layout Shell Design

**Date:** 2026-03-07
**Status:** Approved

---

## Overview

Build the dashboard layout shell: a collapsible desktop sidebar + mobile drawer, plus a sticky header. Wire both into `src/app/(dashboard)/layout.tsx`.

Contexts (`SidebarContext`, `NotificationContext`) and all layout files are already scaffolded. Phase 2 fills in the missing component implementations.

---

## File Structure

```
src/components/layout/
├── Sidebar/
│   ├── Sidebar.tsx       # Main export — desktop + mobile combined
│   ├── NavItem.tsx       # Single nav link (icon + label + active state)
│   ├── navConfig.ts      # Typed nav items array
│   └── index.ts          # Re-export
└── Header/
    ├── Header.tsx         # Main export
    └── index.ts           # Re-export
```

No test or story files in Phase 2 — those land in Phases 7 and 8.

---

## Sidebar

### Approach

Single component using **Headless UI `<Dialog>`** for the mobile drawer (focus trap, Esc-to-close, ARIA `role="dialog"` for free) and CSS width transition for the desktop collapse.

### Desktop

- Fixed left column, always rendered.
- Width: `240px` expanded → `64px` collapsed (icon-only).
- CSS `transition-[width]` for smooth animation.
- Collapse toggle button at the bottom of the sidebar.
- `isCollapsed` from `useSidebar()` drives the width.

### Mobile

- `isOpen` from `useSidebar()` drives `<Dialog open={isOpen}>`.
- Full-height overlay drawer slides in from the left.
- Backdrop (`aria-hidden`) closes on click via `onClose={() => close()}`.
- Nav link clicks call `close()` so drawer auto-dismisses on navigation.

### Nav Config (`navConfig.ts`)

```ts
import {
  LayoutDashboard, BarChart2, Users, ShoppingCart, Puzzle,
} from "lucide-react";

export const navItems = [
  { label: "Dashboard",  href: "/admin",      icon: LayoutDashboard },
  { label: "Analytics",  href: "/analytics",  icon: BarChart2 },
  { label: "Users",      href: "/users",      icon: Users },
  { label: "Orders",     href: "/orders",     icon: ShoppingCart },
  { label: "Components", href: "/components", icon: Puzzle },
];
```

### NavItem

- Uses `usePathname()` to detect active route.
- Active: `bg-(--color-primary)/10 text-(--color-primary) font-medium`
- Inactive: `text-(--color-muted-foreground) hover:bg-(--color-muted) hover:text-(--color-foreground)`
- Collapsed: label hidden (`opacity-0`, `w-0`, `overflow-hidden`), icon centered.
- Expanded: icon + label side-by-side with `gap-3`.

---

## Header

**Sticky:** `sticky top-0 z-30 bg-(--color-surface)/80 backdrop-blur-sm border-b border-(--color-border)`

### Left

- Hamburger/menu button → `useSidebar().toggle()`

### Center

- Inline breadcrumb from `usePathname()`: splits path into segments and renders `Home / Segment` with `/` separators. No dedicated `Breadcrumbs` component yet (Phase 3).

### Right (left to right)

| Element | Behavior |
|---|---|
| `Search` icon button | Placeholder, `aria-label="Open command palette"` |
| `Bell` icon button | Placeholder, `aria-label="Notifications"` |
| Avatar circle | Hardcoded initials `"JD"`, `bg-(--color-primary) text-(--color-primary-foreground)` |

---

## Dashboard Layout Wiring

`src/app/(dashboard)/layout.tsx` updated to:

```tsx
<div className="flex min-h-screen">
  <Sidebar />
  <div className="flex flex-1 flex-col min-w-0">
    <Header />
    <main className="flex-1 p-6 bg-(--color-background)">{children}</main>
  </div>
</div>
```

`min-w-0` on the flex child prevents content overflow when the sidebar expands.

---

## Out of Scope for Phase 2

- `CommandPalette` component — Phase 3
- `NotificationBell` component — Phase 3
- `Breadcrumbs` component — Phase 3
- `ThemeToggle` in header — Phase 3
- Tests — Phase 8
- Storybook stories — Phase 7
