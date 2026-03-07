export default function UsersPage({
    searchParams: _searchParams,
}: {
    searchParams: Promise<{ page?: string; limit?: string }>;
}) {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Users</h1>
            {/* TODO Phase 5+6: server-paginated DataTable with Avatar, Badge, Drawer, ConfirmDialog, ExportButton */}
            <p className="text-(--color-muted-foreground)">
                Phase 6 — User management content coming soon.
            </p>
        </div>
    );
}
