import { cn } from "@/lib/utils";
import React from "react";

export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface SpinnerProps {
    size?: SpinnerSize;
    className?: string;
    label?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
    xs: "h-3 w-3 border",
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-[3px]",
    xl: "h-12 w-12 border-4",
};

export function Spinner({ size = "md", className, label = "Loading…" }: SpinnerProps) {
    return (
        <span
            role="status"
            aria-label={label}
            className={cn(
                "inline-block animate-spin rounded-full border-(--color-muted) border-t-(--color-primary)",
                sizeClasses[size],
                className,
            )}
        />
    );
}
