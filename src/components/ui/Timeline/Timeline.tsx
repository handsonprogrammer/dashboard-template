import { cn } from "@/lib/utils";
import React from "react";

export interface TimelineEvent {
    id: string;
    title: string;
    description?: string;
    date?: string;
    icon?: React.ComponentType<{ className?: string; size?: number }>;
    iconColor?: string;
    dotColor?: string;
}

export interface TimelineProps {
    events: TimelineEvent[];
    className?: string;
}

export function Timeline({ events, className }: TimelineProps) {
    return (
        <ol className={cn("relative space-y-0", className)}>
            {events.map((event, i) => {
                const last = i === events.length - 1;
                return (
                    <li key={event.id} className="relative flex gap-4">
                        {/* Left column: dot + connector */}
                        <div className="flex flex-col items-center">
                            {/* Dot / icon */}
                            <div
                                className={cn(
                                    "relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-(--color-border) bg-(--color-card)",
                                    event.dotColor,
                                )}
                            >
                                {event.icon ? (
                                    <event.icon
                                        size={13}
                                        className={cn("", event.iconColor ?? "text-(--color-muted-foreground)")}
                                    />
                                ) : (
                                    <span
                                        className={cn(
                                            "h-2.5 w-2.5 rounded-full",
                                            event.dotColor ?? "bg-(--color-primary)",
                                        )}
                                    />
                                )}
                            </div>
                            {/* Connector */}
                            {!last && (
                                <div className="mt-1 w-0.5 flex-1 bg-(--color-border)" />
                            )}
                        </div>

                        {/* Content */}
                        <div className={cn("pb-6 pt-0.5 min-w-0 flex-1", last && "pb-0")}>
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-medium text-(--color-foreground)">
                                    {event.title}
                                </p>
                                {event.date && (
                                    <time className="shrink-0 text-xs text-(--color-muted-foreground)">
                                        {event.date}
                                    </time>
                                )}
                            </div>
                            {event.description && (
                                <p className="mt-1 text-sm text-(--color-muted-foreground)">
                                    {event.description}
                                </p>
                            )}
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}
