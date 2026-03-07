import type { PaginatedResult } from "@/types";
import { sleep } from "@/lib/utils";
import usersData from "./users.json";

export interface User {
    id: string;
    name: string;
    email: string;
    role: "admin" | "editor" | "viewer";
    status: "active" | "inactive" | "pending";
    joinedAt: string;
    avatarUrl?: string;
}

export async function fetchPagedUsers(
    page: number,
    limit: number
): Promise<PaginatedResult<User>> {
    await sleep(200);
    const start = (page - 1) * limit;
    return {
        data: (usersData as User[]).slice(start, start + limit),
        total: usersData.length,
        page,
        limit,
    };
}

export async function fetchUserById(id: string): Promise<User | undefined> {
    await sleep(150);
    return (usersData as User[]).find((u) => u.id === id);
}
