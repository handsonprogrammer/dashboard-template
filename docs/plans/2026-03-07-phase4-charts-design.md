# Phase 4 — Charts Design

**Date:** 2026-03-07
**Status:** Approved

---

## Overview

Build 5 reusable chart components using `recharts` + `ResponsiveContainer`. Charts are data-agnostic — callers always provide data via props. Mock time-series and category data lives in `src/data/analytics.ts` for use by pages.

---

## File Structure

```
src/components/charts/
├── shared.tsx              # ChartTooltip + ChartSeries type shared by all charts
├── LineChart/
│   ├── LineChart.tsx
│   └── index.ts
├── BarChart/
│   ├── BarChart.tsx
│   └── index.ts
├── AreaChart/
│   ├── AreaChart.tsx
│   └── index.ts
├── PieChart/
│   ├── PieChart.tsx
│   └── index.ts
├── DonutChart/
│   ├── DonutChart.tsx
│   └── index.ts
└── index.ts                # Barrel: re-exports all 5 charts + ChartSeries type

src/data/analytics.ts       # Mock time-series + category data for pages
```

No test or story files in Phase 4 — those land in Phases 7 and 8.

---

## Shared (`shared.tsx`)

### `ChartSeries` interface

```ts
export interface ChartSeries {
  key: string;    // matches a key in the data objects
  label: string;  // display name in tooltip
  color: string;  // CSS color, e.g. "var(--color-primary)"
}
```

### `ChartTooltip` component

Dark-mode aware custom tooltip — reads CSS variables so it respects light/dark theme:

```tsx
function ChartTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-(--color-border) bg-(--color-card) px-3 py-2 shadow-lg text-sm">
      <p className="font-medium mb-1 text-(--color-foreground)">{label}</p>
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

## Common Prop Pattern (LineChart, BarChart, AreaChart)

| Prop | Type | Required | Default |
|---|---|---|---|
| `data` | `Record<string, unknown>[]` | ✅ | — |
| `xKey` | `string` | ✅ | — |
| `series` | `ChartSeries[]` | ✅ | — |
| `height` | `number` | — | `300` |
| `showGrid` | `boolean` | — | `true` |
| `className` | `string` | — | — |

All wrapped in `<ResponsiveContainer width="100%" height={height}>`.

---

## Chart-Specific Design

### LineChart
- Extra prop: `curved?: boolean` — monotone curve vs linear (default `true`)
- Uses `<LineChart>` + `<Line>` from recharts
- `dot={false}` by default for clean multi-series look
- `strokeWidth={2}` per line

### BarChart
- Extra prop: `stacked?: boolean` — grouped vs stacked (default `false`)
- Uses `<BarChart>` + `<Bar>` from recharts
- When stacked: each `<Bar>` gets `stackId="a"`
- `radius={[4, 4, 0, 0]}` on bars for rounded tops

### AreaChart
- Always curved (monotone)
- Gradient fill per series: `<defs><linearGradient>` with `fillOpacity` from 0.3 → 0
- `strokeWidth={2}` per area
- `fillOpacity={1}` on `<Area>` (gradient handles the fade)

### PieChart
- **Different prop shape** — simpler, no `xKey`/`series`:
  ```ts
  interface PieChartProps {
    data: { label: string; value: number; color: string }[];
    height?: number;        // default 300
    showLabels?: boolean;   // default false
    className?: string;
  }
  ```
- Uses `<PieChart>` + `<Pie>` + `<Cell>` from recharts
- `outerRadius={80}`, `dataKey="value"`, `nameKey="label"`

### DonutChart
- Same prop shape as PieChart plus:
  - `innerRadius?: number` — default `60`
  - `label?: string` — optional centered text (rendered as SVG `<text>`)
- Uses `<PieChart>` + `<Pie innerRadius={innerRadius}>` + `<Cell>`

---

## Mock Analytics Data (`src/data/analytics.ts`)

Inline static data — no JSON file needed.

```ts
// Monthly time-series (12 months) — for LineChart, AreaChart, BarChart
export const revenueData = [
  { month: "Jan", revenue: 42000, expenses: 28000 },
  { month: "Feb", revenue: 47000, expenses: 31000 },
  // ... 10 more months
];

// User signups by month
export const signupData = [
  { month: "Jan", signups: 320, churned: 45 },
  // ...
];

// Category breakdown — for PieChart, DonutChart
export const trafficSourceData = [
  { label: "Organic", value: 4200, color: "var(--color-primary)" },
  { label: "Direct",  value: 2800, color: "var(--color-secondary)" },
  { label: "Referral", value: 1900, color: "oklch(0.65 0.15 140)" },
  { label: "Social",  value: 1100, color: "oklch(0.65 0.15 30)" },
];
```

Colors use CSS variables where possible; raw `oklch()` for chart-specific accents.

---

## Out of Scope for Phase 4

- Tests — Phase 8
- Storybook stories — Phase 7
- Legend component — callers can add their own if needed
- Click handlers / drill-down — not needed for template
- Animations beyond recharts defaults — not needed
