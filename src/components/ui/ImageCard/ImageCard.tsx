import { cn } from "@/lib/utils";
import React from "react";

export interface ImageCardProps {
    src: string;
    alt: string;
    title?: string;
    description?: string;
    footer?: React.ReactNode;
    aspectRatio?: "video" | "square" | "wide";
    href?: string;
    className?: string;
}

const aspectClasses: Record<NonNullable<ImageCardProps["aspectRatio"]>, string> = {
    video: "aspect-video",
    square: "aspect-square",
    wide: "aspect-[21/9]",
};

export function ImageCard({
    src,
    alt,
    title,
    description,
    footer,
    aspectRatio = "video",
    href,
    className,
}: ImageCardProps) {
    const Wrapper = href ? "a" : "div";

    return (
        <Wrapper
            {...(href ? { href } : {})}
            className={cn(
                "overflow-hidden rounded-(--radius-lg) border border-(--color-border) bg-(--color-card)",
                href && "transition-shadow hover:shadow-md cursor-pointer",
                className,
            )}
        >
            {/* Image */}
            <div className={cn("w-full overflow-hidden bg-(--color-muted)", aspectClasses[aspectRatio])}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={src}
                    alt={alt}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
            </div>

            {/* Body */}
            {(title || description || footer) && (
                <div className="p-4 space-y-2">
                    {title && (
                        <h3 className="font-semibold text-(--color-foreground) leading-snug">{title}</h3>
                    )}
                    {description && (
                        <p className="text-sm text-(--color-muted-foreground)">{description}</p>
                    )}
                    {footer && (
                        <div className="border-t border-(--color-border) pt-3 mt-1">{footer}</div>
                    )}
                </div>
            )}
        </Wrapper>
    );
}
