"use client";

import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";

export type TooltipPlacement = "top" | "right" | "bottom" | "left";

export interface TooltipProps {
    content: React.ReactNode;
    placement?: TooltipPlacement;
    delay?: number;
    children: React.ReactElement;
    className?: string;
}

const placementClasses: Record<TooltipPlacement, { tooltip: string; arrow: string }> = {
    top: {
        tooltip: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        arrow: "top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-(--color-popover)",
    },
    bottom: {
        tooltip: "top-full left-1/2 -translate-x-1/2 mt-2",
        arrow: "bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-(--color-popover)",
    },
    left: {
        tooltip: "right-full top-1/2 -translate-y-1/2 mr-2",
        arrow: "left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-(--color-popover)",
    },
    right: {
        tooltip: "left-full top-1/2 -translate-y-1/2 ml-2",
        arrow: "right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-(--color-popover)",
    },
};

export function Tooltip({
    content,
    placement = "top",
    delay = 200,
    children,
    className,
}: TooltipProps) {
    const [visible, setVisible] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

    const show = () => {
        timer.current = setTimeout(() => setVisible(true), delay);
    };
    const hide = () => {
        clearTimeout(timer.current);
        setVisible(false);
    };

    const { tooltip, arrow } = placementClasses[placement];

    return (
        <span
            className="relative inline-flex"
            onMouseEnter={show}
            onMouseLeave={hide}
            onFocus={show}
            onBlur={hide}
        >
            {children}
            {visible && (
                <span
                    role="tooltip"
                    className={cn(
                        "pointer-events-none absolute z-50 whitespace-nowrap rounded-(--radius-sm) bg-(--color-popover) px-2.5 py-1.5 text-xs text-(--color-popover-foreground) shadow-md",
                        tooltip,
                        className,
                    )}
                >
                    {content}
                    <span
                        className={cn(
                            "absolute h-0 w-0 border-4",
                            arrow,
                        )}
                    />
                </span>
            )}
        </span>
    );
}
