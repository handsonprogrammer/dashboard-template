"use client";

import { type Order } from "@/data/orders";
import {
    Stepper,
    Timeline,
    Card,
    CardHeader,
    CardBody,
    Badge,
    Avatar,
    type StepperStep,
    type TimelineEvent,
    type BadgeVariant,
} from "@/components/ui";

const STATUS_BADGE: Record<Order["status"], BadgeVariant> = {
    delivered: "success",
    processing: "warning",
    shipped: "primary",
    pending: "warning",
    cancelled: "destructive",
};

// Map each order status to a stepper index (or -1 for cancelled)
const STATUS_STEP_INDEX: Record<Order["status"], number> = {
    pending: 0,
    processing: 1,
    shipped: 2,
    delivered: 3,
    cancelled: -1,
};

function buildSteps(status: Order["status"]): StepperStep[] {
    const labels = [
        { id: "pending", label: "Order Placed" },
        { id: "processing", label: "Processing" },
        { id: "shipped", label: "Shipped" },
        { id: "delivered", label: "Delivered" },
    ];

    if (status === "cancelled") {
        return labels.map((l) => ({ ...l, status: "upcoming" as const }));
    }

    const activeIdx = STATUS_STEP_INDEX[status];
    return labels.map((l, i) => ({
        ...l,
        status:
            i < activeIdx
                ? ("complete" as const)
                : i === activeIdx
                    ? ("current" as const)
                    : ("upcoming" as const),
    }));
}

function buildTimeline(order: Order): TimelineEvent[] {
    const events: TimelineEvent[] = [
        {
            id: "t-placed",
            title: "Order placed",
            description: `${order.customer.name} placed this order`,
            date: order.date,
        },
        {
            id: "t-payment",
            title: "Payment confirmed",
            description: `$${order.total.toFixed(2)} payment received`,
            date: order.date,
        },
    ];

    const statusIdx = STATUS_STEP_INDEX[order.status];
    if (statusIdx >= 1 || order.status === "cancelled") {
        events.push({
            id: "t-processing",
            title: order.status === "cancelled" ? "Order cancelled" : "Processing started",
            description:
                order.status === "cancelled"
                    ? "The order was cancelled before fulfilment"
                    : "Warehouse picked and packed the items",
            date: "Next day",
        });
    }
    if (statusIdx >= 2) {
        events.push({
            id: "t-shipped",
            title: "Order shipped",
            description: "Package handed to carrier",
            date: "+2 days",
        });
    }
    if (statusIdx >= 3) {
        events.push({
            id: "t-delivered",
            title: "Delivered",
            description: "Package successfully delivered",
            date: "+5 days",
        });
    }

    return events;
}

// Mock line items based on item count
function buildLineItems(order: Order) {
    const products = [
        { name: "Wireless Headphones", sku: "WH-001", price: 49.99 },
        { name: "USB-C Hub", sku: "UH-002", price: 29.99 },
        { name: "Mechanical Keyboard", sku: "MK-003", price: 89.99 },
        { name: "Monitor Stand", sku: "MS-004", price: 34.99 },
        { name: "Webcam HD 1080p", sku: "WC-005", price: 55.00 },
        { name: "Desk Mat XL", sku: "DM-006", price: 19.99 },
        { name: "Laptop Sleeve 15\"", sku: "LS-007", price: 24.99 },
        { name: "Ring Light", sku: "RL-008", price: 39.99 },
        { name: "Ergonomic Mouse", sku: "EM-009", price: 44.99 },
    ];

    return products.slice(0, order.items).map((p, i) => ({
        ...p,
        qty: i === 0 ? Math.max(1, order.items - products.slice(0, order.items).length + 1) : 1,
    }));
}

export interface OrderDetailViewProps {
    order: Order;
}

export function OrderDetailView({ order }: OrderDetailViewProps) {
    const steps = buildSteps(order.status);
    const timeline = buildTimeline(order);
    const lineItems = buildLineItems(order);

    return (
        <div className="space-y-6 mt-6">
            {/* Summary bar */}
            <Card>
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Avatar name={order.customer.name} size="md" />
                        <div>
                            <p className="font-semibold">{order.customer.name}</p>
                            <p className="text-sm text-(--color-muted-foreground)">{order.customer.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                        <div>
                            <p className="text-(--color-muted-foreground) text-xs mb-0.5">Date</p>
                            <p className="font-medium tabular-nums">{order.date}</p>
                        </div>
                        <div>
                            <p className="text-(--color-muted-foreground) text-xs mb-0.5">Items</p>
                            <p className="font-medium tabular-nums">{order.items}</p>
                        </div>
                        <div>
                            <p className="text-(--color-muted-foreground) text-xs mb-0.5">Total</p>
                            <p className="font-semibold tabular-nums">${order.total.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-(--color-muted-foreground) text-xs mb-0.5">Status</p>
                            <Badge variant={STATUS_BADGE[order.status]} dot>{order.status}</Badge>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Fulfillment stepper */}
            {order.status !== "cancelled" && (
                <Card>
                    <CardHeader
                        title="Fulfilment Status"
                        description="Track this order through the delivery pipeline"
                    />
                    <CardBody>
                        <Stepper steps={steps} orientation="horizontal" />
                    </CardBody>
                </Card>
            )}

            {order.status === "cancelled" && (
                <Card>
                    <CardHeader title="Order cancelled" />
                    <CardBody>
                        <p className="text-sm text-(--color-muted-foreground)">
                            This order was cancelled. No items were shipped.
                        </p>
                    </CardBody>
                </Card>
            )}

            {/* Line items + timeline */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader title="Line Items" description="Products included in this order" />
                        <CardBody className="p-0 mt-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-(--color-border) text-(--color-muted-foreground)">
                                            <th className="py-3 px-5 text-left font-medium">Product</th>
                                            <th className="py-3 px-5 text-left font-medium">SKU</th>
                                            <th className="py-3 px-5 text-center font-medium">Qty</th>
                                            <th className="py-3 px-5 text-right font-medium">Price</th>
                                            <th className="py-3 px-5 text-right font-medium">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lineItems.map((item) => (
                                            <tr
                                                key={item.sku}
                                                className="border-b border-(--color-border) last:border-0"
                                            >
                                                <td className="py-3 px-5 font-medium">{item.name}</td>
                                                <td className="py-3 px-5 font-mono text-xs text-(--color-muted-foreground)">
                                                    {item.sku}
                                                </td>
                                                <td className="py-3 px-5 text-center tabular-nums">{item.qty}</td>
                                                <td className="py-3 px-5 text-right tabular-nums">
                                                    ${item.price.toFixed(2)}
                                                </td>
                                                <td className="py-3 px-5 text-right font-medium tabular-nums">
                                                    ${(item.price * item.qty).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t-2 border-(--color-border) bg-(--color-muted)/30">
                                            <td colSpan={4} className="py-3 px-5 text-right font-semibold">
                                                Order Total
                                            </td>
                                            <td className="py-3 px-5 text-right font-bold tabular-nums">
                                                ${order.total.toFixed(2)}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                <Card>
                    <CardHeader title="Order Timeline" description="Activity history" />
                    <CardBody>
                        <Timeline events={timeline} />
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
