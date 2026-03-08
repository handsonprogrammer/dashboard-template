"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { type Order } from "@/data/orders";
import { DataTable } from "@/components/tables/DataTable";
import { Avatar, Badge, type BadgeVariant } from "@/components/ui";
import Link from "next/link";

const STATUS_BADGE: Record<Order["status"], BadgeVariant> = {
    delivered: "success",
    processing: "warning",
    shipped: "primary",
    pending: "warning",
    cancelled: "destructive",
};

const columns: ColumnDef<Order>[] = [
    {
        id: "id",
        header: "Order ID",
        accessorKey: "id",
        size: 120,
        cell: ({ getValue, row }) => (
            <Link
                href={`/orders/${row.original.id}`}
                className="font-mono text-xs text-(--color-primary) hover:underline"
            >
                {getValue<string>()}
            </Link>
        ),
    },
    {
        id: "customer",
        header: "Customer",
        accessorFn: (row) => row.customer.name,
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <Avatar name={row.original.customer.name} size="sm" />
                <div>
                    <p className="font-medium text-sm leading-tight">{row.original.customer.name}</p>
                    <p className="text-xs text-(--color-muted-foreground)">{row.original.customer.email}</p>
                </div>
            </div>
        ),
    },
    {
        id: "status",
        header: "Status",
        accessorKey: "status",
        size: 130,
        cell: ({ getValue }) => (
            <Badge variant={STATUS_BADGE[getValue<Order["status"]>()]} dot>
                {getValue<string>()}
            </Badge>
        ),
    },
    {
        id: "items",
        header: "Items",
        accessorKey: "items",
        size: 80,
        cell: ({ getValue }) => (
            <span className="text-sm tabular-nums">{getValue<number>()} item{getValue<number>() !== 1 ? "s" : ""}</span>
        ),
    },
    {
        id: "total",
        header: "Total",
        accessorKey: "total",
        size: 110,
        cell: ({ getValue }) => (
            <span className="font-medium tabular-nums">${getValue<number>().toFixed(2)}</span>
        ),
    },
    {
        id: "date",
        header: "Date",
        accessorKey: "date",
        size: 120,
        cell: ({ getValue }) => (
            <span className="text-sm text-(--color-muted-foreground) tabular-nums">
                {getValue<string>()}
            </span>
        ),
    },
];

export interface OrdersTableProps {
    data: Order[];
    total: number;
    page: number;
    limit: number;
}

export function OrdersTable({ data, total, page, limit }: OrdersTableProps) {
    return (
        <DataTable
            data={data}
            columns={columns}
            total={total}
            page={page}
            limit={limit}
            exportFilename="orders"
            emptyMessage="No orders found."
        />
    );
}
