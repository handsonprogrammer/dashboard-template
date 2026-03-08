"use client";

import { useState, useReducer, useMemo } from "react";
import { Trash2, Edit, Copy } from "lucide-react";
import {
    // Navigation
    Tabs,
    CodeBlock,
    Accordion,
    Breadcrumbs,
    Dropdown,
    // Primitives
    Button,
    Badge,
    Avatar,
    AvatarGroup,
    Spinner,
    Progress,
    RingProgress,
    // Feedback
    Alert,
    Skeleton,
    SkeletonCard,
    SkeletonTableRow,
    SkeletonChart,
    SkeletonAvatar,
    EmptyState,
    // Overlay
    Modal,
    ConfirmDialog,
    Drawer,
    Tooltip,
    // Form
    Input,
    Textarea,
    Select,
    Checkbox,
    RadioGroup,
    Toggle,
    DatePicker,
    DateRangePicker,
    // Layout cards
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    StatCard,
    TextCard,
    ImageCard,
    // Complex
    Stepper,
    Timeline,
    type DateRange,
    type TabItem,
    type TimelineEvent,
} from "@/components/ui";
import { LineChart, BarChart, AreaChart, PieChart, DonutChart } from "@/components/charts";
import { revenueData, signupData, trafficSourceData, orderStatusData } from "@/data/analytics";
import { TrendingUp } from "lucide-react";

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
    children: React.ReactNode | ((state: ControlState, set: (patch: Record<string, string | boolean>) => void) => React.ReactNode);
}) {
    const [tab, setTab] = useState<"preview" | "code">("preview");

    const initialState = useMemo(
        () =>
            (controls ?? []).reduce<ControlState>((acc, c) => {
                acc[c.prop] = c.type === "select" ? c.options[0] : false;
                return acc;
            }, {}),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );
    const [state, dispatch] = useReducer(
        (prev: ControlState, patch: Record<string, string | boolean>): ControlState =>
            ({ ...prev, ...patch }),
        initialState
    );

    const hasCode = Boolean(code);
    const resolvedChildren =
        typeof children === "function" ? children(state, dispatch) : children;

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
                                aria-pressed={tab === t}
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

function PrimitivesSection() {
    return (
        <div className="space-y-6">
            {/* Button */}
            <ComponentBlock
                title="Button"
                description="All variants, sizes, and states."
                controls={[
                    { type: "select",  prop: "variant",  label: "Variant",  options: ["primary", "secondary", "ghost", "outline", "destructive"] },
                    { type: "select",  prop: "size",     label: "Size",     options: ["sm", "md", "lg"] },
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
                        variant={s.variant as "primary" | "secondary" | "ghost" | "outline" | "destructive"}
                        size={s.size as "sm" | "md" | "lg"}
                        loading={s.loading as boolean}
                        disabled={s.disabled as boolean}
                    >
                        Button
                    </Button>
                )}
            </ComponentBlock>

            {/* Badge */}
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
                {(s) => {
                    const v = String(s.variant);
                    return (
                        <Badge
                            variant={s.variant as "default" | "primary" | "secondary" | "success" | "warning" | "destructive" | "outline"}
                            dot={s.dot as boolean}
                        >
                            {v.charAt(0).toUpperCase() + v.slice(1)}
                        </Badge>
                    );
                }}
            </ComponentBlock>

            {/* Avatar */}
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
                        <Avatar name="Alice Johnson" size={s.size as "xs" | "sm" | "md" | "lg" | "xl"} />
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

            {/* Spinner */}
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
                {(s) => <Spinner size={s.size as "sm" | "md" | "lg"} />}
            </ComponentBlock>

            {/* Progress */}
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
                    const variant = s.variant as "default" | "success" | "warning" | "destructive";
                    return (
                        <div className="space-y-4 w-full max-w-md">
                            <Progress value={val} variant={variant} showLabel label="Progress" />
                            <div className="flex gap-6">
                                <RingProgress value={val} variant={variant} showLabel size={80} />
                            </div>
                        </div>
                    );
                }}
            </ComponentBlock>
        </div>
    );
}

const ALERT_TITLE: Record<string, string> = {
    info: "Info",
    success: "Success",
    warning: "Warning",
    destructive: "Error",
};
const ALERT_MESSAGE: Record<string, string> = {
    info: "Your changes have been saved successfully.",
    success: "The import completed without errors.",
    warning: "Your subscription expires in 7 days.",
    destructive: "Failed to delete the selected records.",
};

