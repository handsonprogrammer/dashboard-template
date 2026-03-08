# Components Showcase Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the flat `Section` component with a tabbed `ComponentBlock` that has Preview/Code tabs, a styled preview pane, and an inline controls strip for live prop editing on 8 key components.

**Architecture:** Single-file change in `components/page.tsx`. `ComponentBlock` is a file-local helper that manages tab state and optional `useReducer`-based control state. `CodeBlock` already has a copy button — no changes needed there.

**Tech Stack:** React, TypeScript, Tailwind CSS (CSS variable tokens), lucide-react

---

### Task 1: Define `ComponentBlock` — tabs + preview pane, no controls yet

**Files:**
- Modify: `src/app/(dashboard)/components/page.tsx:61-103` (replace `Section` helper)

**Step 1: Replace the `Section` type + implementation**

Find the existing `Section` function (lines ~63–103) and replace it entirely with `ComponentBlock`:

```tsx
/* ─── Types ─────────────────────────────────────────────────────── */

type Control =
    | { type: "select"; prop: string; label: string; options: string[] }
    | { type: "boolean"; prop: string; label: string };

type ControlState = Record<string, string | boolean>;

/* ─── Helper: component showcase block ──────────────────────────── */

function ComponentBlock({
    title,
    description,
    code,
    controls,
    className = "",
    children,
}: {
    title: string;
    description?: string;
    code?: string;
    controls?: Control[];
    className?: string;
    children: React.ReactNode | ((state: ControlState) => React.ReactNode);
}) {
    const [tab, setTab] = useState<"preview" | "code">("preview");

    // Build initial state from controls
    const initialState = (controls ?? []).reduce<ControlState>((acc, c) => {
        acc[c.prop] = c.type === "select" ? c.options[0] : false;
        return acc;
    }, {});
    const [state, dispatch] = useReducer(
        (prev: ControlState, patch: Partial<ControlState>) => ({ ...prev, ...patch }),
        initialState
    );

    const hasCode = Boolean(code);
    const resolvedChildren =
        typeof children === "function" ? children(state) : children;

    return (
        <div className={`space-y-0 rounded-xl border border-(--color-border) overflow-hidden ${className}`}>
            {/* Header: title + tab bar */}
            <div className="flex items-start justify-between gap-4 px-4 pt-4 pb-3">
                <div>
                    <h3 className="text-sm font-semibold text-(--color-foreground)">{title}</h3>
                    {description && (
                        <p className="text-xs text-(--color-muted-foreground) mt-0.5">{description}</p>
                    )}
                </div>
                {hasCode && (
                    <div className="flex shrink-0 gap-1 rounded-lg border border-(--color-border) bg-(--color-muted) p-0.5">
                        {(["preview", "code"] as const).map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setTab(t)}
                                className={[
                                    "rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors",
                                    tab === t
                                        ? "bg-(--color-surface) text-(--color-foreground) shadow-sm"
                                        : "text-(--color-muted-foreground) hover:text-(--color-foreground)",
                                ].join(" ")}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Preview pane */}
            {tab === "preview" && (
                <div className="border-t border-(--color-border) bg-(--color-muted)/40 px-6 py-8">
                    {resolvedChildren}
                </div>
            )}

            {/* Code pane */}
            {tab === "code" && code && (
                <div className="border-t border-(--color-border)">
                    <CodeBlock code={code} className="rounded-none border-0" />
                </div>
            )}

            {/* Controls strip */}
            {controls && controls.length > 0 && (
                <div className="border-t border-(--color-border) bg-(--color-surface) px-4 py-3 flex flex-wrap gap-4">
                    {controls.map((ctrl) => (
                        <div key={ctrl.prop} className="flex items-center gap-2">
                            <span className="text-xs text-(--color-muted-foreground) font-medium shrink-0">
                                {ctrl.label}
                            </span>
                            <div className="flex gap-1">
                                {ctrl.type === "select"
                                    ? ctrl.options.map((opt) => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => dispatch({ [ctrl.prop]: opt })}
                                            className={[
                                                "rounded-md px-2 py-0.5 text-xs font-medium transition-colors",
                                                state[ctrl.prop] === opt
                                                    ? "bg-(--color-primary) text-(--color-primary-foreground)"
                                                    : "bg-(--color-muted) text-(--color-muted-foreground) hover:text-(--color-foreground)",
                                            ].join(" ")}
                                        >
                                            {opt}
                                        </button>
                                    ))
                                    : (["off", "on"] as const).map((val) => (
                                        <button
                                            key={val}
                                            type="button"
                                            onClick={() => dispatch({ [ctrl.prop]: val === "on" })}
                                            className={[
                                                "rounded-md px-2 py-0.5 text-xs font-medium transition-colors",
                                                state[ctrl.prop] === (val === "on")
                                                    ? "bg-(--color-primary) text-(--color-primary-foreground)"
                                                    : "bg-(--color-muted) text-(--color-muted-foreground) hover:text-(--color-foreground)",
                                            ].join(" ")}
                                        >
                                            {val}
                                        </button>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
```

