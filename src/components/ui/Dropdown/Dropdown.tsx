"use client";

import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from "@headlessui/react";
import React from "react";
import { cn } from "@/lib/utils";

export interface DropdownItem {
    key: string;
    label: React.ReactNode;
    icon?: React.ComponentType<{ className?: string; size?: number }>;
    onClick?: () => void;
    href?: string;
    disabled?: boolean;
    danger?: boolean;
    separator?: boolean;
}

export interface DropdownProps {
    trigger: React.ReactElement;
    items: DropdownItem[];
    align?: "left" | "right";
    className?: string;
}

export function Dropdown({ trigger, items, align = "right", className }: DropdownProps) {
    return (
        <Menu as="div" className={cn("relative inline-block", className)}>
            <MenuButton as={React.Fragment}>{trigger}</MenuButton>
            <MenuItems
                transition
                anchor={align === "right" ? "bottom end" : "bottom start"}
                className="z-50 mt-1 min-w-[10rem] rounded-(--radius-lg) border border-(--color-border) bg-(--color-popover) p-1 shadow-lg outline-none transition-all data-[closed]:scale-95 data-[closed]:opacity-0"
            >
                {items.map((item, i) => (
                    <React.Fragment key={item.key}>
                        {item.separator && i > 0 && (
                            <div className="my-1 border-t border-(--color-border)" />
                        )}
                        <MenuItem disabled={item.disabled}>
                            {({ focus }) =>
                                item.href ? (
                                    <a
                                        href={item.href}
                                        className={cn(
                                            "flex w-full items-center gap-2 rounded-(--radius-sm) px-3 py-2 text-sm outline-none transition-colors",
                                            focus && "bg-(--color-muted)",
                                            item.danger
                                                ? "text-(--color-destructive)"
                                                : "text-(--color-foreground)",
                                            item.disabled && "pointer-events-none opacity-50",
                                        )}
                                    >
                                        {item.icon && <item.icon size={15} className="shrink-0" />}
                                        {item.label}
                                    </a>
                                ) : (
                                    <button
                                        onClick={item.onClick}
                                        disabled={item.disabled}
                                        className={cn(
                                            "flex w-full items-center gap-2 rounded-(--radius-sm) px-3 py-2 text-sm outline-none transition-colors",
                                            focus && "bg-(--color-muted)",
                                            item.danger
                                                ? "text-(--color-destructive)"
                                                : "text-(--color-foreground)",
                                            item.disabled && "pointer-events-none opacity-50",
                                        )}
                                    >
                                        {item.icon && <item.icon size={15} className="shrink-0" />}
                                        {item.label}
                                    </button>
                                )
                            }
                        </MenuItem>
                    </React.Fragment>
                ))}
            </MenuItems>
        </Menu>
    );
}
