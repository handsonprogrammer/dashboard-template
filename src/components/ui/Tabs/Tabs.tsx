"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
    key: string;
    label: React.ReactNode;
    content: React.ReactNode;
    disabled?: boolean;
}

export interface TabsProps {
    tabs: TabItem[];
    defaultTab?: string;
    onChange?: (key: string) => void;
    variant?: "underline" | "pills";
    className?: string;
}

export function Tabs({
    tabs,
    defaultTab,
    onChange,
    variant = "underline",
    className,
}: TabsProps) {
    const [active, setActive] = useState<string>(
        defaultTab ?? tabs[0]?.key ?? "",
    );

    function select(key: string) {
        setActive(key);
        onChange?.(key);
    }

    const activeTab = tabs.find((t) => t.key === active);

    return (
        <div className={cn("w-full", className)}>
            {/* Tab list */}
            <div
                role="tablist"
                aria-label="Tabs"
                className={cn(
                    variant === "underline"
                        ? "flex border-b border-(--color-border)"
                        : "flex gap-1 rounded-(--radius-lg) bg-(--color-muted) p-1",
                )}
            >
                {tabs.map((tab) => {
                    const isActive = tab.key === active;
                    return (
                        <button
                            key={tab.key}
                            role="tab"
                            aria-selected={isActive}
                            aria-controls={`panel-${tab.key}`}
                            id={`tab-${tab.key}`}
                            disabled={tab.disabled}
                            onClick={() => select(tab.key)}
                            className={cn(
                                "text-sm font-medium transition-colors outline-none disabled:pointer-events-none disabled:opacity-50",
                                variant === "underline"
                                    ? cn(
                                        "border-b-2 px-4 pb-2 pt-1 -mb-px",
                                        isActive
                                            ? "border-(--color-primary) text-(--color-primary)"
                                            : "border-transparent text-(--color-muted-foreground) hover:text-(--color-foreground)",
                                    )
                                    : cn(
                                        "rounded-(--radius) px-3 py-1.5",
                                        isActive
                                            ? "bg-(--color-card) text-(--color-foreground) shadow-sm"
                                            : "text-(--color-muted-foreground) hover:text-(--color-foreground)",
                                    ),
                            )}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab panel */}
            {activeTab && (
                <div
                    role="tabpanel"
                    id={`panel-${activeTab.key}`}
                    aria-labelledby={`tab-${activeTab.key}`}
                    className="pt-4"
                >
                    {activeTab.content}
                </div>
            )}
        </div>
    );
}
