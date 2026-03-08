import Link from "next/link";
import { DollarSign, Users, ShoppingCart, BarChart2 } from "lucide-react";
import {
    StatCard,
    Card,
    CardHeader,
    CardBody,
    Badge,
    Timeline,
    type TimelineEvent,
    type BadgeVariant,
} from "@/components/ui";
import { AreaChart, BarChart } from "@/components/charts";
import { revenueData } from "@/data/analytics";
import { fetchPagedOrders, type Order } from "@/data/orders";

const ORDER_STATUS_BADGE: Record<Order["status"], BadgeVariant> = {
    delivered: "success",
    processing: "warning",
    shipped: "primary",
    pending: "warning",
    cancelled: "destructive",
};

const activityEvents: TimelineEvent[] = [
    { id: "1", title: "New user registered", description: "Tina Young joined as a viewer", date: "2 min ago" },
    { id: "2", title: "Order #ord-1022 delivered", description: "Customer received their package", date: "18 min ago" },
    { id: "3", title: "Export completed", description: "orders-dec-2025.csv downloaded", date: "1h ago" },
    { id: "4", title: "Admin login", description: "Karen Davis signed in from London", date: "3h ago" },
    { id: "5", title: "New order placed", description: "#ord-1023 — $215.00 by Noah Harris", date: "5h ago" },
];

const totalRevenue = revenueData.reduce((s, d) => s + d.revenue, 0);
const TOTAL_USERS = 25;

export default async function AdminPage() {
    const { data: recentOrders, total: totalOrders } = await fetchPagedOrders(1, 5);
    const avgOrderValue = totalRevenue / totalOrders;

    return (
        <div className="space-y-6">
            {/* Heading */}
            <div>
                <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
                <p className="text-sm text-(--color-muted-foreground)">
                    Overview of your platform&apos;s key metrics.
                </p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Revenue"
                    value={totalRevenue}
                    unit="USD"
                    change={12.4}
                    icon={DollarSign}
                    formatValue
                />
                <StatCard
                    title="Active Users"
                    value={TOTAL_USERS}
                    change={8.1}
                    icon={Users}
                    formatValue={false}
                />
                <StatCard
                    title="Total Orders"
                    value={totalOrders}
                    change={5.3}
                    icon={ShoppingCart}
                    formatValue={false}
                />
                <StatCard
                    title="Avg Order Value"
                    value={avgOrderValue}
                    unit="USD"
                    change={-2.1}
                    icon={BarChart2}
                    formatValue
                />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Card noPadding>
                    <div className="p-5 pb-0">
                        <CardHeader
                            title="Revenue vs Expenses"
                            description="Last 12 months"
                        />
                    </div>
                    <CardBody className="pt-2 pb-4 px-4">
                        <AreaChart
                            data={revenueData as unknown as Record<string, unknown>[]}
                            xKey="month"
                            series={[
                                { key: "revenue", label: "Revenue", color: "var(--color-primary)" },
                                { key: "expenses", label: "Expenses", color: "oklch(0.65 0.15 30)" },
                            ]}
                            height={260}
                        />
                    </CardBody>
                </Card>
                <Card noPadding>
                    <div className="p-5 pb-0">
                        <CardHeader
                            title="Monthly Breakdown"
                            description="Revenue and expenses by month"
                        />
                    </div>
                    <CardBody className="pt-2 pb-4 px-4">
                        <BarChart
                            data={revenueData as unknown as Record<string, unknown>[]}
                            xKey="month"
                            series={[
                                { key: "revenue", label: "Revenue", color: "var(--color-primary)" },
                                { key: "expenses", label: "Expenses", color: "oklch(0.65 0.15 30)" },
                            ]}
                            height={260}
                        />
                    </CardBody>
                </Card>
            </div>

            {/* Recent orders + activity timeline */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* Recent orders table */}
                <div className="lg:col-span-2">
                    <Card noPadding>
                        <div className="p-5 pb-0">
                            <CardHeader
                                title="Recent Orders"
                                action={
                                    <Link
                                        href="/orders"
                                        className="text-sm text-(--color-primary) hover:underline"
                                    >
                                        View all →
                                    </Link>
                                }
                            />
                        </div>
                        <div className="mt-4 overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-(--color-border) text-(--color-muted-foreground)">
                                        <th className="py-3 px-5 text-left font-medium">Order</th>
                                        <th className="py-3 px-5 text-left font-medium">Customer</th>
                                        <th className="py-3 px-5 text-left font-medium">Status</th>
                                        <th className="py-3 px-5 text-right font-medium">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="border-b border-(--color-border) last:border-0 hover:bg-(--color-muted)/40 transition-colors"
                                        >
                                            <td className="py-3 px-5 font-mono text-xs text-(--color-muted-foreground)">
                                                {order.id}
                                            </td>
                                            <td className="py-3 px-5">{order.customer.name}</td>
                                            <td className="py-3 px-5">
                                                <Badge
                                                    variant={ORDER_STATUS_BADGE[order.status]}
                                                    dot
                                                >
                                                    {order.status}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-5 text-right font-medium">
                                                ${order.total.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Activity timeline */}
                <Card>
                    <CardHeader title="Recent Activity" />
                    <CardBody>
                        <Timeline events={activityEvents} />
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
