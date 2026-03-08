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
