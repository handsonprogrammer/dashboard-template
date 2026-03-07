import { cn } from "@/lib/utils";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import React from "react";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

export interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    showHome?: boolean;
    className?: string;
}

export function Breadcrumbs({ items, showHome = false, className }: BreadcrumbsProps) {
    const all: BreadcrumbItem[] = showHome
        ? [{ label: "Home", href: "/" }, ...items]
        : items;

    return (
        <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1 text-sm", className)}>
            {showHome && (
                <Link
                    href="/"
                    className="text-(--color-muted-foreground) hover:text-(--color-foreground) transition-colors"
                    aria-label="Home"
                >
                    <Home size={14} />
                </Link>
            )}
            {all.map((item, i) => {
                const isLast = i === all.length - 1;
                if (showHome && i === 0) return null; // already rendered the Home icon

                return (
                    <React.Fragment key={i}>
                        {i > 0 && (
                            <ChevronRight
                                size={14}
                                className="shrink-0 text-(--color-muted-foreground)"
                                aria-hidden="true"
                            />
                        )}
                        {item.href && !isLast ? (
                            <Link
                                href={item.href}
                                className="text-(--color-muted-foreground) hover:text-(--color-foreground) transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span
                                aria-current={isLast ? "page" : undefined}
                                className={cn(
                                    isLast
                                        ? "font-medium text-(--color-foreground)"
                                        : "text-(--color-muted-foreground)",
                                )}
                            >
                                {item.label}
                            </span>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
}
