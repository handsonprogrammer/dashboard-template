# Phase 4 — Charts Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build 5 reusable, dark-mode-aware chart components (LineChart, BarChart, AreaChart, PieChart, DonutChart) using recharts, plus mock analytics data.

**Architecture:** Each chart is a data-agnostic client component with a typed prop interface. A shared `shared.tsx` file exports `ChartSeries`, `CategoryDataPoint`, and `ChartTooltip` to avoid duplication. `src/data/analytics.ts` provides mock data for pages/stories.

**Tech Stack:** `recharts` (already installed), `ResponsiveContainer`, Tailwind CSS v4 design tokens, `cn()` from `@/lib/utils`

> **Note:** No tests or Storybook stories in Phase 4 — those land in Phases 8 and 7. Verification is `npx tsc --noEmit` after each task and `npm run build` at the end.

---

## Task 1: Create mock analytics data

**Files:**
- Create: `src/data/analytics.ts`

**Step 1: Create the file**

```ts
/**
 * Mock analytics data for dashboard pages and chart demos.
 * Replace these with real API calls when integrating a backend.
 */

export interface MonthlyDataPoint {
    month: string;
    revenue: number;
    expenses: number;
}

export interface SignupDataPoint {
    month: string;
    signups: number;
    churned: number;
}

export interface CategoryDataPoint {
    label: string;
    value: number;
    color: string;
}

export const revenueData: MonthlyDataPoint[] = [
    { month: "Jan", revenue: 42000, expenses: 28000 },
    { month: "Feb", revenue: 47000, expenses: 31000 },
    { month: "Mar", revenue: 51000, expenses: 33000 },
    { month: "Apr", revenue: 49000, expenses: 30000 },
    { month: "May", revenue: 58000, expenses: 35000 },
    { month: "Jun", revenue: 63000, expenses: 38000 },
    { month: "Jul", revenue: 59000, expenses: 36000 },
    { month: "Aug", revenue: 68000, expenses: 40000 },
    { month: "Sep", revenue: 72000, expenses: 42000 },
    { month: "Oct", revenue: 69000, expenses: 41000 },
    { month: "Nov", revenue: 78000, expenses: 45000 },
    { month: "Dec", revenue: 84000, expenses: 48000 },
];

export const signupData: SignupDataPoint[] = [
    { month: "Jan", signups: 320, churned: 45 },
    { month: "Feb", signups: 410, churned: 52 },
    { month: "Mar", signups: 390, churned: 48 },
    { month: "Apr", signups: 450, churned: 60 },
    { month: "May", signups: 520, churned: 55 },
    { month: "Jun", signups: 610, churned: 70 },
    { month: "Jul", signups: 580, churned: 65 },
    { month: "Aug", signups: 640, churned: 72 },
    { month: "Sep", signups: 720, churned: 80 },
    { month: "Oct", signups: 690, churned: 75 },
    { month: "Nov", signups: 780, churned: 85 },
    { month: "Dec", signups: 850, churned: 90 },
];

/** Traffic source breakdown — use with PieChart or DonutChart. */
export const trafficSourceData: CategoryDataPoint[] = [
    { label: "Organic",  value: 4200, color: "var(--color-primary)" },
    { label: "Direct",   value: 2800, color: "var(--color-secondary)" },
    { label: "Referral", value: 1900, color: "oklch(0.65 0.15 140)" },
    { label: "Social",   value: 1100, color: "oklch(0.65 0.15 30)" },
];

/** Order status breakdown — use with PieChart or DonutChart. */
export const orderStatusData: CategoryDataPoint[] = [
    { label: "Delivered",   value: 540, color: "oklch(0.65 0.15 140)" },
    { label: "Processing",  value: 230, color: "var(--color-primary)" },
    { label: "Shipped",     value: 190, color: "var(--color-secondary)" },
    { label: "Pending",     value: 120, color: "oklch(0.65 0.15 60)" },
    { label: "Cancelled",   value:  45, color: "var(--color-destructive)" },
];
```

**Step 2: Verify**

