"use client";

import React, { useEffect, useState } from "react";
import { Command } from "cmdk";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export interface CommandItem {
    id: string;
    label: string;
    description?: string;
    icon?: React.ComponentType<{ className?: string; size?: number }>;
    href?: string;
    onSelect?: () => void;
    group?: string;
}

export interface CommandPaletteProps {
    items?: CommandItem[];
    placeholder?: string;
}

const DEFAULT_ITEMS: CommandItem[] = [
    { id: "admin", label: "Admin Dashboard", href: "/admin", group: "Pages" },
    { id: "analytics", label: "Analytics", href: "/analytics", group: "Pages" },
    { id: "users", label: "Users", href: "/users", group: "Pages" },
    { id: "orders", label: "Orders", href: "/orders", group: "Pages" },
    { id: "comp", label: "Components", href: "/components", group: "Pages" },
];

export function CommandPalette({ items = DEFAULT_ITEMS, placeholder = "Search…" }: CommandPaletteProps) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    // ⌘K / Ctrl+K
    useEffect(() => {
        function handler(e: KeyboardEvent) {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setOpen((v) => !v);
            }
        }
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    function run(item: CommandItem) {
        setOpen(false);
        if (item.onSelect) item.onSelect();
        else if (item.href) router.push(item.href);
    }

    // Group items
    const groups: Record<string, CommandItem[]> = {};
    for (const item of items) {
        const g = item.group ?? "Actions";
        (groups[g] ??= []).push(item);
    }

    return (
        <>
            {/* Trigger button (slotted into Header) */}
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="rounded-md p-2 text-(--color-muted-foreground) hover:bg-(--color-muted) hover:text-(--color-foreground) transition-colors"
                aria-label="Open command palette (⌘K)"
            >
                <Search className="h-5 w-5" />
            </button>

            <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity data-[closed]:opacity-0"
                />
                <div className="fixed inset-0 flex items-start justify-center pt-[10vh] p-4">
                    <DialogPanel
                        transition
                        className="w-full max-w-lg overflow-hidden rounded-(--radius-xl) border border-(--color-border) bg-(--color-popover) shadow-2xl transition-all data-[closed]:scale-95 data-[closed]:opacity-0"
                    >
                        <Command className="flex flex-col" shouldFilter>
                            {/* Search input */}
                            <div className="flex items-center gap-3 border-b border-(--color-border) px-4 py-3">
                                <Search size={16} className="shrink-0 text-(--color-muted-foreground)" />
                                <Command.Input
                                    placeholder={placeholder}
                                    className="flex-1 bg-transparent text-sm text-(--color-foreground) outline-none placeholder:text-(--color-muted-foreground)"
                                />
                            </div>

                            <Command.List className="max-h-72 overflow-y-auto p-2 text-sm">
                                <Command.Empty className="py-8 text-center text-(--color-muted-foreground)">
                                    No results found.
                                </Command.Empty>

                                {Object.entries(groups).map(([groupName, groupItems]) => (
                                    <Command.Group
                                        key={groupName}
                                        heading={groupName}
                                        className="[&_[cmdk-group-heading]]:mb-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-(--color-muted-foreground) [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide"
                                    >
                                        {groupItems.map((item) => (
                                            <Command.Item
                                                key={item.id}
                                                value={item.label}
                                                onSelect={() => run(item)}
                                                className={cn(
                                                    "flex cursor-pointer items-center gap-2 rounded-(--radius-sm) px-3 py-2 text-(--color-foreground) outline-none transition-colors",
                                                    "aria-selected:bg-(--color-muted)",
                                                )}
                                            >
                                                {item.icon && <item.icon size={15} className="shrink-0 text-(--color-muted-foreground)" />}
                                                <span className="flex-1">{item.label}</span>
                                                {item.description && (
                                                    <span className="text-xs text-(--color-muted-foreground)">{item.description}</span>
                                                )}
                                            </Command.Item>
                                        ))}
                                    </Command.Group>
                                ))}
                            </Command.List>
                        </Command>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
}
