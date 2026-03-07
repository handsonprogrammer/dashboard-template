"use client";

import { useEffect } from "react";

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
            <div className="h-12 w-12 rounded-full bg-(--color-destructive)/10 flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
            </div>
            <div>
                <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
                <p className="text-(--color-muted-foreground) text-sm max-w-sm">
                    {error.message || "An unexpected error occurred. Please try again."}
                </p>
                {error.digest && (
                    <p className="text-xs text-(--color-muted-foreground) mt-1 font-mono">
                        Digest: {error.digest}
                    </p>
                )}
            </div>
            <button
                onClick={reset}
                className="rounded-md bg-(--color-primary) text-(--color-primary-foreground) px-4 py-2 text-sm font-medium hover:opacity-90 transition"
            >
                Try again
            </button>
        </div>
    );
}
