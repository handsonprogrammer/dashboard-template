export default function OrdersPage({
    searchParams: _searchParams,
}: {
    searchParams: Promise<{ page?: string; limit?: string }>;
}) {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Orders</h1>
            {/* TODO Phase 5+6: server-paginated DataTable with Badge, Avatar, ExportButton */}
            <p className="text-(--color-muted-foreground)">
                Phase 6 — Order management content coming soon.
            </p>
        </div>
    );
}
