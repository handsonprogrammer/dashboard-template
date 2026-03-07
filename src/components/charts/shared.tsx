"use client";

import type { TooltipContentProps } from "recharts";
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";

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
 * Dark-mode aware custom tooltip.
 * Uses CSS design tokens so it automatically respects light/dark theme.
 * Pass as: <Tooltip content={<ChartTooltip />} />
 */
export function ChartTooltip({
    active,
    payload,
    label,
}: TooltipContentProps<ValueType, NameType>) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg border border-(--color-border) bg-(--color-card) px-3 py-2 shadow-lg text-sm">
            <p className="font-medium mb-1 text-(--color-foreground)">{label}</p>
            {payload.map((entry) => (
                <p key={String(entry.dataKey)} style={{ color: entry.color }}>
                    {entry.name}: {((entry.value as number) ?? 0).toLocaleString()}
                </p>
            ))}
        </div>
    );
}
