import type { PaginatedResult } from "@/types";
import { sleep } from "@/lib/utils";
import ordersData from "./orders.json";

export interface Order {
    id: string;
    customer: { name: string; email: string; avatarUrl?: string };
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    total: number;
    items: number;
    date: string;
}

export async function fetchPagedOrders(
    page: number,
    limit: number
): Promise<PaginatedResult<Order>> {
    await sleep(200);
    const start = (page - 1) * limit;
    return {
        data: (ordersData as Order[]).slice(start, start + limit),
        total: ordersData.length,
        page,
        limit,
    };
}

export async function fetchOrderById(id: string): Promise<Order | undefined> {
    await sleep(150);
    return (ordersData as Order[]).find((o) => o.id === id);
}
