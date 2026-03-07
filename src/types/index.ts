/** Common status values used across entities. */
export type Status = "active" | "inactive" | "pending" | "suspended";

/** Order fulfillment status. */
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

/** User roles. */
export type Role = "admin" | "editor" | "viewer";

/** Date range (used by DateRangePicker). */
export interface DateRange {
    from: Date;
    to?: Date;
}

/** Paginated response wrapper. */
export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}


/** Notification entity. */
export interface NotificationItem {
    id: string;
    title: string;
    description?: string;
    read: boolean;
    createdAt: Date;
}

/** Data point for pie/donut charts — a labeled segment with a color. */
export interface CategoryDataPoint {
    label: string;
    value: number;
    color: string; // any CSS color: "var(--color-primary)", "#3b82f6", "oklch(...)"
}
