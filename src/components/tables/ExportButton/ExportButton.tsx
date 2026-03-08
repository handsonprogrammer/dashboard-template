"use client";

import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { exportToCSV } from "@/lib/export";
import { Button } from "@/components/ui";

export interface ExportButtonProps {
    data: Record<string, unknown>[];
    filename: string;
    columns?: string[];
    label?: string;
    className?: string;
}

export function ExportButton({
    data,
    filename,
    columns,
    label = "Export CSV",
    className,
}: ExportButtonProps) {
    function handleClick() {
        exportToCSV(data, filename, columns);
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleClick}
            className={cn("gap-2", className)}
        >
            <Download size={14} />
            {label}
        </Button>
    );
}
