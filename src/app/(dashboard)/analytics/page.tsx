import { Eye, Users, MousePointerClick, TrendingUp } from "lucide-react";
import {
    StatCard,
    Card,
    CardHeader,
    CardBody,
} from "@/components/ui";
import { LineChart, DonutChart, BarChart } from "@/components/charts";
import { revenueData, signupData, trafficSourceData } from "@/data/analytics";

const totalSignups = signupData.reduce((s, d) => s + d.signups, 0);
const totalRevenue = revenueData.reduce((s, d) => s + d.revenue, 0);
const TOTAL_SESSIONS = 18423;
const BOUNCE_RATE = 38.2;

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            {/* Heading */}
            <div>
                <h1 className="text-3xl font-bold mb-1">Analytics</h1>
                <p className="text-sm text-(--color-muted-foreground)">
                    Monitor performance metrics and user engagement trends.
                </p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Sessions"
                    value={TOTAL_SESSIONS}
                    change={9.3}
                    icon={Eye}
                    formatValue
                />
                <StatCard
                    title="New Signups"
                    value={totalSignups}
                    change={18.2}
                    icon={Users}
                    formatValue
                />
                <StatCard
                    title="Bounce Rate"
                    value={`${BOUNCE_RATE}%`}
                    change={-3.4}
                    changeLabel="vs last period"
                    icon={MousePointerClick}
                    formatValue={false}
                />
                <StatCard
                    title="Revenue"
                    value={totalRevenue}
                    unit="USD"
                    change={12.4}
                    icon={TrendingUp}
                    formatValue
                />
            </div>

            {/* Line chart + donut side-by-side */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Card noPadding>
                        <div className="p-5 pb-0">
                            <CardHeader
                                title="Signups vs Churned"
                                description="Month-over-month user growth"
                            />
                        </div>
                        <CardBody className="pt-2 pb-4 px-4">
                            <LineChart
                                data={signupData as unknown as Record<string, unknown>[]}
                                xKey="month"
                                series={[
                                    { key: "signups", label: "Signups", color: "var(--color-primary)" },
                                    { key: "churned", label: "Churned", color: "var(--color-destructive)" },
                                ]}
                                height={280}
                            />
                        </CardBody>
                    </Card>
                </div>

                <Card>
                    <CardHeader title="Traffic Sources" description="Sessions by origin" />
                    <CardBody>
                        <DonutChart data={trafficSourceData} height={220} label="Sources" />
                        <ul className="mt-4 space-y-2">
                            {trafficSourceData.map((d) => (
                                <li
                                    key={d.label}
                                    className="flex items-center justify-between text-sm"
                                >
                                    <span className="flex items-center gap-2">
                                        <span
                                            className="h-2.5 w-2.5 rounded-full shrink-0"
                                            style={{ background: d.color }}
                                        />
                                        {d.label}
                                    </span>
                                    <span className="font-medium tabular-nums">
                                        {d.value.toLocaleString()}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </CardBody>
                </Card>
            </div>

            {/* Full-width bar chart */}
            <Card noPadding>
                <div className="p-5 pb-0">
                    <CardHeader
                        title="Monthly Revenue Overview"
                        description="Revenue and expenses across the last 12 months"
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
                        height={300}
                    />
                </CardBody>
            </Card>
        </div>
    );
}
