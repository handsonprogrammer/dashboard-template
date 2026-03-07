import { cn } from "@/lib/utils";
import {
    AlertCircle,
    AlertTriangle,
    CheckCircle2,
    Info,
    X,
} from "lucide-react";
import React from "react";

export type AlertVariant = "info" | "success" | "warning" | "destructive";

export interface AlertProps {
    variant?: AlertVariant;
    title?: string;
    children: React.ReactNode;
    onDismiss?: () => void;
    className?: string;
}

const variantConfig: Record<
    AlertVariant,
    { container: string; icon: React.ComponentType<{ className?: string; size?: number }>; iconClass: string }
> = {
    info: {
        container:
            "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200",
        icon: Info,
        iconClass: "text-blue-500 dark:text-blue-400",
    },
    success: {
        container:
            "bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-200",
        icon: CheckCircle2,
        iconClass: "text-emerald-500 dark:text-emerald-400",
    },
    warning: {
        container:
            "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-200",
        icon: AlertTriangle,
        iconClass: "text-amber-500 dark:text-amber-400",
    },
    destructive: {
        container:
            "bg-red-50 border-red-200 text-red-900 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200",
        icon: AlertCircle,
        iconClass: "text-red-500 dark:text-red-400",
    },
};

export function Alert({
    variant = "info",
    title,
    children,
    onDismiss,
    className,
}: AlertProps) {
    const { container, icon: Icon, iconClass } = variantConfig[variant];

    return (
        <div
            role="alert"
            className={cn(
                "flex gap-3 rounded-(--radius) border p-4 text-sm",
                container,
                className,
            )}
        >
            <Icon size={18} className={cn("mt-0.5 shrink-0", iconClass)} />
            <div className="flex-1 space-y-1">
                {title && <p className="font-semibold">{title}</p>}
                <div>{children}</div>
            </div>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    aria-label="Dismiss"
                    className="ml-auto shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
}
