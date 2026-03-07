export default function DashboardLoading() {
    return (
        <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Loading page content">
            {/* Stat card skeletons */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-28 rounded-xl bg-(--color-muted)" />
                ))}
            </div>
            {/* Chart skeleton */}
            <div className="h-72 rounded-xl bg-(--color-muted)" />
            {/* Table skeleton */}
            <div className="rounded-xl bg-(--color-muted) p-4 space-y-3">
                <div className="h-4 w-1/4 rounded bg-(--color-border)" />
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-10 rounded bg-(--color-border)" />
                ))}
            </div>
        </div>
    );
}
