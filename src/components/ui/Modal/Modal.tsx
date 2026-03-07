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
import { Button } from "@/components/ui/Button/Button";

export interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    size?: "sm" | "md" | "lg" | "xl" | "full";
    children?: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
}

const sizeClasses: Record<NonNullable<ModalProps["size"]>, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full m-4",
};

export function Modal({
    open,
    onClose,
    title,
    description,
    size = "md",
    children,
    footer,
    className,
}: ModalProps) {
    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity data-[closed]:opacity-0"
            />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel
                    transition
                    className={cn(
                        "w-full rounded-(--radius-xl) bg-(--color-card) shadow-xl transition-all data-[closed]:scale-95 data-[closed]:opacity-0",
                        sizeClasses[size],
                        className,
                    )}
                >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 border-b border-(--color-border) px-6 py-4">
                        <div className="space-y-1">
                            {title && (
                                <DialogTitle className="text-base font-semibold text-(--color-foreground)">
                                    {title}
                                </DialogTitle>
                            )}
                            {description && (
                                <p className="text-sm text-(--color-muted-foreground)">
                                    {description}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            aria-label="Close"
                            className="mt-0.5 shrink-0 rounded-(--radius-sm) p-1 text-(--color-muted-foreground) hover:bg-(--color-muted) hover:text-(--color-foreground) transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Body */}
                    {children && (
                        <div className="px-6 py-4">{children}</div>
                    )}

                    {/* Footer */}
                    {footer && (
                        <div className="flex items-center justify-end gap-2 border-t border-(--color-border) px-6 py-4">
                            {footer}
                        </div>
                    )}
                </DialogPanel>
            </div>
        </Dialog>
    );
}

/* ─── Confirm Dialog ────────────────────────────────────────────── */

export interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "destructive" | "primary";
    loading?: boolean;
}

export function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    title = "Are you sure?",
    description = "This action cannot be undone.",
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    variant = "destructive",
    loading = false,
}: ConfirmDialogProps) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            title={title}
            description={description}
            size="sm"
            footer={
                <>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        {cancelLabel}
                    </Button>
                    <Button variant={variant} onClick={onConfirm} loading={loading}>
                        {confirmLabel}
                    </Button>
                </>
            }
        />
    );
}
