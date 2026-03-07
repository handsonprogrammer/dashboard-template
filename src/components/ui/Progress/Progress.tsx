import { cn } from "@/lib/utils";
import React from "react";

export type ProgressVariant = "default" | "success" | "warning" | "destructive";

export interface ProgressProps {
    value: number; // 0–100
    max?: number;
    variant?: ProgressVariant;
    size?: "sm" | "md" | "lg";
    showLabel?: boolean;
    label?: string;
    className?: string;
}

const trackColor: Record<ProgressVariant, string> = {
    default: "bg-(--color-primary)",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    destructive: "bg-(--color-destructive)",
};

const heightClass: Record<NonNullable<ProgressProps["size"]>, string> = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
};

export function Progress({
    value,
    max = 100,
    variant = "default",
    size = "md",
    showLabel = false,
    label,
    className,
}: ProgressProps) {
    const pct = Math.min(100, Math.max(0, (value / max) * 100));

    return (
        <div className={cn("w-full", className)}>
            {(showLabel || label) && (
                <div className="mb-1 flex items-center justify-between text-xs text-(--color-muted-foreground)">
                    {label && <span>{label}</span>}
                    {showLabel && <span>{Math.round(pct)}%</span>}
                </div>
            )}
            <div
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={max}
                className={cn(
                    "w-full overflow-hidden rounded-full bg-(--color-muted)",
                    heightClass[size],
                )}
            >
                <div
                    className={cn(
                        "h-full rounded-full transition-all duration-300",
                        trackColor[variant],
                    )}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

/* ─── Ring (circular) Progress ─────────────────────────────────── */

export interface RingProgressProps {
    value: number; // 0–100
    size?: number; // px diameter
    strokeWidth?: number;
    variant?: ProgressVariant;
    showLabel?: boolean;
    className?: string;
}

const ringColor: Record<ProgressVariant, string> = {
    default: "stroke-(--color-primary)",
    success: "stroke-emerald-500",
    warning: "stroke-amber-500",
    destructive: "stroke-(--color-destructive)",
};

export function RingProgress({
    value,
    size = 64,
    strokeWidth = 6,
    variant = "default",
    showLabel = true,
    className,
}: RingProgressProps) {
    const r = (size - strokeWidth) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (Math.min(100, Math.max(0, value)) / 100) * circ;

    return (
        <div
            className={cn("relative inline-flex items-center justify-center", className)}
            style={{ width: size, height: size }}
        >
            <svg width={size} height={size} className="-rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    strokeWidth={strokeWidth}
                    className="stroke-(--color-muted)"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circ}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className={cn("transition-all duration-300", ringColor[variant])}
                />
            </svg>
            {showLabel && (
                <span className="absolute text-xs font-medium text-(--color-foreground)">
                    {Math.round(value)}%
                </span>
            )}
        </div>
    );
}
