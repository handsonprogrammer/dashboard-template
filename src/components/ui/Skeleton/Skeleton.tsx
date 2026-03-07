import { cn } from "@/lib/utils";
import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

/** Base skeleton block — use className to set size / shape. */
export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-(--radius) bg-(--color-muted)",
                className,
            )}
            aria-hidden="true"
            {...props}
        />
    );
}

/** Card-shaped skeleton: heading + 3 body lines. */
export function SkeletonCard({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "rounded-(--radius-lg) border border-(--color-border) bg-(--color-card) p-5 space-y-4",
                className,
            )}
            aria-hidden="true"
        >
            <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                </div>
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-4/6" />
        </div>
    );
}

/** Single table-row skeleton. */
export function SkeletonTableRow({ cols = 5 }: { cols?: number }) {
    return (
        <tr aria-hidden="true">
            {Array.from({ length: cols }).map((_, i) => (
                <td key={i} className="px-4 py-3">
                    <Skeleton className="h-4 w-full" />
                </td>
            ))}
        </tr>
    );
}

/** Chart area skeleton. */
export function SkeletonChart({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "rounded-(--radius-lg) border border-(--color-border) bg-(--color-card) p-5",
                className,
            )}
            aria-hidden="true"
        >
            <Skeleton className="mb-4 h-5 w-40" />
            <Skeleton className="h-48 w-full rounded-(--radius)" />
        </div>
    );
}

/** Avatar + name skeleton. */
export function SkeletonAvatar({ className }: { className?: string }) {
    return (
        <div
            className={cn("flex items-center gap-3", className)}
            aria-hidden="true"
        >
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
            </div>
        </div>
    );
}
