"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { type User } from "@/data/users";
import { DataTable } from "@/components/tables/DataTable";
import { Avatar, Badge, type BadgeVariant } from "@/components/ui";
import Link from "next/link";

const ROLE_BADGE: Record<User["role"], BadgeVariant> = {
    admin: "primary",
    editor: "secondary",
    viewer: "outline",
};

const STATUS_BADGE: Record<User["status"], BadgeVariant> = {
    active: "success",
    inactive: "destructive",
    pending: "warning",
};

const columns: ColumnDef<User>[] = [
    {
        id: "name",
        header: "User",
        accessorKey: "name",
        cell: ({ row }) => (
            <Link
                href={`/users/${row.original.id}`}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
                <Avatar name={row.original.name} size="sm" />
                <div>
                    <p className="font-medium text-sm leading-tight">{row.original.name}</p>
                    <p className="text-xs text-(--color-muted-foreground)">{row.original.email}</p>
                </div>
            </Link>
        ),
    },
    {
        id: "role",
        header: "Role",
        accessorKey: "role",
        size: 100,
        cell: ({ getValue }) => (
            <Badge variant={ROLE_BADGE[getValue<User["role"]>()]}>
                {getValue<string>()}
            </Badge>
        ),
    },
    {
        id: "status",
        header: "Status",
        accessorKey: "status",
        size: 110,
        cell: ({ getValue }) => (
            <Badge variant={STATUS_BADGE[getValue<User["status"]>()]} dot>
                {getValue<string>()}
            </Badge>
        ),
    },
    {
        id: "joinedAt",
        header: "Joined",
        accessorKey: "joinedAt",
        size: 120,
        cell: ({ getValue }) => (
            <span className="text-sm text-(--color-muted-foreground) tabular-nums">
                {getValue<string>()}
            </span>
        ),
    },
];

export interface UsersTableProps {
    data: User[];
    total: number;
    page: number;
    limit: number;
}

export function UsersTable({ data, total, page, limit }: UsersTableProps) {
    return (
        <DataTable
            data={data}
            columns={columns}
            total={total}
            page={page}
            limit={limit}
            exportFilename="users"
            emptyMessage="No users found."
        />
    );
}
