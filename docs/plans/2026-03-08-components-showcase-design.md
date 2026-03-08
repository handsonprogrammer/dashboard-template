# Components Showcase Redesign — Design Document

**Date:** 2026-03-08
**Status:** Approved

---

## Goal

Improve the `/components` page in two dimensions:

1. **Better visual framing** — each component demo lives in a tabbed `Preview | Code` block with a styled inset preview area
2. **Stronger interaction** — inline prop controls drive live previews; copy button on every code block

---

## Architecture

### 1. `ComponentBlock` (replaces `Section`)

New component at the top of `components/page.tsx` (file-local helper).

**Props:**
```ts
interface ComponentBlockProps {
  title: string;
  description?: string;
  code?: string;
  controls?: Control[];
  className?: string;
  children: ReactNode | ((state: ControlState) => ReactNode);
}
```

**Layout:**
```
┌──────────────────────────────────────────────────┐
│ <title>                        [Preview] [Code]  │
│ <description>                                    │
├──────────────────────────────────────────────────┤
│  ░ preview pane (bg-muted/40, border, p-6) ░░░░ │  ← active when Preview tab
│  OR                                              │
│  <CodeBlock code={code} />                       │  ← active when Code tab
│  ─────────────────────────────────────────────  │
│  [controls strip]  (only when controls provided) │
└──────────────────────────────────────────────────┘
```

- Tab state: local `useState<"preview" | "code">`, defaults to `"preview"`
- When no `code` prop: no tab bar rendered, just the preview pane
- `children` is a render prop when `controls` are provided; plain `ReactNode` otherwise

### 2. Controls System

**Types:**
```ts
type Control =
  | { type: "select";  prop: string; label: string; options: string[] }
  | { type: "boolean"; prop: string; label: string }

type ControlState = Record<string, string | boolean>
```

**State management:** `useReducer` inside `ComponentBlock`, initialised from `controls` array (first option for selects, `false` for booleans).

**Controls strip UI:**
- Rendered below the preview pane (visible in both Preview and Code tab views)
- Each `select` control: label + row of pill buttons; active pill = `bg-(--color-primary) text-(--color-primary-foreground)`
- Each `boolean` control: label + two pills (`off` / `on`)

### 3. `CodeBlock` — Copy Button

Add a copy button to the top-right of `CodeBlock`:

- Icon: `Copy` → `Check` (1.5 s) from lucide-react
- Behaviour: `navigator.clipboard.writeText(code)`
- Style: small ghost `<button>`, positioned absolutely or flex-end within the code block header

No new dependencies.

---

## Components That Get Inline Controls

| Component    | Controls                                      |
|--------------|-----------------------------------------------|
| Button       | variant (5 options), size (sm/md/lg), loading (bool), disabled (bool) |
| Badge        | variant (7 options), dot (bool)               |
| Alert        | variant (success/warning/destructive/info)    |
| Spinner      | size (sm/md/lg)                               |
| Progress     | variant (default/success/warning/destructive), value (25/50/75/100) |
| Input        | state (default/error/disabled)                |
| Toggle       | size (sm/md/lg), checked (bool)               |
| Avatar       | size (xs/sm/md/lg/xl)                         |

All other sections get Preview/Code tabs + copy button only (static demos unchanged).

---

## Files Changed

| File | Change |
|------|--------|
| `src/app/(dashboard)/components/page.tsx` | Replace `Section` with `ComponentBlock`; add controls to 8 components |
| `src/components/ui/CodeBlock/CodeBlock.tsx` | Add copy button with transient check state |

---

## Out of Scope

- Search across components
- Left-sidebar jump navigation within tabs
- Storybook integration changes
