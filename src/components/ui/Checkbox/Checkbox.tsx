import { cn } from "@/lib/utils";
import { Check, Minus } from "lucide-react";
import React from "react";

export interface CheckboxProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: string;
    description?: string;
    indeterminate?: boolean;
    containerClassName?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, description, indeterminate, containerClassName, className, id, ...props }, ref) => {
        const fieldId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

        const innerRef = (el: HTMLInputElement | null) => {
            if (el) el.indeterminate = !!indeterminate;
            if (typeof ref === "function") ref(el);
            else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
        };

        return (
            <div className={cn("flex items-start gap-3", containerClassName)}>
                <div className="relative mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
                    <input
                        ref={innerRef}
                        id={fieldId}
                        type="checkbox"
                        className={cn(
                            "peer h-4 w-4 appearance-none rounded-(--radius-sm) border border-(--color-input) bg-(--color-surface)",
                            "checked:border-(--color-primary) checked:bg-(--color-primary)",
                            "indeterminate:border-(--color-primary) indeterminate:bg-(--color-primary)",
                            "focus:outline-none focus:ring-2 focus:ring-(--color-ring)/30",
                            "disabled:pointer-events-none disabled:opacity-50 transition-colors",
                            className,
                        )}
                        {...props}
                    />
                    {indeterminate ? (
                        <Minus
                            size={10}
                            strokeWidth={3}
                            className="pointer-events-none absolute text-white opacity-0 peer-indeterminate:opacity-100"
                        />
                    ) : (
                        <Check
                            size={10}
                            strokeWidth={3}
                            className="pointer-events-none absolute text-white opacity-0 peer-checked:opacity-100"
                        />
                    )}
                </div>
                {(label || description) && (
                    <div className="space-y-0.5">
                        {label && (
                            <label
                                htmlFor={fieldId}
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
    },
);
Checkbox.displayName = "Checkbox";
