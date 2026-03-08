"use client";

import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
} from "@headlessui/react";
import { X } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

export type DrawerSide = "left" | "right" | "top" | "bottom";

export interface DrawerProps {
    open: boolean;
    onClose: () => void;
    side?: DrawerSide;
    title?: string;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
    width?: string;
}

const panelClasses: Record<DrawerSide, string> = {
    right: "fixed right-0 top-0 h-full data-[closed]:translate-x-full",
    left: "fixed left-0 top-0 h-full data-[closed]:-translate-x-full",
    top: "fixed top-0 left-0 w-full data-[closed]:-translate-y-full",
    bottom: "fixed bottom-0 left-0 w-full data-[closed]:translate-y-full",
};

export function Drawer({
    open,
    onClose,
    side = "right",
    title,
    children,
    footer,
    className,
    width = "w-80",
}: DrawerProps) {
    const isVertical = side === "left" || side === "right";

    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-black/50 dark:bg-gray-900/60 backdrop-blur-sm transition-opacity data-[closed]:opacity-0"
            />
            <DialogPanel
                transition
                className={cn(
                    "flex flex-col bg-(--color-card) shadow-xl transition-transform duration-300",
                    panelClasses[side],
                    isVertical ? width : "h-1/2",
                    className,
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-(--color-border) px-5 py-4">
                    {title ? (
                        <DialogTitle className="text-base font-semibold text-(--color-foreground)">
                            {title}
                        </DialogTitle>
                    ) : (
                        <span />
                    )}
                    <button
                        onClick={onClose}
                        aria-label="Close drawer"
                        className="rounded-(--radius-sm) p-1 text-(--color-muted-foreground) hover:bg-(--color-muted) hover:text-(--color-foreground) transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

                {/* Footer */}
                {footer && (
                    <div className="border-t border-(--color-border) px-5 py-4">
                        {footer}
                    </div>
                )}
            </DialogPanel>
        </Dialog>
    );
}
