"use client";

import {
    Popover,
    PopoverButton,
    PopoverPanel,
} from "@headlessui/react";
import { Bell, CheckCheck } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import {
    useNotifications,
} from "@/contexts/NotificationContext";

export function NotificationBell() {
    const { notifications, unreadCount, markRead, markAllRead } = useNotifications();

    return (
        <Popover className="relative">
            <PopoverButton
                className="relative rounded-md p-2 text-(--color-muted-foreground) hover:bg-(--color-muted) hover:text-(--color-foreground) transition-colors outline-none"
                aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-(--color-primary) text-[10px] font-bold text-(--color-primary-foreground) leading-none">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </PopoverButton>

            <PopoverPanel
                transition
                anchor="bottom end"
                className="z-50 mt-2 w-80 rounded-(--radius-lg) border border-(--color-border) bg-(--color-popover) shadow-xl outline-none transition-all data-[closed]:scale-95 data-[closed]:opacity-0"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-(--color-border) px-4 py-3">
                    <p className="text-sm font-semibold text-(--color-foreground)">Notifications</p>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllRead}
                            className="flex items-center gap-1 text-xs text-(--color-primary) hover:underline"
                        >
                            <CheckCheck size={13} />
                            Mark all read
                        </button>
                    )}
                </div>

                {/* List */}
                <ul className="max-h-80 divide-y divide-(--color-border) overflow-y-auto">
                    {notifications.length === 0 ? (
                        <li className="py-10 text-center text-sm text-(--color-muted-foreground)">
                            No notifications
                        </li>
                    ) : (
                        notifications.map((n) => (
                            <li
                                key={n.id}
                                className={cn(
                                    "flex gap-3 px-4 py-3 text-sm transition-colors cursor-default",
                                    !n.read && "bg-(--color-muted)/40",
                                )}
                                onClick={() => markRead(n.id)}
                            >
                                {!n.read && (
                                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-(--color-primary)" />
                                )}
                                <div className={cn("space-y-0.5", n.read && "ml-5")}>
                                    <p className="font-medium text-(--color-foreground)">{n.title}</p>
                                    {n.description && (
                                        <p className="text-xs text-(--color-muted-foreground)">{n.description}</p>
                                    )}
                                    <p className="text-xs text-(--color-muted-foreground)">
                                        {new Date(n.createdAt).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </PopoverPanel>
        </Popover>
    );
}