```bash
npx tsc --noEmit
```
Expected: zero errors.

**Step 3: Commit**

```bash
git add src/data/analytics.ts
git commit -m "feat: add mock analytics data for chart demos"
```

---

## Task 2: Create shared chart utilities

**Files:**
- Create: `src/components/charts/shared.tsx`

**Step 1: Create the file**

```tsx
"use client";

import type { TooltipProps } from "recharts";

/**
 * Describes one data series for line/bar/area charts.
 * `key` must match a property name in your data objects.
 */
export interface ChartSeries {
    key: string;
    label: string;
    color: string; // any CSS color: "var(--color-primary)", "#3b82f6", "oklch(...)"
}

/**
 * Shared data shape for PieChart and DonutChart.
 * Also exported from src/data/analytics.ts for convenience.
 */
export interface CategoryDataPoint {
    label: string;
    value: number;
    color: string;
}

/**
 * Dark-mode aware custom tooltip.
 * Uses CSS design tokens so it automatically respects light/dark theme.
 * Pass as: <Tooltip content={<ChartTooltip />} />
 */
export function ChartTooltip({
    active,
    payload,
    label,
}: TooltipProps<number, string>) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg border border-(--color-border) bg-(--color-card) px-3 py-2 shadow-lg text-sm">
            <p className="font-medium mb-1 text-(--color-foreground)">{label}</p>
            {payload.map((entry) => (
                <p key={String(entry.dataKey)} style={{ color: entry.color }}>
                    {entry.name}: {(entry.value ?? 0).toLocaleString()}
                </p>
            ))}
        </div>
    );
}
```

**Step 2: Verify**

```bash
npx tsc --noEmit
```
Expected: zero errors.

**Step 3: Commit**

```bash
git add src/components/charts/shared.tsx
git commit -m "feat: add shared ChartSeries, CategoryDataPoint, ChartTooltip"
```

---

## Task 3: Create LineChart component

**Files:**
- Create: `src/components/charts/LineChart/LineChart.tsx`
- Create: `src/components/charts/LineChart/index.ts`

**Step 1: Create `LineChart.tsx`**

```tsx
"use client";

import {
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { ChartTooltip, type ChartSeries } from "../shared";

export interface LineChartProps {
    data: Record<string, unknown>[];
    xKey: string;
    series: ChartSeries[];
    height?: number;
    curved?: boolean;   // monotone curve vs linear; default true
    showGrid?: boolean; // default true
    className?: string;
}

export function LineChart({
    data,
    xKey,
    series,
    height = 300,
    curved = true,
    showGrid = true,
    className,
}: LineChartProps) {
    return (
        <div className={cn("w-full", className)}>
            <ResponsiveContainer width="100%" height={height}>
                <RechartsLineChart
                    data={data}
                    margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
                >
                    {showGrid && (
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="var(--color-border)"
                            vertical={false}
                        />
                    )}
                    <XAxis
                        dataKey={xKey}
                        tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v: number) => v.toLocaleString()}
                        width={48}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    {series.map((s) => (
                        <Line
                            key={s.key}
                            type={curved ? "monotone" : "linear"}
                            dataKey={s.key}
                            name={s.label}
                            stroke={s.color}
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4 }}
                        />
                    ))}
                </RechartsLineChart>
            </ResponsiveContainer>
        </div>
    );
}
```

**Step 2: Create `index.ts`**

```ts
export { LineChart, type LineChartProps } from "./LineChart";
```

**Step 3: Verify**

```bash
npx tsc --noEmit
```
Expected: zero errors.

**Step 4: Commit**

```bash
git add src/components/charts/LineChart/
git commit -m "feat: add LineChart component"
```

---

## Task 4: Create BarChart component

**Files:**
- Create: `src/components/charts/BarChart/BarChart.tsx`
- Create: `src/components/charts/BarChart/index.ts`

**Step 1: Create `BarChart.tsx`**

