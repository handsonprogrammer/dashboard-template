import { fetchPagedOrders } from "@/data/orders";
import { OrdersTable } from "./OrdersTable";

export default async function OrdersPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; limit?: string }>;
}) {
    const { page = "1", limit = "10" } = await searchParams;
    const { data, total } = await fetchPagedOrders(Number(page), Number(limit));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-1">Orders</h1>
                <p className="text-sm text-(--color-muted-foreground)">
                    Track and manage all customer orders and fulfillment status.
                </p>
            </div>
            <OrdersTable
                data={data}
                total={total}
                page={Number(page)}
                limit={Number(limit)}
            />
        </div>
    );
}
