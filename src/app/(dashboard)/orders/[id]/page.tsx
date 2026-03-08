import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { fetchOrderById } from "@/data/orders";
import { OrderDetailView } from "./OrderDetailView";

export default async function OrderDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const order = await fetchOrderById(id);

    if (!order) notFound();

    return (
        <div>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm text-(--color-muted-foreground) mb-6">
                <Link href="/orders" className="hover:text-(--color-foreground) transition-colors">
                    Orders
                </Link>
                <ChevronRight size={14} />
                <span className="text-(--color-foreground) font-mono font-medium">{order.id}</span>
            </nav>

            <h1 className="text-3xl font-bold">Order {order.id}</h1>
            <p className="text-sm text-(--color-muted-foreground) mt-1">
                Placed on {order.date} · {order.items} item{order.items !== 1 ? "s" : ""}
            </p>

            <OrderDetailView order={order} />
        </div>
    );
}