```tsx
"use client";

import {
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { ChartTooltip, type ChartSeries } from "../shared";

export interface BarChartProps {
    data: Record<string, unknown>[];
    xKey: string;
    series: ChartSeries[];
    height?: number;
    stacked?: boolean;  // grouped vs stacked; default false
    showGrid?: boolean; // default true
    className?: string;
}

export function BarChart({
    data,
    xKey,
    series,
    height = 300,
    stacked = false,
    showGrid = true,
    className,
}: BarChartProps) {
    return (
        <div className={cn("w-full", className)}>
            <ResponsiveContainer width="100%" height={height}>
                <RechartsBarChart
                    data={data}
                    margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
                >
                    {showGrid && (
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="var(--color-border)"
                            vertical={false}
                        />
                    )}
                    <XAxis
                        dataKey={xKey}
                        tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v: number) => v.toLocaleString()}
                        width={48}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    {series.map((s) => (
                        <Bar
                            key={s.key}
                            dataKey={s.key}
                            name={s.label}
                            fill={s.color}
                            stackId={stacked ? "stack" : undefined}
                            radius={stacked ? [0, 0, 0, 0] : [4, 4, 0, 0]}
                        />
                    ))}
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    );
}
```

**Step 2: Create `index.ts`**

```ts
export { BarChart, type BarChartProps } from "./BarChart";
```

**Step 3: Verify**

```bash
npx tsc --noEmit
```
Expected: zero errors.

**Step 4: Commit**

```bash
git add src/components/charts/BarChart/
git commit -m "feat: add BarChart component (grouped + stacked)"
```

---

## Task 5: Create AreaChart component

**Files:**
- Create: `src/components/charts/AreaChart/AreaChart.tsx`
- Create: `src/components/charts/AreaChart/index.ts`

**Step 1: Create `AreaChart.tsx`**

```tsx
"use client";

import {
    AreaChart as RechartsAreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { ChartTooltip, type ChartSeries } from "../shared";

export interface AreaChartProps {
    data: Record<string, unknown>[];
    xKey: string;
    series: ChartSeries[];
    height?: number;
    showGrid?: boolean; // default true
    className?: string;
}

export function AreaChart({
    data,
    xKey,
    series,
    height = 300,
    showGrid = true,
    className,
}: AreaChartProps) {
    return (
        <div className={cn("w-full", className)}>
            <ResponsiveContainer width="100%" height={height}>
                <RechartsAreaChart
                    data={data}
                    margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
                >
                    <defs>
                        {series.map((s) => (
                            <linearGradient
                                key={s.key}
                                id={`gradient-${s.key}`}
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor={s.color}
                                    stopOpacity={0.3}
                                />
                                <stop
                                    offset="95%"
                                    stopColor={s.color}
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        ))}
                    </defs>
                    {showGrid && (
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="var(--color-border)"
                            vertical={false}
                        />
                    )}
                    <XAxis
                        dataKey={xKey}
                        tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v: number) => v.toLocaleString()}
                        width={48}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    {series.map((s) => (
                        <Area
                            key={s.key}
                            type="monotone"
                            dataKey={s.key}
                            name={s.label}
                            stroke={s.color}
                            strokeWidth={2}
                            fill={`url(#gradient-${s.key})`}
                            fillOpacity={1}
                        />
                    ))}
                </RechartsAreaChart>
            </ResponsiveContainer>
        </div>
    );
}
```

**Step 2: Create `index.ts`**

```ts
export { AreaChart, type AreaChartProps } from "./AreaChart";
```

**Step 3: Verify**

```bash
npx tsc --noEmit
```
Expected: zero errors.

**Step 4: Commit**

```bash
git add src/components/charts/AreaChart/
git commit -m "feat: add AreaChart component with gradient fill"
```

---

## Task 6: Create PieChart component

**Files:**
- Create: `src/components/charts/PieChart/PieChart.tsx`
- Create: `src/components/charts/PieChart/index.ts`

**Step 1: Create `PieChart.tsx`**

Note: import recharts `PieChart` as `RechartsPieChart` to avoid naming conflict with our export.

```tsx
"use client";