function FeedbackSection() {
    return (
        <div className="space-y-6">
            {/* Alert */}
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
                {(s) => {
                    const variant = s.variant as "info" | "success" | "warning" | "destructive";
                    return (
                        <Alert variant={variant} title={ALERT_TITLE[variant]} className="max-w-xl">
                            {ALERT_MESSAGE[variant]}
                        </Alert>
                    );
                }}
            </ComponentBlock>

            {/* Skeleton */}
            <ComponentBlock
                title="Skeleton"
                description="Loading placeholders."
                code={`<SkeletonCard />
<SkeletonChart />
<SkeletonAvatar />

{/* Inside a table */}
<table>
  <tbody>
    <SkeletonTableRow />
    <SkeletonTableRow />
  </tbody>
</table>

{/* Generic */}
<Skeleton className="h-4 w-48 rounded" />`}
            >
                <div className="grid gap-4 max-w-xl">
                    <div className="space-y-2">
                        <p className="text-xs text-(--color-muted-foreground) font-medium">Card skeleton</p>
                        <SkeletonCard />
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs text-(--color-muted-foreground) font-medium">Table row</p>
                        <table className="w-full">
                            <tbody>
                                <SkeletonTableRow />
                                <SkeletonTableRow />
                            </tbody>
                        </table>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs text-(--color-muted-foreground) font-medium">Chart</p>
                        <SkeletonChart />
                    </div>
                    <div className="flex gap-3">
                        <SkeletonAvatar />
                        <SkeletonAvatar className="h-12 w-12" />
                    </div>
                    <Skeleton className="h-4 w-48 rounded" />
                </div>
            </ComponentBlock>

            {/* EmptyState */}
            <ComponentBlock
                title="EmptyState"
                description="Zero-result placeholder."
                code={`<EmptyState
  title="No results found"
  description="Try adjusting your search or filter to find what you're looking for."
  action={<Button variant="primary" size="sm">Clear filters</Button>}
/>`}
            >
                <div className="max-w-sm border border-(--color-border) rounded-xl">
                    <EmptyState
                        title="No results found"
                        description="Try adjusting your search or filter to find what you're looking for."
                        action={<Button variant="primary" size="sm">Clear filters</Button>}
                    />
                </div>
            </ComponentBlock>
        </div>
    );
}

function OverlaysSection() {
    const [modalOpen, setModalOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <div className="space-y-6">
            {/* Modal */}
            <ComponentBlock
                title="Modal"
                description="Dialog with title, body and footer."
                code={`const [open, setOpen] = useState(false);

<Button variant="primary" onClick={() => setOpen(true)}>Open Modal</Button>

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Edit Profile"
  description="Update your display name and email address."
  footer={
    <div className="flex justify-end gap-2">
      <Button variant="ghost"   onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="primary" onClick={() => setOpen(false)}>Save Changes</Button>
    </div>
  }
>
  <div className="space-y-4 mt-2">
    <Input label="Display Name" placeholder="Your name" />
    <Input label="Email" type="email" placeholder="you@example.com" />
  </div>
</Modal>`}
            >
                <Button variant="primary" onClick={() => setModalOpen(true)}>Open Modal</Button>
                <Modal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title="Edit Profile"
                    description="Update your display name and email address."
                    footer={
                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
                            <Button variant="primary" onClick={() => setModalOpen(false)}>Save Changes</Button>
                        </div>
                    }
                >
                    <div className="space-y-4 mt-2">
                        <Input label="Display Name" placeholder="Your name" />
                        <Input label="Email" type="email" placeholder="you@example.com" />
                    </div>
                </Modal>
            </ComponentBlock>

            {/* ConfirmDialog */}
            <ComponentBlock
                title="ConfirmDialog"
                description="Destructive action confirmation."
                code={`const [open, setOpen] = useState(false);

<Button variant="destructive" onClick={() => setOpen(true)}>Delete Record</Button>

<ConfirmDialog
  open={open}
  onClose={() => setOpen(false)}
  onConfirm={handleDelete}
  title="Delete Record"
  description="This action cannot be undone. The record will be permanently removed."
  confirmLabel="Delete"
  variant="destructive"
/>`}
            >
                <Button variant="destructive" onClick={() => setConfirmOpen(true)}>Delete Record</Button>
                <ConfirmDialog
                    open={confirmOpen}
                    onClose={() => setConfirmOpen(false)}
                    onConfirm={() => setConfirmOpen(false)}
                    title="Delete Record"
                    description="This action cannot be undone. The record will be permanently removed."
                    confirmLabel="Delete"
                    variant="destructive"
                />
            </ComponentBlock>

            {/* Drawer */}
            <ComponentBlock
                title="Drawer"
                description="Side panel (right, left, top, bottom)."
                code={`const [open, setOpen] = useState(false);

<Button variant="outline" onClick={() => setOpen(true)}>Open Drawer</Button>

<Drawer
  open={open}
  onClose={() => setOpen(false)}
  title="Notifications"
  side="right"
>
  <p>You have 3 unread notifications.</p>
</Drawer>`}
            >
                <Button variant="outline" onClick={() => setDrawerOpen(true)}>Open Drawer</Button>
                <Drawer
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    title="Notifications"
                    side="right"
                >
                    <div className="space-y-4 text-sm text-(--color-muted-foreground)">
                        <p>You have 3 unread notifications.</p>
                        <p>• New comment on your post</p>
                        <p>• Order #1023 shipped</p>
                        <p>• Weekly digest is ready</p>
                    </div>
                </Drawer>
            </ComponentBlock>

            {/* Tooltip */}
            <ComponentBlock
                title="Tooltip"
                description="Four placement options."
                code={`<Tooltip content="Top tooltip"    placement="top">
  <Button variant="outline" size="sm">Top</Button>
</Tooltip>

<Tooltip content="Right tooltip"  placement="right">
  <Button variant="outline" size="sm">Right</Button>
</Tooltip>

<Tooltip content="Bottom tooltip" placement="bottom">
  <Button variant="outline" size="sm">Bottom</Button>
</Tooltip>

<Tooltip content="Left tooltip"   placement="left">
  <Button variant="outline" size="sm">Left</Button>
</Tooltip>`}
            >
                <div className="flex flex-wrap gap-6 py-4">
                    <Tooltip content="Top tooltip" placement="top">
                        <Button variant="outline" size="sm">Top</Button>
                    </Tooltip>
                    <Tooltip content="Right tooltip" placement="right">
                        <Button variant="outline" size="sm">Right</Button>
                    </Tooltip>
                    <Tooltip content="Bottom tooltip" placement="bottom">
                        <Button variant="outline" size="sm">Bottom</Button>
                    </Tooltip>
                    <Tooltip content="Left tooltip" placement="left">
                        <Button variant="outline" size="sm">Left</Button>
                    </Tooltip>
                </div>
            </ComponentBlock>

            {/* Dropdown */}
            <ComponentBlock
                title="Dropdown"
                description="Trigger-based menu."
                code={`<Dropdown
  trigger={<Button variant="outline">Actions \u25be</Button>}
  items={[
    { key: "edit",   label: "Edit",      icon: Edit,   onClick: () => {} },
    { key: "copy",   label: "Duplicate", icon: Copy,   onClick: () => {} },
    { key: "sep",    label: "",          separator: true },
    { key: "delete", label: "Delete",    icon: Trash2, danger: true, onClick: () => {} },
  ]}
/>`}
            >
                <Dropdown
                    trigger={<Button variant="outline">Actions ▾</Button>}
                    items={[
                        { key: "edit", label: "Edit", icon: Edit, onClick: () => { } },
                        { key: "copy", label: "Duplicate", icon: Copy, onClick: () => { } },
                        { key: "sep", label: "", separator: true },
                        { key: "delete", label: "Delete", icon: Trash2, danger: true, onClick: () => { } },
                    ]}
                />
            </ComponentBlock>
        </div>
    );
}

