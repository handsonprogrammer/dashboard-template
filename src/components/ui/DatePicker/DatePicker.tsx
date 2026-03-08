"use client";

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { format } from "date-fns";
import { CalendarDays, X } from "lucide-react";
import React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { cn } from "@/lib/utils";

export interface DatePickerProps {
    value?: Date;
    onChange?: (date: Date | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
    label?: string;
    className?: string;
}

export function DatePicker({
    value,
    onChange,
    placeholder = "Pick a date",
    disabled = false,
    label,
    className,
}: DatePickerProps) {
    return (
        <div className={cn("flex flex-col gap-1.5", className)}>
            {label && (
                <span className="text-sm font-medium text-(--color-foreground)">{label}</span>
            )}
            <Popover className="relative inline-block">
                <PopoverButton
                    disabled={disabled}
                    className={cn(
                        "flex h-10 items-center gap-2 rounded-(--radius) border border-(--color-input) bg-(--color-surface) px-3 text-sm",
                        "text-(--color-foreground) outline-none transition-colors",
                        "focus:border-(--color-ring) focus:ring-2 focus:ring-(--color-ring)/20",
                        "disabled:pointer-events-none disabled:opacity-50",
                        !value && "text-(--color-muted-foreground)",
                    )}
                >
                    <CalendarDays size={15} className="shrink-0 text-(--color-muted-foreground)" />
                    <span className="flex-1 text-left min-w-36">
                        {value ? format(value, "MMM d, yyyy") : placeholder}
                    </span>
                    {value && (
                        <span
                            role="button"
                            aria-label="Clear date"
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange?.(undefined);
                            }}
                            className="ml-1 rounded-sm p-0.5 hover:bg-(--color-muted)"
                        >
                            <X size={12} />
                        </span>
                    )}
                </PopoverButton>

                <PopoverPanel
                    anchor="bottom start"
                    className="z-50 mt-1 overflow-hidden rounded-(--radius-lg) border border-(--color-border) bg-(--color-popover) shadow-xl outline-none"
                >
                    <DayPicker
                        mode="single"
                        selected={value}
                        onSelect={onChange}
                        classNames={{
                            root: "relative p-3",
                            nav: "absolute top-3 right-3 flex items-center gap-1 z-10",
                            months: "mt-8",
                            month_caption: "py-1 font-medium text-sm text-center text-(--color-foreground)",
                            caption_label: "text-sm font-semibold",
                            button_previous: "rounded-(--radius-sm) p-1 hover:bg-(--color-muted) transition-colors",
                            button_next: "rounded-(--radius-sm) p-1 hover:bg-(--color-muted) transition-colors",
                            month_grid: "w-full border-collapse mt-2",
                            weekdays: "text-center",
                            weekday: "text-xs text-(--color-muted-foreground) pb-2 w-8",
                            week: "",
                            day: "p-0 text-center",
                            day_button: cn(
                                "h-8 w-8 rounded-(--radius-sm) text-sm text-(--color-foreground) transition-colors",
                                "hover:bg-(--color-muted)",
                                "focus:outline-none focus:ring-2 focus:ring-(--color-ring)/40",
                            ),
                            selected: "bg-(--color-primary) text-(--color-primary-foreground) rounded-(--radius-sm)",
                            today: "font-bold",
                            outside: "opacity-30",
                            disabled: "pointer-events-none opacity-30",
                        }}
                    />
                </PopoverPanel>
            </Popover>
        </div>
    );
}
