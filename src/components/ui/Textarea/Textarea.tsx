import { cn } from "@/lib/utils";
import React from "react";

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
    containerClassName?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, helperText, containerClassName, className, id, ...props }, ref) => {
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
                <textarea
                    ref={ref}
                    id={fieldId}
                    aria-invalid={!!error}
                    aria-describedby={
                        error ? `${fieldId}-error` : helperText ? `${fieldId}-hint` : undefined
                    }
                    className={cn(
                        "min-h-[6rem] w-full resize-y rounded-(--radius) border border-(--color-input) bg-(--color-surface) px-3 py-2 text-sm text-(--color-foreground)",
                        "placeholder:text-(--color-muted-foreground)",
                        "outline-none transition-colors",
                        "focus:border-(--color-ring) focus:ring-2 focus:ring-(--color-ring)/20",
                        "disabled:pointer-events-none disabled:opacity-50",
                        error && "border-(--color-destructive) focus:ring-(--color-destructive)/20",
                        className,
                    )}
                    {...props}
                />
                {error && (
                    <p id={`${fieldId}-error`} className="text-xs text-(--color-destructive)">
                        {error}
                    </p>
                )}
                {!error && helperText && (
                    <p id={`${fieldId}-hint`} className="text-xs text-(--color-muted-foreground)">
                        {helperText}
                    </p>
                )}
            </div>
        );
    },
);
Textarea.displayName = "Textarea";
