"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface ThemeToggleProps {
    className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <div
                className={cn(
                    "h-9 w-9 rounded-md bg-(--color-muted) animate-pulse",
                    className,
                )}
                aria-hidden="true"
            />
        );
    }

    const isDark = resolvedTheme === "dark";

    return (
        <button
            type="button"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={cn(
                "rounded-md p-2 text-(--color-muted-foreground) hover:bg-(--color-muted) hover:text-(--color-foreground) transition-colors",
                className,
            )}
        >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
    );
}
