import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely, resolving conflicts. */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

/** Format a number as a compact locale string (e.g., 1 200 000 → 1.2M). */
export function formatNumber(
    value: number,
    locale = "en-US",
    options?: Intl.NumberFormatOptions
): string {
    return new Intl.NumberFormat(locale, options).format(value);
}

/** Return initials from a full name (up to 2 chars). */
export function getInitials(name: string): string {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("");
}

/** Truncate a string to the given length, appending "…". */
export function truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength - 1) + "…";
}

/** Sleep for `ms` milliseconds (useful in mock data loaders). */
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
