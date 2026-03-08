"use client";

import {
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { ChartTooltip } from "../shared";
import type { CategoryDataPoint } from "@/types";

export interface DonutChartProps {
    data: CategoryDataPoint[];
    height?: number;
    innerRadius?: number; // default 60
    label?: string;       // optional centered text inside the donut hole
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
