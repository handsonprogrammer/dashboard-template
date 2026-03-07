import { cn, truncate } from "@/lib/utils";
import React from "react";

export interface TextCardProps {
    title: string;
    body: string;
    tag?: string;
    date?: string;
    footer?: React.ReactNode;
    maxBodyLength?: number;
    href?: string;
    className?: string;
}

export function TextCard({
    title,
    body,
    tag,
    date,
    footer,
    maxBodyLength = 160,
    href,
    className,
}: TextCardProps) {
    const Wrapper = href ? "a" : "div";

    return (
        <Wrapper
            {...(href ? { href } : {})}
            className={cn(
                "flex flex-col gap-3 rounded-(--radius-lg) border border-(--color-border) bg-(--color-card) p-5",
                href && "transition-shadow hover:shadow-md cursor-pointer",
                className,
            )}
        >
            {/* Tag + date row */}
            {(tag || date) && (
                <div className="flex items-center justify-between gap-2 text-xs text-(--color-muted-foreground)">
                    {tag && (
                        <span className="rounded-full bg-(--color-muted) px-2 py-0.5 font-medium">
                            {tag}
                        </span>
                    )}
                    {date && <span className="ml-auto">{date}</span>}
                </div>
            )}

            <div className="space-y-1.5">
                <h3 className="font-semibold leading-snug text-(--color-foreground)">{title}</h3>
                <p className="text-sm text-(--color-muted-foreground) leading-relaxed">
                    {truncate(body, maxBodyLength)}
                </p>
            </div>

            {footer && (
                <div className="mt-auto border-t border-(--color-border) pt-3">
                    {footer}
                </div>
            )}
        </Wrapper>
    );
}
