import { cn, getInitials } from "@/lib/utils";
import React from "react";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
    src?: string;
    name?: string;
    size?: AvatarSize;
    alt?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
};

export function Avatar({
    src,
    name,
    size = "md",
    alt,
    className,
    ...props
}: AvatarProps) {
    return (
        <span
            className={cn(
                "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-(--color-muted) font-medium text-(--color-muted-foreground) select-none",
                sizeClasses[size],
                className,
            )}
            {...props}
        >
            {src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={src}
                    alt={alt ?? name ?? "avatar"}
                    className="h-full w-full object-cover"
                />
            ) : name ? (
                <span aria-label={name}>{getInitials(name)}</span>
            ) : (
                <span aria-hidden="true">?</span>
            )}
        </span>
    );
}

export interface AvatarGroupProps {
    avatars: AvatarProps[];
    max?: number;
    size?: AvatarSize;
    className?: string;
}

export function AvatarGroup({
    avatars,
    max = 4,
    size = "md",
    className,
}: AvatarGroupProps) {
    const visible = avatars.slice(0, max);
    const overflow = avatars.length - max;

    return (
        <div className={cn("flex -space-x-2", className)}>
            {visible.map((avatar, i) => (
                <Avatar
                    key={i}
                    {...avatar}
                    size={size}
                    className={cn(
                        "ring-2 ring-(--color-background)",
                        avatar.className,
                    )}
                />
            ))}
            {overflow > 0 && (
                <span
                    className={cn(
                        "inline-flex shrink-0 items-center justify-center rounded-full bg-(--color-muted) font-medium text-(--color-muted-foreground) ring-2 ring-(--color-background) text-xs",
                        sizeClasses[size],
                    )}
                >
                    +{overflow}
                </span>
            )}
        </div>
    );
}
