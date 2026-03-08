import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { fetchUserById } from "@/data/users";
import { UserDetailTabs } from "../UserDetailTabs";

export default async function UserDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const user = await fetchUserById(id);

    if (!user) notFound();

    return (
        <div>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm text-(--color-muted-foreground) mb-6">
                <Link href="/users" className="hover:text-(--color-foreground) transition-colors">
                    Users
                </Link>
                <ChevronRight size={14} />
                <span className="text-(--color-foreground) font-medium">{user.name}</span>
            </nav>

            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-sm text-(--color-muted-foreground) mt-1">
                User ID: <span className="font-mono">{user.id}</span>
            </p>

            <UserDetailTabs user={user} />
        </div>
    );
}