import {
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { ChartTooltip, type CategoryDataPoint } from "../shared";

export interface PieChartProps {
    data: CategoryDataPoint[];
    height?: number;
    showLabels?: boolean; // default false
    className?: string;
}

export function PieChart({
    data,
    height = 300,
    showLabels = false,
    className,
}: PieChartProps) {
    return (
        <div className={cn("w-full", className)}>
            <ResponsiveContainer width="100%" height={height}>
                <RechartsPieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={showLabels ? (entry: CategoryDataPoint) => entry.label : false}
                        labelLine={showLabels}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                </RechartsPieChart>
            </ResponsiveContainer>
        </div>
    );
}
```

**Step 2: Create `index.ts`**

```ts
export { PieChart, type PieChartProps } from "./PieChart";
```

**Step 3: Verify**

```bash
npx tsc --noEmit
```
Expected: zero errors.

**Step 4: Commit**

```bash
git add src/components/charts/PieChart/
git commit -m "feat: add PieChart component"
```

---

## Task 7: Create DonutChart component

**Files:**
- Create: `src/components/charts/DonutChart/DonutChart.tsx`
- Create: `src/components/charts/DonutChart/index.ts`

**Step 1: Create `DonutChart.tsx`**

```tsx
"use client";

import {
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { ChartTooltip, type CategoryDataPoint } from "../shared";

export interface DonutChartProps {
    data: CategoryDataPoint[];
    height?: number;
    innerRadius?: number; // default 60
    label?: string;       // optional centered text inside the donut
    className?: string;
}

export function DonutChart({
    data,
    height = 300,
    innerRadius = 60,
    label,
    className,
}: DonutChartProps) {
    return (
        <div className={cn("w-full", className)}>
            <ResponsiveContainer width="100%" height={height}>
                <RechartsPieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={innerRadius}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    {label && (
                        <text
                            x="50%"
                            y="50%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            style={{
                                fill: "var(--color-foreground)",
                                fontSize: 14,
                                fontWeight: 600,
                            }}
                        >
                            {label}
                        </text>
                    )}
                    <Tooltip content={<ChartTooltip />} />
                </RechartsPieChart>
            </ResponsiveContainer>
        </div>
    );
}
```

**Step 2: Create `index.ts`**

```ts
export { DonutChart, type DonutChartProps } from "./DonutChart";
```

**Step 3: Verify**

```bash
npx tsc --noEmit
```
Expected: zero errors.

**Step 4: Commit**

```bash
git add src/components/charts/DonutChart/
git commit -m "feat: add DonutChart component with optional centered label"
```

---

## Task 8: Create charts barrel export

**Files:**
- Create: `src/components/charts/index.ts`

**Step 1: Create the file**

```ts
export { LineChart, type LineChartProps } from "./LineChart";
export { BarChart, type BarChartProps } from "./BarChart";
export { AreaChart, type AreaChartProps } from "./AreaChart";
export { PieChart, type PieChartProps } from "./PieChart";
export { DonutChart, type DonutChartProps } from "./DonutChart";

// Shared types — re-exported so callers import from one place
export { type ChartSeries, type CategoryDataPoint } from "./shared";
```

**Step 2: Verify**

```bash
npx tsc --noEmit
```
Expected: zero errors.

**Step 3: Commit**

```bash
git add src/components/charts/index.ts
git commit -m "feat: add charts barrel export"
```

---

## Task 9: Full build verification + agents.md update

**Step 1: Run full build**

```bash
npm run build
```
Expected: exit 0, zero TypeScript/ESLint errors, all pages generated.

**Step 2: Update `agents.md` Phase 4 section**

In `agents.md`, find `### Phase 4 — Charts` and change all `- [ ]` to `- [x]`:

```markdown
### Phase 4 — Charts
- [x] LineChart (multi-series, monotone, custom tooltip)
- [x] BarChart (grouped + stacked)
- [x] AreaChart (gradient fill)
- [x] PieChart
- [x] DonutChart
```

**Step 3: Commit**

```bash
git add agents.md
git commit -m "docs: mark Phase 4 complete in agents.md"
```
