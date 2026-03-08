"use client";

import {
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import type { PieLabelRenderProps } from "recharts";
import { cn } from "@/lib/utils";
import { ChartTooltip } from "../shared";
import type { CategoryDataPoint } from "@/types";

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
                        label={showLabels ? (entry: PieLabelRenderProps) => (entry.payload as CategoryDataPoint).label : false}
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
