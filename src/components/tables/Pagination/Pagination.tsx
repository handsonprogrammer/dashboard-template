"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
    total: number;
    page: number;
    limit: number;
    className?: string;
}

const LIMIT_OPTIONS = [10, 25, 50, 100];

function getPageNumbers(current: number, totalPages: number): (number | "...")[] {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (current <= 4) {
        return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (current >= totalPages - 3) {
        return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", current - 1, current, current + 1, "...", totalPages];
}

export function Pagination({ total, page, limit, className }: PaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);
    const pages = getPageNumbers(page, totalPages);

    function navigate(newPage: number, newLimit: number) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(newPage));
        params.set("limit", String(newLimit));
        router.push(`?${params.toString()}`);
    }

    return (
        <div className={cn("flex flex-wrap items-center justify-between gap-4 text-sm", className)}>
            {/* Left: limit selector + count */}
            <div className="flex items-center gap-2 text-(--color-muted-foreground)">
                <select
                    value={limit}
                    onChange={(e) => navigate(1, Number(e.target.value))}
                    className="rounded-(--radius) border border-(--color-border) bg-(--color-card) px-2 py-1 text-sm text-(--color-foreground) focus:outline-none focus:ring-2 focus:ring-(--color-ring)"
                    aria-label="Rows per page"
                >
                    {LIMIT_OPTIONS.map((o) => (
                        <option key={o} value={o}>
                            {o}
                        </option>
                    ))}
                </select>
                <span>
                    Showing {start}–{end} of {total}
                </span>
            </div>

            {/* Right: page buttons */}
            <div className="flex items-center gap-1">
                <button
                    onClick={() => navigate(page - 1, limit)}
                    disabled={page <= 1}
                    aria-label="Previous page"
                    className="rounded-(--radius) p-1.5 text-(--color-muted-foreground) hover:bg-(--color-muted) disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <ChevronLeft size={16} />
                </button>

                {pages.map((p, i) =>
                    p === "..." ? (
                        <span
                            key={`ellipsis-${i}`}
                            className="px-2 text-(--color-muted-foreground)"
                        >
                            …
                        </span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => navigate(p as number, limit)}
                            aria-current={p === page ? "page" : undefined}
                            className={cn(
                                "min-w-[2rem] rounded-(--radius) px-2 py-1 text-sm transition-colors",
                                p === page
                                    ? "bg-(--color-primary) text-(--color-primary-foreground)"
                                    : "text-(--color-foreground) hover:bg-(--color-muted)",
                            )}
                        >
                            {p}
                        </button>
                    ),
                )}

                <button
                    onClick={() => navigate(page + 1, limit)}
                    disabled={page >= totalPages}
                    aria-label="Next page"
                    className="rounded-(--radius) p-1.5 text-(--color-muted-foreground) hover:bg-(--color-muted) disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}
