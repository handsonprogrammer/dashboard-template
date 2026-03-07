import { cn, formatNumber } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import React from "react";

export interface StatCardProps {
    title: string;
    value: number | string;
    unit?: string;
    change?: number; // positive = up, negative = down
    changeLabel?: string;
    icon?: React.ComponentType<{ className?: string; size?: number }>;
    iconColor?: string;
    formatValue?: boolean; // apply formatNumber() to numeric value
    className?: string;
}

export function StatCard({
    title,
    value,
    unit,
    change,
    changeLabel = "vs last period",
    icon: Icon,
    iconColor = "text-(--color-primary)",
    formatValue = true,
    className,
}: StatCardProps) {
    const displayValue =
        typeof value === "number" && formatValue
            ? formatNumber(value, "en-US", { notation: "compact" })
            : value;

    const isPositive = change !== undefined && change >= 0;

    return (
        <div
            className={cn(
                "rounded-(--radius-lg) border border-(--color-border) bg-(--color-card) p-5 space-y-3",
                className,
            )}
        >
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-(--color-muted-foreground)">{title}</p>
                {Icon && (
                    <div className="rounded-(--radius) bg-(--color-muted) p-2">
                        <Icon size={18} className={iconColor} />
                    </div>
                )}
            </div>

            <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-(--color-foreground)">{displayValue}</span>
                {unit && (
                    <span className="text-sm text-(--color-muted-foreground)">{unit}</span>
                )}
            </div>

            {change !== undefined && (
                <div className="flex items-center gap-1.5 text-xs">
                    {isPositive ? (
                        <TrendingUp size={13} className="text-emerald-500" />
                    ) : (
                        <TrendingDown size={13} className="text-(--color-destructive)" />
                    )}
                    <span
                        className={cn(
                            "font-medium",
                            isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-(--color-destructive)",
                        )}
                    >
                        {isPositive ? "+" : ""}
                        {change}%
                    </span>
                    <span className="text-(--color-muted-foreground)">{changeLabel}</span>
                </div>
            )}
        </div>
    );
}
