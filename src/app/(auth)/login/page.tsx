"use client";

import { useState } from "react";
import { toast } from "@/lib/toast";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please fill in all fields.");
            return;
        }
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1000));
        setLoading(false);
        toast.success("Welcome back!", "You have been signed in.");
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-2">Sign in</h1>
            <p className="text-(--color-muted-foreground) mb-8 text-sm">
                Enter your credentials to access your dashboard.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-md border border-(--color-input) bg-(--color-background) px-3 py-2 text-sm outline-none ring-(--color-ring) focus:ring-2"
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-1">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-md border border-(--color-input) bg-(--color-background) px-3 py-2 text-sm outline-none ring-(--color-ring) focus:ring-2"
                        placeholder="••••••••"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <input id="remember" type="checkbox" className="h-4 w-4 rounded" />
                    <label htmlFor="remember" className="text-sm">
                        Remember me
                    </label>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-md bg-(--color-primary) text-(--color-primary-foreground) px-4 py-2 text-sm font-medium transition hover:opacity-90 disabled:opacity-50"
                >
                    {loading ? "Signing in…" : "Sign in"}
                </button>
            </form>
            <p className="mt-6 text-center text-sm text-(--color-muted-foreground)">
                Don&apos;t have an account?{" "}
                <a href="/register" className="text-(--color-primary) hover:underline">
                    Register
                </a>
            </p>
        </div>
    );
}
