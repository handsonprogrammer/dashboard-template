"use client";

import { cn } from "@/lib/utils";
import React from "react";

export interface ToggleProps {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    label?: string;
    description?: string;
    disabled?: boolean;
    size?: "sm" | "md" | "lg";
    className?: string;
    id?: string;
}

const sizeMap = {
    sm: {
        track: "h-4 w-7",
        thumb: "h-3 w-3",
        translate: "translate-x-3",
    },
    md: {
        track: "h-5 w-9",
        thumb: "h-4 w-4",
        translate: "translate-x-4",
    },
    lg: {
        track: "h-6 w-11",
        thumb: "h-5 w-5",
        translate: "translate-x-5",
    },
};

export function Toggle({
    checked = false,
    onChange,
    label,
    description,
    disabled = false,
    size = "md",
    className,
    id,
}: ToggleProps) {
    const { track, thumb, translate } = sizeMap[size];
    const toggleId =
        id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
        <div className={cn("flex items-start gap-3", className)}>
            {/* Hidden input for form compat */}
            <button
                type="button"
                role="switch"
                id={toggleId}
                aria-checked={checked}
                disabled={disabled}
                onClick={() => onChange?.(!checked)}
                className={cn(
                    "relative mt-0.5 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-(--color-ring)/40",
                    track,
                    checked
                        ? "bg-(--color-primary)"
                        : "bg-(--color-muted)",
                    disabled && "pointer-events-none opacity-50",
                )}
            >
                <span
                    className={cn(
                        "absolute top-0.5 left-0.5 rounded-full bg-white shadow transition-transform duration-200",
                        thumb,
                        checked && translate,
                    )}
                />
            </button>

            {(label || description) && (
                <div className="space-y-0.5">
                    {label && (
                        <label
                            htmlFor={toggleId}
                            className="cursor-pointer text-sm font-medium text-(--color-foreground)"
                        >
                            {label}
                        </label>
                    )}
                    {description && (
                        <p className="text-xs text-(--color-muted-foreground)">{description}</p>
                    )}
                </div>
            )}
        </div>
    );
}
