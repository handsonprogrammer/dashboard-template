"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "destructive" | "outline";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
    children: React.ReactNode;
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
        "bg-(--color-primary) text-(--color-primary-foreground) hover:opacity-90 focus-visible:ring-2 focus-visible:ring-(--color-ring)",
    secondary:
        "bg-(--color-secondary) text-(--color-secondary-foreground) hover:opacity-90 focus-visible:ring-2 focus-visible:ring-(--color-ring)",
    ghost:
        "bg-transparent text-(--color-foreground) hover:bg-(--color-muted) focus-visible:ring-2 focus-visible:ring-(--color-ring)",
    destructive:
        "bg-(--color-destructive) text-(--color-destructive-foreground) hover:opacity-90 focus-visible:ring-2 focus-visible:ring-(--color-destructive)",
    outline:
        "border border-(--color-border) bg-transparent text-(--color-foreground) hover:bg-(--color-muted) focus-visible:ring-2 focus-visible:ring-(--color-ring)",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
    sm: "h-8 px-3 text-sm gap-1.5",
    md: "h-10 px-4 text-sm gap-2",
    lg: "h-12 px-6 text-base gap-2",
};

export function Button({
    variant = "primary",
    size = "md",
    loading = false,
    disabled,
    className,
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-(--radius) font-medium transition-all outline-none",
                "disabled:pointer-events-none disabled:opacity-50",
                variantClasses[variant],
                sizeClasses[size],
                className,
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <Loader2 className="animate-spin" size={16} />}
            {children}
        </button>
    );
}
