import { fetchPagedUsers } from "@/data/users";
import { UsersTable } from "./UsersTable";

export default async function UsersPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; limit?: string }>;
}) {
    const { page = "1", limit = "10" } = await searchParams;
    const { data, total } = await fetchPagedUsers(Number(page), Number(limit));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-1">Users</h1>
                <p className="text-sm text-(--color-muted-foreground)">
                    Manage your team members, roles, and account status.
                </p>
            </div>
            <UsersTable
                data={data}
                total={total}
                page={Number(page)}
                limit={Number(limit)}
            />
        </div>
    );
}
