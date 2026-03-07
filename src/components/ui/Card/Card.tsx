import { cn } from "@/lib/utils";
import React from "react";

/* ─── Base Card ─────────────────────────────────────────────────── */

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    noPadding?: boolean;
}

export function Card({ children, noPadding, className, ...props }: CardProps) {
    return (
        <div
            className={cn(
                "rounded-(--radius-lg) border border-(--color-border) bg-(--color-card) text-(--color-card-foreground) shadow-sm",
                !noPadding && "p-5",
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}

/* ─── CardHeader ────────────────────────────────────────────────── */

export interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: React.ReactNode;
}

export function CardHeader({
    title,
    description,
    action,
    children,
    className,
    ...props
}: CardHeaderProps) {
    return (
        <div
            className={cn("flex items-start justify-between gap-4", className)}
            {...props}
        >
            <div className="space-y-1 min-w-0">
                {title && (
                    <h3 className="font-semibold leading-snug text-(--color-foreground)">
                        {title}
                    </h3>
                )}
                {description && (
                    <p className="text-sm text-(--color-muted-foreground)">{description}</p>
                )}
                {children}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}

/* ─── CardBody ──────────────────────────────────────────────────── */

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> { }

export function CardBody({ className, children, ...props }: CardBodyProps) {
    return (
        <div className={cn("mt-4", className)} {...props}>
            {children}
        </div>
    );
}

/* ─── CardFooter ────────────────────────────────────────────────── */

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> { }

export function CardFooter({ className, children, ...props }: CardFooterProps) {
    return (
        <div
            className={cn(
                "mt-4 flex items-center justify-between gap-2 border-t border-(--color-border) pt-4",
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}