function NavigationSection() {
    return (
        <div className="space-y-6">
            {/* Breadcrumbs */}
            <ComponentBlock
                title="Breadcrumbs"
                description="Path navigation with href links."
                code={`<Breadcrumbs
  items={[
    { label: "Dashboard", href: "/admin" },
    { label: "Users",     href: "/users" },
    { label: "Alice Johnson" },
  ]}
/>`}
            >
                <Breadcrumbs
                    items={[
                        { label: "Dashboard", href: "/admin" },
                        { label: "Users", href: "/users" },
                        { label: "Alice Johnson" },
                    ]}
                />
            </ComponentBlock>

            {/* Tabs */}
            <ComponentBlock
                title="Tabs"
                description="Underline variant and pills variant."
                code={`{/* Underline */}
<Tabs
  tabs={[
    { key: "a", label: "Overview", content: <p>Overview content.</p> },
    { key: "b", label: "Details",  content: <p>Details content.</p> },
    { key: "c", label: "History",  content: <p>History content.</p> },
  ]}
  variant="underline"
/>

{/* Pills */}
<Tabs
  tabs={[
    { key: "x", label: "Month",   content: <p>Monthly data.</p> },
    { key: "y", label: "Quarter", content: <p>Quarterly data.</p> },
    { key: "z", label: "Year",    content: <p>Yearly data.</p> },
  ]}
  variant="pills"
/>`}
            >
                <div className="space-y-6 max-w-lg">
                    <Tabs
                        tabs={[
                            { key: "a", label: "Overview", content: <p className="text-sm text-(--color-muted-foreground) pt-3">Overview content goes here.</p> },
                            { key: "b", label: "Details", content: <p className="text-sm text-(--color-muted-foreground) pt-3">Details content goes here.</p> },
                            { key: "c", label: "History", content: <p className="text-sm text-(--color-muted-foreground) pt-3">History content goes here.</p> },
                        ]}
                        variant="underline"
                    />
                    <Tabs
                        tabs={[
                            { key: "x", label: "Month", content: <p className="text-sm text-(--color-muted-foreground) pt-3">Monthly data.</p> },
                            { key: "y", label: "Quarter", content: <p className="text-sm text-(--color-muted-foreground) pt-3">Quarterly data.</p> },
                            { key: "z", label: "Year", content: <p className="text-sm text-(--color-muted-foreground) pt-3">Yearly data.</p> },
                        ]}
                        variant="pills"
                    />
                </div>
            </ComponentBlock>

            {/* Accordion */}
            <ComponentBlock
                title="Accordion"
                description="Collapsible disclosure panels."
                code={`<Accordion
  items={[
    {
      key: "q1",
      trigger: "What is included in the free plan?",
      content: <p>Up to 5 users, 1 GB storage, and all core features.</p>,
      defaultOpen: true,
    },
    {
      key: "q2",
      trigger: "How do I upgrade my subscription?",
      content: <p>Go to Settings \u2192 Billing and choose a plan.</p>,
    },
    {
      key: "q3",
      trigger: "Can I cancel at any time?",
      content: <p>Yes, with no penalties.</p>,
    },
  ]}
/>`}
            >
                <div className="max-w-lg border border-(--color-border) rounded-xl px-4">
                    <Accordion
                        items={[
                            {
                                key: "q1",
                                trigger: "What is included in the free plan?",
                                content: <p className="text-sm text-(--color-muted-foreground) pb-4">The free plan includes up to 5 users, 1 GB storage, and access to all core features.</p>,
                                defaultOpen: true,
                            },
                            {
                                key: "q2",
                                trigger: "How do I upgrade my subscription?",
                                content: <p className="text-sm text-(--color-muted-foreground) pb-4">Go to Settings → Billing and choose a plan that fits your needs.</p>,
                            },
                            {
                                key: "q3",
                                trigger: "Can I cancel at any time?",
                                content: <p className="text-sm text-(--color-muted-foreground) pb-4">Yes. You can cancel your subscription at any time from the billing portal with no penalties.</p>,
                            },
                        ]}
                    />
                </div>
            </ComponentBlock>
        </div>
    );
}

