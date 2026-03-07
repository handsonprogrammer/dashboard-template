import { cn } from "@/lib/utils";
import React from "react";

export interface RadioOption {
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
}

export interface RadioGroupProps {
    name: string;
    options: RadioOption[];
    value?: string;
    onChange?: (value: string) => void;
    label?: string;
    error?: string;
    orientation?: "vertical" | "horizontal";
    className?: string;
}

export function RadioGroup({
    name,
    options,
    value,
    onChange,
    label,
    error,
    orientation = "vertical",
    className,
}: RadioGroupProps) {
    return (
        <fieldset className={cn("space-y-2", className)}>
            {label && (
                <legend className="mb-3 text-sm font-medium text-(--color-foreground)">
                    {label}
                </legend>
            )}
            <div
                role="radiogroup"
                className={cn(
                    orientation === "horizontal" ? "flex flex-wrap gap-4" : "space-y-3",
                )}
            >
                {options.map((opt) => {
                    const optId = `${name}-${opt.value}`;
                    const checked = value === opt.value;
                    return (
                        <label
                            key={opt.value}
                            htmlFor={optId}
                            className={cn(
                                "flex cursor-pointer items-start gap-3",
                                opt.disabled && "pointer-events-none opacity-50",
                            )}
                        >
                            <div className="relative mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
                                <input
                                    type="radio"
                                    id={optId}
                                    name={name}
                                    value={opt.value}
                                    checked={checked}
                                    disabled={opt.disabled}
                                    onChange={() => onChange?.(opt.value)}
                                    className={cn(
                                        "h-4 w-4 appearance-none rounded-full border-2 border-(--color-input)",
                                        "checked:border-(--color-primary)",
                                        "focus:outline-none focus:ring-2 focus:ring-(--color-ring)/30",
                                        "transition-colors",
                                    )}
                                />
                                {checked && (
                                    <span className="pointer-events-none absolute h-2 w-2 rounded-full bg-(--color-primary)" />
                                )}
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-sm font-medium text-(--color-foreground)">
                                    {opt.label}
                                </span>
                                {opt.description && (
                                    <p className="text-xs text-(--color-muted-foreground)">
                                        {opt.description}
                                    </p>
                                )}
                            </div>
                        </label>
                    );
                })}
            </div>
            {error && (
                <p className="mt-1 text-xs text-(--color-destructive)">{error}</p>
            )}
        </fieldset>
    );
}

export type { RadioOption as Radio };