**Step 2: Add `useReducer` to imports**

The file already imports `useState`. Add `useReducer` to the same import:

```tsx
import { useState, useReducer } from "react";
```

**Step 3: Verify the build compiles**

Run: `npx tsc --noEmit`
Expected: No errors (the new component is defined but not yet used — old `Section` is still present for now).

**Step 4: Commit**

```bash
git add src/app/(dashboard)/components/page.tsx
git commit -m "feat: add ComponentBlock helper with Preview/Code tabs and controls strip"
```

---

### Task 2: Replace all `Section` calls with `ComponentBlock`

**Files:**
- Modify: `src/app/(dashboard)/components/page.tsx` (all `<Section` → `<ComponentBlock`)

**Step 1: Global rename**

Do a find-and-replace across the file:
- `<Section ` → `<ComponentBlock `
- `</Section>` → `</ComponentBlock>`

Also delete the old `Section` function definition (the one from lines ~63–103 that was replaced in Task 1).

**Step 2: Check the build**

Run: `npx tsc --noEmit`
Expected: No errors.

**Step 3: Visual check in browser**

Run: `npm run dev` and navigate to `/components`.
Expected: Each component demo is now inside a card with rounded border. Sections with `code` prop show a Preview/Code tab bar. Code tab shows the code block with copy button. Preview tab shows the live demo.

**Step 4: Commit**

```bash
git add src/app/(dashboard)/components/page.tsx
git commit -m "feat: replace Section with ComponentBlock across components showcase"
```

---

### Task 3: Wire controls to Button and Badge

**Files:**
- Modify: `src/app/(dashboard)/components/page.tsx` — `PrimitivesSection`, Button and Badge sections

**Step 1: Update Button section**

Replace the static Button `<ComponentBlock>` with a render-prop version:

```tsx
<ComponentBlock
    title="Button"
    description="All variants, sizes, and states."
    controls={[
        { type: "select", prop: "variant", label: "Variant", options: ["primary", "secondary", "ghost", "outline", "destructive"] },
        { type: "select", prop: "size",    label: "Size",    options: ["sm", "md", "lg"] },
        { type: "boolean", prop: "loading",  label: "Loading" },
        { type: "boolean", prop: "disabled", label: "Disabled" },
    ]}
    code={`<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="outline">Outline</Button>
<Button variant="destructive">Destructive</Button>

{/* Sizes */}
<Button variant="primary" size="sm">Small</Button>
<Button variant="primary" size="md">Medium</Button>
<Button variant="primary" size="lg">Large</Button>

{/* States */}
<Button variant="primary" loading>Loading</Button>
<Button variant="primary" disabled>Disabled</Button>`}
>
    {(s) => (
        <Button
            variant={s.variant as any}
            size={s.size as any}
            loading={s.loading as boolean}
            disabled={s.disabled as boolean}
        >
            Button
        </Button>
    )}
</ComponentBlock>
```

**Step 2: Update Badge section**

```tsx
<ComponentBlock
    title="Badge"
    description="Variants and dot indicator."
    controls={[
        { type: "select",  prop: "variant", label: "Variant", options: ["default", "primary", "secondary", "success", "warning", "destructive", "outline"] },
        { type: "boolean", prop: "dot",     label: "Dot" },
    ]}
    code={`<Badge variant="default">Default</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>

{/* Dot indicator */}
<Badge variant="success" dot>Active</Badge>
<Badge variant="warning" dot>Pending</Badge>
<Badge variant="destructive" dot>Offline</Badge>`}
>
    {(s) => (
        <Badge variant={s.variant as any} dot={s.dot as boolean}>
            {String(s.variant).charAt(0).toUpperCase() + String(s.variant).slice(1)}
        </Badge>
    )}
</ComponentBlock>
```