function FormsSection() {
    const [area, setArea] = useState("");
    const [selectVal, setSelectVal] = useState("editor");
    const [checked, setChecked] = useState(false);
    const [radio, setRadio] = useState("monthly");
    const [date, setDate] = useState<Date | undefined>();
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    return (
        <div className="space-y-6 max-w-lg">
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

            <ComponentBlock
                title="Textarea"
                description="Multi-line text input."
                code={`<Textarea
  label="Message"
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  placeholder="Write your message here\u2026"
  rows={4}
  helperText={\`\${message.length} / 500 characters\`}
/>`}
            >
                <Textarea
                    label="Message"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="Write your message here…"
                    rows={4}
                    helperText={`${area.length} / 500 characters`}
                />
            </ComponentBlock>

            <ComponentBlock
                title="Select"
                description="Native select element."
                code={`<Select
  label="Role"
  value={role}
  onChange={(e) => setRole(e.target.value)}
  options={[
    { value: "admin",  label: "Admin" },
    { value: "editor", label: "Editor" },
    { value: "viewer", label: "Viewer" },
  ]}
/>`}
            >
                <Select
                    label="Role"
                    value={selectVal}
                    onChange={(e) => setSelectVal(e.target.value)}
                    options={[
                        { value: "admin", label: "Admin" },
                        { value: "editor", label: "Editor" },
                        { value: "viewer", label: "Viewer" },
                    ]}
                />
            </ComponentBlock>

            <ComponentBlock
                title="Checkbox"
                description="Standard and indeterminate states."
                code={`<Checkbox
  label="Accept terms and conditions"
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
/>

<Checkbox
  label="Indeterminate state"
  indeterminate
  description="Used for partial selections"
/>

<Checkbox label="Disabled checkbox" disabled />`}
            >
                <div className="space-y-2">
                    <Checkbox
                        label="Accept terms and conditions"
                        checked={checked}
                        onChange={(e) => setChecked(e.target.checked)}
                    />
                    <Checkbox
                        label="Indeterminate state"
                        indeterminate
                        description="Used for partial selections"
                    />
                    <Checkbox label="Disabled checkbox" disabled />
                </div>
            </ComponentBlock>

            <ComponentBlock
                title="RadioGroup"
                description="Single-choice selection."
                code={`<RadioGroup
  name="billing"
  label="Billing cycle"
  value={billing}
  onChange={setBilling}
  options={[
    { value: "monthly",    label: "Monthly",    description: "Billed every month" },
    { value: "annual",     label: "Annual",     description: "Save 20% with annual billing" },
    { value: "enterprise", label: "Enterprise", description: "Custom pricing", disabled: true },
  ]}
/>`}
            >
                <RadioGroup
                    name="billing"
                    label="Billing cycle"
                    value={radio}
                    onChange={setRadio}
                    options={[
                        { value: "monthly", label: "Monthly", description: "Billed every month" },
                        { value: "annual", label: "Annual", description: "Save 20% with annual billing" },
                        { value: "enterprise", label: "Enterprise", description: "Custom pricing", disabled: true },
                    ]}
                />
            </ComponentBlock>

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
                {(s, set) => (
                    <Toggle
                        size={s.size as "sm" | "md" | "lg"}
                        checked={s.checked as boolean}
                        onChange={(val) => set({ checked: val })}
                        label="Enable notifications"
                        description="Receive alerts for important events"
                    />
                )}
            </ComponentBlock>

            <ComponentBlock
                title="DatePicker"
                description="Single date selection with a calendar popover."
                code={`const [date, setDate] = useState<Date | undefined>();

<DatePicker
  label="Appointment date"
  value={date}
  onChange={setDate}
/>`}
            >
                <DatePicker label="Appointment date" value={date} onChange={setDate} />
            </ComponentBlock>

            <ComponentBlock
                title="DateRangePicker"
                description="Select a date range with a calendar popover."
                code={`const [dateRange, setDateRange] = useState<DateRange | undefined>();

<DateRangePicker value={dateRange} onChange={setDateRange} />`}
            >
                <DateRangePicker value={dateRange} onChange={setDateRange} />
            </ComponentBlock>
        </div>
    );
}

