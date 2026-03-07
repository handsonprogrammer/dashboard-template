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
