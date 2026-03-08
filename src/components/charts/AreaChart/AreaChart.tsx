"use client";

import { useId } from "react";
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
    const uid = useId();
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
                                id={`gradient-${uid}-${s.key}`}
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
                            fill={`url(#gradient-${uid}-${s.key})`}
                            fillOpacity={1}
                        />
                    ))}
                </RechartsAreaChart>
            </ResponsiveContainer>
        </div>
    );
}