function LayoutSection() {
    const stepperSteps = [
        { id: "s1", label: "Information", status: "complete" as const },
        { id: "s2", label: "Payment", status: "current" as const },
        { id: "s3", label: "Review", status: "upcoming" as const },
        { id: "s4", label: "Confirm", status: "upcoming" as const },
    ];

    const timelineEvents: TimelineEvent[] = [
        { id: "e1", title: "Account created", description: "Welcome to the platform", date: "Jan 15" },
        { id: "e2", title: "Profile completed", description: "Added avatar and bio", date: "Jan 16" },
        { id: "e3", title: "First order placed", description: "Order #1001 for $49.99", date: "Feb 3" },
        { id: "e4", title: "Verified email", description: "Email address confirmed", date: "Feb 4" },
    ];

    return (
        <div className="space-y-6">
            {/* Cards */}
            <ComponentBlock
                title="Card"
                description="Container with optional header, body, and footer."
                code={`<Card>
  <CardHeader
    title="Simple Card"
    description="A basic card container."
    action={<Badge variant="primary">New</Badge>}
  />
  <CardBody>
    <p>Card body content goes here.</p>
  </CardBody>
  <CardFooter className="flex justify-end gap-2 mt-4 pt-4 border-t border-(--color-border)">
    <Button variant="ghost"   size="sm">Cancel</Button>
    <Button variant="primary" size="sm">Confirm</Button>
  </CardFooter>
</Card>

{/* Stat card */}
<StatCard
  title="Monthly Revenue"
  value={84000}
  unit="USD"
  change={12.4}
  icon={TrendingUp}
/>`}
            >
                <div className="grid gap-4 sm:grid-cols-2 max-w-2xl">
                    <Card>
                        <CardHeader
                            title="Simple Card"
                            description="A basic card container."
                            action={<Badge variant="primary">New</Badge>}
                        />
                        <CardBody>
                            <p className="text-sm text-(--color-muted-foreground)">Card body content goes here. Add any child elements.</p>
                        </CardBody>
                        <CardFooter className="flex justify-end gap-2 mt-4 pt-4 border-t border-(--color-border)">
                            <Button variant="ghost" size="sm">Cancel</Button>
                            <Button variant="primary" size="sm">Confirm</Button>
                        </CardFooter>
                    </Card>

                    <StatCard
                        title="Monthly Revenue"
                        value={84000}
                        unit="USD"
                        change={12.4}
                        icon={TrendingUp}
                    />
                </div>
            </ComponentBlock>

            {/* TextCard + ImageCard */}
            <ComponentBlock
                title="TextCard & ImageCard"
                description="Content display cards."
                code={`<TextCard
  title="Getting started with the template"
  body="A fully featured dashboard template with dark mode."
  tag="Guide"
  date="Mar 7, 2026"
  href="#"
/>

<ImageCard
  src="https://example.com/photo.jpg"
  alt="Analytics dashboard"
  title="Analytics Overview"
  description="Monitor key metrics at a glance."
  aspectRatio="video"
/>`}
            >
                <div className="grid gap-4 sm:grid-cols-2 max-w-2xl">
                    <TextCard
                        title="Getting started with the template"
                        body="A fully featured dashboard template with dark mode, accessible primitives, and a responsive layout system built on Next.js 15."
                        tag="Guide"
                        date="Mar 7, 2026"
                        href="#"
                    />
                    <ImageCard
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80"
                        alt="Analytics dashboard"
                        title="Analytics Overview"
                        description="Monitor key metrics at a glance."
                        aspectRatio="video"
                    />
                </div>
            </ComponentBlock>

            {/* Stepper */}
            <ComponentBlock
                title="Stepper"
                description="Horizontal and vertical orientations."
                code={`<Stepper
  steps={[
    { id: "s1", label: "Information", status: "complete" },
    { id: "s2", label: "Payment",     status: "current" },
    { id: "s3", label: "Review",      status: "upcoming" },
    { id: "s4", label: "Confirm",     status: "upcoming" },
  ]}
  orientation="horizontal"
/>

{/* Vertical */}
<Stepper steps={steps} orientation="vertical" />`}
            >
                <div className="max-w-2xl space-y-8">
                    <Stepper steps={stepperSteps} orientation="horizontal" />
                    <Stepper steps={stepperSteps} orientation="vertical" />
                </div>
            </ComponentBlock>

            {/* Timeline */}
            <ComponentBlock
                title="Timeline"
                description="Chronological event list."
                code={`<Timeline
  events={[
    { id: "e1", title: "Account created",    description: "Welcome!",                  date: "Jan 15" },
    { id: "e2", title: "Profile completed",  description: "Added avatar and bio",      date: "Jan 16" },
    { id: "e3", title: "First order placed", description: "Order #1001 for \$49.99", date: "Feb 3" },
    { id: "e4", title: "Verified email",     description: "Email confirmed",           date: "Feb 4" },
  ]}
/>`}
            >
                <div className="max-w-sm">
                    <Timeline events={timelineEvents} />
                </div>
            </ComponentBlock>
        </div>
    );
}

