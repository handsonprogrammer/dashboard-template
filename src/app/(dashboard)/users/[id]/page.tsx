export default function UserDetailPage({
    params: _params,
}: {
    params: Promise<{ id: string }>;
}) {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">User Detail</h1>
            {/* TODO Phase 6: Tabs (Profile / Activity / Settings) */}
            <p className="text-(--color-muted-foreground)">
                Phase 6 — User detail content coming soon.
            </p>
        </div>
    );
}