**Step 3: Build check**

Run: `npx tsc --noEmit`
Expected: No errors.

**Step 4: Commit**

```bash
git add src/app/(dashboard)/components/page.tsx
git commit -m "feat: add live controls to Button and Badge showcase blocks"
```

---

### Task 4: Wire controls to Alert and Spinner

**Files:**
- Modify: `src/app/(dashboard)/components/page.tsx` — `FeedbackSection`, Alert and Spinner sections

**Step 1: Update Alert section**

```tsx
<ComponentBlock
    title="Alert"
    description="Four severity levels."
    controls={[
        { type: "select", prop: "variant", label: "Variant", options: ["info", "success", "warning", "destructive"] },
    ]}
    code={`<Alert variant="info"        title="Info">Your changes have been saved.</Alert>
<Alert variant="success"     title="Success">Import completed without errors.</Alert>
<Alert variant="warning"     title="Warning">Subscription expires in 7 days.</Alert>
<Alert variant="destructive" title="Error">Failed to delete the selected records.</Alert>`}
>
    {(s) => (
        <Alert variant={s.variant as any} title={String(s.variant).charAt(0).toUpperCase() + String(s.variant).slice(1)} className="max-w-xl">
            {s.variant === "info"        && "Your changes have been saved successfully."}
            {s.variant === "success"     && "The import completed without errors."}
            {s.variant === "warning"     && "Your subscription expires in 7 days."}
            {s.variant === "destructive" && "Failed to delete the selected records."}
        </Alert>
    )}
</ComponentBlock>
```

**Step 2: Update Spinner section**

```tsx
<ComponentBlock
    title="Spinner"
    description="Loading indicator in three sizes."
    controls={[
        { type: "select", prop: "size", label: "Size", options: ["sm", "md", "lg"] },
    ]}
    code={`<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />`}
>
    {(s) => <Spinner size={s.size as any} />}
</ComponentBlock>
```

**Step 3: Build check + commit**

```bash
npx tsc --noEmit
git add src/app/(dashboard)/components/page.tsx
git commit -m "feat: add live controls to Alert and Spinner showcase blocks"
```

---

### Task 5: Wire controls to Progress and Input

**Files:**
- Modify: `src/app/(dashboard)/components/page.tsx` — `PrimitivesSection` Progress, `FormsSection` Input

**Step 1: Update Progress section**

```tsx
<ComponentBlock
    title="Progress"
    description="Linear bars and ring progress."
    controls={[
        { type: "select", prop: "variant", label: "Variant", options: ["default", "success", "warning", "destructive"] },
        { type: "select", prop: "value",   label: "Value",   options: ["25", "50", "75", "100"] },
    ]}
    code={`{/* Linear */}
<Progress value={30} showLabel label="Storage" />
<Progress value={65} variant="success"     showLabel label="Completion" />
<Progress value={82} variant="warning"     showLabel label="CPU Usage" />
<Progress value={95} variant="destructive" showLabel label="Memory" />

{/* Ring */}
<RingProgress value={35} showLabel size={80} />
<RingProgress value={72} variant="success"     showLabel size={80} />
<RingProgress value={91} variant="destructive" showLabel size={80} />`}
>
    {(s) => {
        const val = Number(s.value);
        return (
            <div className="space-y-4 w-full max-w-md">
                <Progress value={val} variant={s.variant as any} showLabel label="Progress" />
                <div className="flex gap-6">
                    <RingProgress value={val} variant={s.variant as any} showLabel size={80} />
                </div>
            </div>
        );
    }}
</ComponentBlock>
```

**Step 2: Update Input section**

The Input section currently shows four states in a grid. Replace with a controlled single preview:

```tsx
<ComponentBlock
    title="Input"
    description="Text field with label, helper, and error state."
    controls={[
        { type: "select", prop: "state", label: "State", options: ["default", "error", "disabled"] },
    ]}
    code={`<Input label="Username" placeholder="Enter username" />
