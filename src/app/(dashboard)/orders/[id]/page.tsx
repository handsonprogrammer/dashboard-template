export default function OrderDetailPage({
    params: _params,
}: {
    params: Promise<{ id: string }>;
}) {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Order Detail</h1>
            {/* TODO Phase 6: fulfillment Stepper, line-items table, Timeline */}
            <p className="text-(--color-muted-foreground)">
                Phase 6 — Order detail content coming soon.
            </p>
        </div>
    );
}
