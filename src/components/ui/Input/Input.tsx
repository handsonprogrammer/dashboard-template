import { cn } from "@/lib/utils";
import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ComponentType<{ className?: string; size?: number }>;
    rightIcon?: React.ComponentType<{ className?: string; size?: number }>;
    containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            helperText,
            leftIcon: LeftIcon,
            rightIcon: RightIcon,
            containerClassName,
            className,
            id,
            ...props
        },
        ref,
    ) => {
        const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

        return (
            <div className={cn("w-full space-y-1.5", containerClassName)}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-(--color-foreground)"
                    >
                        {label}
                    </label>
                )}
                <div className="relative flex items-center">
                    {LeftIcon && (
                        <LeftIcon
                            size={16}
                            className="pointer-events-none absolute left-3 shrink-0 text-(--color-muted-foreground)"
                        />
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        aria-invalid={!!error}
                        aria-describedby={
                            error ? `${inputId}-error` : helperText ? `${inputId}-hint` : undefined
                        }
                        className={cn(
                            "h-10 w-full rounded-(--radius) border border-(--color-input) bg-(--color-surface) px-3 text-sm text-(--color-foreground)",
                            "placeholder:text-(--color-muted-foreground)",
                            "outline-none transition-colors",
                            "focus:border-(--color-ring) focus:ring-2 focus:ring-(--color-ring)/20",
                            "disabled:pointer-events-none disabled:opacity-50",
                            LeftIcon && "pl-9",
                            RightIcon && "pr-9",
                            error && "border-(--color-destructive) focus:ring-(--color-destructive)/20",
                            className,
                        )}
                        {...props}
                    />
                    {RightIcon && (
                        <RightIcon
                            size={16}
                            className="pointer-events-none absolute right-3 shrink-0 text-(--color-muted-foreground)"
                        />
                    )}
                </div>
                {error && (
                    <p id={`${inputId}-error`} className="text-xs text-(--color-destructive)">
                        {error}
                    </p>
                )}
                {!error && helperText && (
                    <p id={`${inputId}-hint`} className="text-xs text-(--color-muted-foreground)">
                        {helperText}
                    </p>
                )}
            </div>
        );
    },
);
Input.displayName = "Input";
