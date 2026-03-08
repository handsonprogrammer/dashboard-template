"use client";

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { format } from "date-fns";
import { CalendarDays, X } from "lucide-react";
import React from "react";
import { DayPicker, DateRange as DayPickerDateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { cn } from "@/lib/utils";

export type DateRange = DayPickerDateRange;

export interface DateRangePickerProps {
    value?: DateRange;
    onChange?: (range: DateRange | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export function DateRangePicker({
    value,
    onChange,
    placeholder = "Pick a date range",
    disabled = false,
    className,
}: DateRangePickerProps) {
    function formatRange(range?: DateRange) {
        if (!range?.from) return placeholder;
        if (!range.to) return format(range.from, "MMM d, yyyy");
        return `${format(range.from, "MMM d")} – ${format(range.to, "MMM d, yyyy")}`;
    }

    return (
        <Popover className={cn("relative inline-block", className)}>
            <PopoverButton
                disabled={disabled}
                className={cn(
                    "flex h-10 items-center gap-2 rounded-(--radius) border border-(--color-input) bg-(--color-surface) px-3 text-sm",
                    "text-(--color-foreground) outline-none transition-colors",
                    "focus:border-(--color-ring) focus:ring-2 focus:ring-(--color-ring)/20",
                    "disabled:pointer-events-none disabled:opacity-50",
                    !value?.from && "text-(--color-muted-foreground)",
                )}
            >
                <CalendarDays size={15} className="shrink-0 text-(--color-muted-foreground)" />
                <span className="flex-1 text-left">{formatRange(value)}</span>
                {value?.from && (
                    <span
                        role="button"
                        aria-label="Clear date range"
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
                    mode="range"
                    selected={value}
                    onSelect={onChange}
                    numberOfMonths={2}
                    classNames={{
                        root: "relative p-3",
                        nav: "absolute top-3 right-3 flex items-center gap-1 z-10",
                        months: "flex gap-4 mt-8",
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
                        selected: "bg-(--color-primary)/20",
                        range_start: "rounded-l-(--radius-sm) bg-(--color-primary) text-(--color-primary-foreground)",
                        range_end: "rounded-r-(--radius-sm) bg-(--color-primary) text-(--color-primary-foreground)",
                        range_middle: "rounded-none bg-(--color-primary)/10",
                        today: "font-bold",
                        outside: "opacity-30",
                        disabled: "pointer-events-none opacity-30",
                    }}
                />
            </PopoverPanel>
        </Popover>
    );
}
