import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";
import React from "react";

export interface EmptyStateProps {
    icon?: React.ComponentType<{ className?: string; size?: number }>;
    title?: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

export function EmptyState({
    icon: Icon = Inbox,
    title = "Nothing here yet",
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center gap-3 py-16 text-center",
                className,
            )}
        >
            <div className="rounded-full bg-(--color-muted) p-4">
                <Icon size={28} className="text-(--color-muted-foreground)" />
            </div>
            <div className="space-y-1">
                <p className="font-semibold text-(--color-foreground)">{title}</p>
                {description && (
                    <p className="text-sm text-(--color-muted-foreground)">{description}</p>
                )}
            </div>
            {action && <div className="mt-1">{action}</div>}
        </div>
    );
}