/* ─── Theming section ──────────────────────────────────────────── */

const TOKEN_ROWS: { token: string; purpose: string }[] = [
    { token: "--color-primary", purpose: "Brand color — buttons, links, focus rings" },
    { token: "--color-primary-foreground", purpose: "Text on primary-colored backgrounds" },
    { token: "--color-ring", purpose: "Focus ring (keep in sync with primary)" },
    { token: "--color-destructive", purpose: "Danger actions, error states" },
    { token: "--color-background", purpose: "Page background" },
    { token: "--color-foreground", purpose: "Primary body text" },
    { token: "--color-surface", purpose: "Card / panel surface" },
    { token: "--color-sidebar-bg", purpose: "Sidebar background" },
    { token: "--color-muted", purpose: "Subdued backgrounds (skeleton, tags)" },
    { token: "--color-muted-foreground", purpose: "Placeholder / secondary text" },
    { token: "--color-border", purpose: "All borders and dividers" },
    { token: "--color-popover", purpose: "Dropdown / tooltip surface" },
    { token: "--color-card", purpose: "Recharts tooltip background" },
];

function ThemingSection() {
    return (
        <div className="space-y-6 max-w-3xl">

            {/* Overview */}
            <ComponentBlock title="How the token system works" description="All visual styles are driven by CSS custom properties defined in src/app/globals.css. Tailwind classes reference them via var(--…), so changing a token instantly updates every component.">
                <CodeBlock
                    language="css"
                    code={`/* src/app/globals.css */
:root {
  --color-primary:            oklch(0.55 0.22 250); /* indigo (default) */
  --color-primary-foreground: oklch(0.99 0 0);
  --color-ring:               oklch(0.55 0.22 250);
  /* … more tokens … */
}

.dark {
  --color-background: oklch(0.12 0.01 270);
  --color-foreground: oklch(0.97 0 0);
  /* … dark overrides … */
}`}
                />
            </ComponentBlock>

            {/* Change brand color */}
            <ComponentBlock
                title="Change the brand color"
                description="Only 3 variables need to change. Every button, link, focus ring, badge, and chart accent updates automatically."
                code={`/* Swap indigo → green */
:root {
  --color-primary:            oklch(0.55 0.22 160);
  --color-primary-foreground: oklch(0.99 0 0);
  --color-ring:               oklch(0.55 0.22 160);
}

/* Swap indigo → rose */
:root {
  --color-primary:            oklch(0.60 0.22 10);
  --color-primary-foreground: oklch(0.99 0 0);
  --color-ring:               oklch(0.60 0.22 10);
}

/* Swap indigo → amber */
:root {
  --color-primary:            oklch(0.72 0.18 80);
  --color-primary-foreground: oklch(0.15 0 0);  /* dark text on light bg */
  --color-ring:               oklch(0.72 0.18 80);
}`}
            >
                <div className="flex flex-wrap gap-3">
                    {[
                        { label: "Indigo (default)", hue: 250 },
                        { label: "Green", hue: 160 },
                        { label: "Rose", hue: 10 },
                        { label: "Amber", hue: 80 },
                        { label: "Sky", hue: 210 },
                        { label: "Violet", hue: 290 },
                    ].map(({ label, hue }) => (
                        <div key={label} className="flex items-center gap-2 rounded-lg border border-(--color-border) px-3 py-2 text-sm">
                            <span
                                className="h-4 w-4 rounded-full shrink-0"
                                style={{ background: `oklch(0.58 0.21 ${hue})` }}
                            />
                            {label}
                        </div>
                    ))}
                </div>
            </ComponentBlock>

            {/* Font */}
            <ComponentBlock
                title="Change the typeface"
                description="Override the two font variables plus next/font imports in layout.tsx."
                code={`/* globals.css */
:root {
  --font-sans: "Geist",  ui-sans-serif,  system-ui, sans-serif;
  --font-mono: "Geist Mono", ui-monospace, monospace;
}

/* layout.tsx — import your chosen font from next/font/google */
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

// then apply: <html className={inter.variable}>`}
            >
                <p className="text-sm text-(--color-muted-foreground)">
                    The template ships with <code className="font-mono bg-(--color-muted) px-1 py-0.5 rounded text-xs">--font-sans</code> and{" "}
                    <code className="font-mono bg-(--color-muted) px-1 py-0.5 rounded text-xs">--font-mono</code>.
                    Swap them in one place and all components inherit the change.
                </p>
            </ComponentBlock>

            {/* Dark mode */}
            <ComponentBlock
                title="Dark mode"
                description="next-themes handles persistence and flash prevention. Tailwind picks it up through the @custom-variant dark directive."
                code={`/* globals.css — every dark token is in the .dark block */
.dark {
  --color-background:       oklch(0.12 0.01 270);
  --color-foreground:       oklch(0.97 0 0);
  --color-surface:          oklch(0.17 0.01 270);
  --color-sidebar-bg:       oklch(0.14 0.01 270);
  --color-border:           oklch(0.28 0.01 270);
  --color-muted:            oklch(0.22 0.01 270);
  --color-muted-foreground: oklch(0.60 0.01 270);
  /* primary stays the same — or override it here for dark-only changes */
}

/* tailwind.config — already configured */
@custom-variant dark (&:is(.dark *));`}
            >
                <p className="text-sm text-(--color-muted-foreground)">
                    Use the sun / moon icon in the header to toggle. The chosen preference is persisted to{" "}
                    <code className="font-mono bg-(--color-muted) px-1 py-0.5 rounded text-xs">localStorage</code>{" "}
                    and respected on the next load with zero flash.
                </p>
            </ComponentBlock>

            {/* Radius */}
            <ComponentBlock
                title="Border radius"
                description="A single --radius variable cascades to sm / md / lg / xl / full scales."
                code={`/* globals.css */
:root {
  --radius: 0.5rem; /* base — change this one value */

  /* derived scales — no need to touch these */
  --radius-sm:   calc(var(--radius) - 2px);
  --radius-md:   var(--radius);
  --radius-lg:   calc(var(--radius) + 2px);
  --radius-xl:   calc(var(--radius) + 6px);
  --radius-full: 9999px;
}`}
            >
                <div className="flex flex-wrap gap-3">
                    {[
                        { label: "Sharp", radius: "0px" },
                        { label: "Soft", radius: "0.375rem" },
                        { label: "Default", radius: "0.5rem" },
                        { label: "Rounded", radius: "0.75rem" },
                        { label: "Pill", radius: "9999px" },
                    ].map(({ label, radius }) => (
                        <div
                            key={label}
                            className="flex h-9 items-center border border-(--color-border) bg-(--color-muted) px-4 text-sm"
                            style={{ borderRadius: radius }}
                        >
                            {label}
                        </div>
                    ))}
                </div>
            </ComponentBlock>

            {/* Token table */}
            <ComponentBlock title="Full color token reference">
                <div className="overflow-x-auto rounded-lg border border-(--color-border)">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-(--color-border) bg-(--color-muted)">
                                <th className="px-4 py-2.5 text-left font-semibold text-(--color-foreground)">Token</th>
                                <th className="px-4 py-2.5 text-left font-semibold text-(--color-foreground)">Purpose</th>
                                <th className="px-4 py-2.5 text-left font-semibold text-(--color-foreground)">Preview</th>
                            </tr>
                        </thead>
                        <tbody>
                            {TOKEN_ROWS.map(({ token, purpose }, i) => (
                                <tr
                                    key={token}
                                    className={i % 2 === 0 ? "" : "bg-(--color-muted)/40"}
                                >
                                    <td className="px-4 py-2.5 font-mono text-xs text-(--color-foreground) whitespace-nowrap">
                                        {token}
                                    </td>
                                    <td className="px-4 py-2.5 text-(--color-muted-foreground)">{purpose}</td>
                                    <td className="px-4 py-2.5">
                                        <span
                                            className="inline-block h-5 w-10 rounded border border-(--color-border)"
                                            style={{ background: `var(${token})` }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ComponentBlock>
        </div>
    );
}

function ChartsSection() {
    return (
        <div className="space-y-6">
            <ComponentBlock
                title="AreaChart"
                description="Gradient fill area chart with multiple series."
                code={`<AreaChart
  data={revenueData}
  xKey="month"
  series={[
    { key: "revenue",  label: "Revenue",  color: "var(--color-primary)" },
    { key: "expenses", label: "Expenses", color: "oklch(0.65 0.15 30)" },
  ]}
  height={260}
/>`}
            >
                <Card noPadding>
                    <div className="p-5 pb-0">
                        <CardHeader title="Revenue vs Expenses" description="12-month view" />
                    </div>
                    <CardBody className="px-4 pb-4 pt-2">
                        <AreaChart
                            data={revenueData as unknown as Record<string, unknown>[]}
                            xKey="month"
                            series={[
                                { key: "revenue", label: "Revenue", color: "var(--color-primary)" },
                                { key: "expenses", label: "Expenses", color: "oklch(0.65 0.15 30)" },
                            ]}
                            height={260}
                        />
                    </CardBody>
                </Card>
            </ComponentBlock>

            <ComponentBlock
                title="LineChart"
                description="Multi-series line chart with smooth curves."
                code={`<LineChart
  data={signupData}
  xKey="month"
  series={[
    { key: "signups", label: "Signups", color: "var(--color-primary)" },
    { key: "churned", label: "Churned", color: "var(--color-destructive)" },
  ]}
  height={260}
/>`}
            >
                <Card noPadding>
                    <div className="p-5 pb-0">
                        <CardHeader title="Signups vs Churned" description="Monthly user growth" />
                    </div>
                    <CardBody className="px-4 pb-4 pt-2">
                        <LineChart
                            data={signupData as unknown as Record<string, unknown>[]}
                            xKey="month"
                            series={[
                                { key: "signups", label: "Signups", color: "var(--color-primary)" },
                                { key: "churned", label: "Churned", color: "var(--color-destructive)" },
                            ]}
                            height={260}
                        />
                    </CardBody>
                </Card>
            </ComponentBlock>

            <ComponentBlock
                title="BarChart"
                description="Grouped and stacked bar charts."
                code={`{/* Grouped (default) */}
<BarChart
  data={revenueData.slice(0, 6)}
  xKey="month"
  series={[
    { key: "revenue",  label: "Revenue",  color: "var(--color-primary)" },
    { key: "expenses", label: "Expenses", color: "oklch(0.65 0.15 30)" },
  ]}
  height={220}
/>

{/* Stacked — add the stacked prop */}
<BarChart ... stacked />`}
            >
                <div className="grid gap-4 sm:grid-cols-2">
                    <Card noPadding>
                        <div className="p-5 pb-0">
                            <CardHeader title="Grouped" />
                        </div>
                        <CardBody className="px-4 pb-4 pt-2">
                            <BarChart
                                data={(revenueData.slice(0, 6)) as unknown as Record<string, unknown>[]}
                                xKey="month"
                                series={[
                                    { key: "revenue", label: "Revenue", color: "var(--color-primary)" },
                                    { key: "expenses", label: "Expenses", color: "oklch(0.65 0.15 30)" },
                                ]}
                                height={220}
                            />
                        </CardBody>
                    </Card>
                    <Card noPadding>
                        <div className="p-5 pb-0">
                            <CardHeader title="Stacked" />
                        </div>
                        <CardBody className="px-4 pb-4 pt-2">
                            <BarChart
                                data={(revenueData.slice(0, 6)) as unknown as Record<string, unknown>[]}
                                xKey="month"
                                series={[
                                    { key: "revenue", label: "Revenue", color: "var(--color-primary)" },
                                    { key: "expenses", label: "Expenses", color: "oklch(0.65 0.15 30)" },
                                ]}
                                stacked
                                height={220}
                            />
                        </CardBody>
                    </Card>
                </div>
            </ComponentBlock>

            <ComponentBlock
                title="PieChart & DonutChart"
                code={`<PieChart data={orderStatusData} height={260} />

<DonutChart
  data={trafficSourceData}
  height={260}
  label="Sessions"
/>`}
            >
                <div className="grid gap-4 sm:grid-cols-2">
                    <Card>
                        <CardHeader title="PieChart" description="Order status breakdown" />
                        <CardBody>
                            <PieChart data={orderStatusData} height={260} />
                        </CardBody>
                    </Card>
                    <Card>
                        <CardHeader title="DonutChart" description="Traffic sources" />
                        <CardBody>
                            <DonutChart data={trafficSourceData} height={260} label="Sessions" />
                        </CardBody>
                    </Card>
                </div>
            </ComponentBlock>

            <ComponentBlock
                title="NotificationBell & ThemeToggle"
                description="Available via Header — see layout components."
                code={`{/* NotificationBell — uses NotificationContext internally */}\n<NotificationBell />\n\n{/* ThemeToggle — cycles light / dark / system */}\n<ThemeToggle />`}
            >
                <p className="text-sm text-(--color-muted-foreground)">
                    These components are embedded in the Header. Toggle theme using the sun/moon icon in the top-right corner.
                </p>
            </ComponentBlock>
        </div>
    );
}

/* ─── Page ──────────────────────────────────────────────────────── */

const TABS: TabItem[] = [
    { key: "primitives", label: "Primitives", content: <PrimitivesSection /> },
    { key: "feedback", label: "Feedback", content: <FeedbackSection /> },
    { key: "overlays", label: "Overlays", content: <OverlaysSection /> },
    { key: "navigation", label: "Navigation", content: <NavigationSection /> },
    { key: "forms", label: "Forms", content: <FormsSection /> },
    { key: "layout", label: "Layout", content: <LayoutSection /> },
    { key: "charts", label: "Charts", content: <ChartsSection /> },
    { key: "theming", label: "Theming", content: <ThemingSection /> },
];

export default function ComponentsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-1">Component Showcase</h1>
                <p className="text-sm text-(--color-muted-foreground)">
                    A living catalog of every UI primitive. All variants, props, and copy-paste snippets.
                    Run{" "}
                    <code className="font-mono bg-(--color-muted) px-1 py-0.5 rounded text-xs">
                        npm run storybook
                    </code>{" "}
                    for the full interactive catalog.
                </p>
            </div>
            <Tabs tabs={TABS} defaultTab="primitives" variant="pills" />
        </div>
    );
}
