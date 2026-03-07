"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import React from "react";

/* ─── Native <select> wrapper ─────────────────────────────────── */

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface SelectProps
    extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
    label?: string;
    options: SelectOption[];
    placeholder?: string;
    error?: string;
    helperText?: string;
    containerClassName?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    (
        {
            label,
            options,
            placeholder,
            error,
            helperText,
            containerClassName,
            className,
            id,
            ...props
        },
        ref,
    ) => {
        const fieldId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

        return (
            <div className={cn("w-full space-y-1.5", containerClassName)}>
                {label && (
                    <label
                        htmlFor={fieldId}
                        className="block text-sm font-medium text-(--color-foreground)"
                    >
                        {label}
                    </label>
                )}
                <div className="relative flex items-center">
                    <select
                        ref={ref}
                        id={fieldId}
                        aria-invalid={!!error}
                        className={cn(
                            "h-10 w-full appearance-none rounded-(--radius) border border-(--color-input) bg-(--color-surface) pl-3 pr-9 text-sm text-(--color-foreground)",
                            "outline-none transition-colors",
                            "focus:border-(--color-ring) focus:ring-2 focus:ring-(--color-ring)/20",
                            "disabled:pointer-events-none disabled:opacity-50",
                            error && "border-(--color-destructive) focus:ring-(--color-destructive)/20",
                            className,
                        )}
                        {...props}
                    >
                        {placeholder && (
                            <option value="" disabled>
                                {placeholder}
                            </option>
                        )}
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown
                        size={15}
                        className="pointer-events-none absolute right-3 shrink-0 text-(--color-muted-foreground)"
                    />
                </div>
                {error && (
                    <p id={`${fieldId}-error`} className="text-xs text-(--color-destructive)">
                        {error}
                    </p>
                )}
                {!error && helperText && (
                    <p className="text-xs text-(--color-muted-foreground)">{helperText}</p>
                )}
            </div>
        );
    },
);
Select.displayName = "Select";
