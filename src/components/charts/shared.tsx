"use client";

/**
 * Describes one data series for line/bar/area charts.
 * `key` must match a property name in your data objects.
 */
export interface ChartSeries {
    key: string;
    label: string;
    color: string; // any CSS color: "var(--color-primary)", "#3b82f6", "oklch(...)"
}

interface TooltipPayloadEntry {
    dataKey?: string | number;
    name?: string;
    value?: number;
    color?: string;
}

interface ChartTooltipProps {
    active?: boolean;
    payload?: TooltipPayloadEntry[];
    label?: string;
}

/**
 * Dark-mode aware custom tooltip.
 * Uses CSS design tokens so it automatically respects light/dark theme.
 * Pass as: <Tooltip content={<ChartTooltip />} />
 */
export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg border border-(--color-border) bg-(--color-card) px-3 py-2 shadow-lg text-sm">
            <p className="font-medium mb-1 text-(--color-foreground)">{label}</p>
            {payload.map((entry) => {
                const value = typeof entry.value === "number" ? entry.value : 0;
                return (
                    <p key={`${String(entry.dataKey)}-${entry.name ?? ""}`} style={{ color: entry.color }}>
                        {entry.name}: {value.toLocaleString()}
                    </p>
                );
            })}
        </div>
    );
}