<Input label="Email" type="email" error="Invalid email address" placeholder="you@example.com" />
<Input label="Disabled" placeholder="Cannot edit" disabled />`}
>
    {(s) => (
        <div className="max-w-sm w-full">
            {s.state === "default"  && <Input label="Username" placeholder="Enter username" />}
            {s.state === "error"    && <Input label="Email" type="email" error="Invalid email address" placeholder="you@example.com" />}
            {s.state === "disabled" && <Input label="Disabled" placeholder="Cannot edit" disabled />}
        </div>
    )}
</ComponentBlock>
```

**Step 3: Build check + commit**

```bash
npx tsc --noEmit
git add src/app/(dashboard)/components/page.tsx
git commit -m "feat: add live controls to Progress and Input showcase blocks"
```

---

### Task 6: Wire controls to Toggle and Avatar

**Files:**
- Modify: `src/app/(dashboard)/components/page.tsx` — `FormsSection` Toggle, `PrimitivesSection` Avatar

**Step 1: Update Toggle section**

```tsx
<ComponentBlock
    title="Toggle"
    description="Switch in three sizes."
    controls={[
        { type: "select",  prop: "size",    label: "Size",    options: ["sm", "md", "lg"] },
        { type: "boolean", prop: "checked", label: "Checked" },
    ]}
    code={`<Toggle
  checked={enabled}
  onChange={setEnabled}
  label="Enable notifications"
  description="Receive alerts for important events"
  size="md"
/>

{/* Size variants */}
<Toggle size="sm" label="Small" />
<Toggle size="md" label="Medium" checked />
<Toggle size="lg" label="Large"  checked />`}
>
    {(s) => (
        <Toggle
            size={s.size as any}
            checked={s.checked as boolean}
            label="Enable notifications"
            description="Receive alerts for important events"
        />
    )}
</ComponentBlock>
```

**Step 2: Update Avatar section**

```tsx
<ComponentBlock
    title="Avatar & AvatarGroup"
    description="Sizes and group stacking."
    controls={[
        { type: "select", prop: "size", label: "Size", options: ["xs", "sm", "md", "lg", "xl"] },
    ]}
    code={`<Avatar name="Alice Johnson" size="xs" />
<Avatar name="Bob Martinez" size="sm" />
<Avatar name="Carol White"  size="md" />
<Avatar name="David Kim"    size="lg" />
<Avatar name="Eva Thompson" size="xl" />

<AvatarGroup
  avatars={[
    { name: "Alice Johnson" },
    { name: "Bob Martinez" },
    { name: "Carol White" },
  ]}
  max={3}
/>`}
>
    {(s) => (
        <div className="space-y-4">
            <Avatar name="Alice Johnson" size={s.size as any} />
            <AvatarGroup
                avatars={[
                    { name: "Alice Johnson" },
                    { name: "Bob Martinez" },
                    { name: "Carol White" },
                    { name: "David Kim" },
                ]}
                max={3}
            />
        </div>
    )}
</ComponentBlock>
```

**Step 3: Build check + commit**

```bash
npx tsc --noEmit
git add src/app/(dashboard)/components/page.tsx
git commit -m "feat: add live controls to Toggle and Avatar showcase blocks"
```

---

### Task 7: Final polish + spacing pass

**Files:**
- Modify: `src/app/(dashboard)/components/page.tsx`

**Step 1: Add spacing between `ComponentBlock` sections**

The tab sections currently use `space-y-10` between sections. Since each `ComponentBlock` is now a card, tighten this to `space-y-6`:

Find all `<div className="space-y-10">` inside section functions and replace with `<div className="space-y-6">`.

**Step 2: Remove the `Section` import/function if lingering**

Ensure the old `Section` function definition is fully removed (no orphaned code).

**Step 3: Final build + type check**

```bash
npx tsc --noEmit
npm run build
```
Expected: Clean build, no type errors.

**Step 4: Visual review in browser**

Navigate to `/components` and verify:
- [ ] Every section is a card with rounded border
- [ ] Sections with code have Preview/Code tab bar
- [ ] Code tab shows code block with working copy button
- [ ] 8 components (Button, Badge, Alert, Spinner, Progress, Input, Toggle, Avatar) have controls strip
- [ ] Controls update the live preview in real time
- [ ] Dark mode looks correct

**Step 5: Final commit**

```bash
git add src/app/(dashboard)/components/page.tsx
git commit -m "feat: complete components showcase redesign with tabbed blocks and live controls"
```
