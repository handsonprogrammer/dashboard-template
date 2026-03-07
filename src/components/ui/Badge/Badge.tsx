import { cn } from "@/lib/utils";
import React from "react";

export type BadgeVariant =
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "destructive"
    | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
    dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
    default:
        "bg-(--color-muted) text-(--color-foreground)",
    primary:
        "bg-(--color-primary) text-(--color-primary-foreground)",
    secondary:
        "bg-(--color-secondary) text-(--color-secondary-foreground)",
    success:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    warning:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    destructive:
        "bg-(--color-destructive) text-(--color-destructive-foreground)",
    outline:
        "border border-(--color-border) bg-transparent text-(--color-foreground)",
};

const dotClasses: Record<BadgeVariant, string> = {
    default: "bg-(--color-muted-foreground)",
    primary: "bg-(--color-primary-foreground)",
    secondary: "bg-(--color-secondary-foreground)",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    destructive: "bg-(--color-destructive-foreground)",
    outline: "bg-(--color-foreground)",
};

export function Badge({
    variant = "default",
    dot = false,
    className,
    children,
    ...props
}: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                variantClasses[variant],
                className,
            )}
            {...props}
        >
            {dot && (
                <span
                    className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        dotClasses[variant],
                    )}
                />
            )}
            {children}
        </span>
    );
}
