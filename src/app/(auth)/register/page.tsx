"use client";

import { useState } from "react";
import { toast } from "@/lib/toast";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", terms: false });
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!form.terms) {
      toast.error("Please accept the terms and conditions.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    toast.success("Account created!", "Welcome to the dashboard.");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Create account</h1>
      <p className="text-(--color-muted-foreground) mb-8 text-sm">
        Fill in the details below to get started.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { id: "name", label: "Full name", type: "text", placeholder: "Alice Johnson" },
          { id: "email", label: "Email", type: "email", placeholder: "you@example.com" },
          { id: "password", label: "Password", type: "password", placeholder: "••••••••" },
          { id: "confirm", label: "Confirm password", type: "password", placeholder: "••••••••" },
        ].map(({ id, label, type, placeholder }) => (
          <div key={id}>
            <label htmlFor={id} className="block text-sm font-medium mb-1">
              {label}
            </label>
            <input
              id={id}
              type={type}
              required
              value={String(form[id as keyof typeof form])}
              onChange={(e) => update(id, e.target.value)}
              className="w-full rounded-md border border-(--color-input) bg-(--color-background) px-3 py-2 text-sm outline-none ring-(--color-ring) focus:ring-2"
              placeholder={placeholder}
            />
          </div>
        ))}
        <div className="flex items-center gap-2">
          <input
            id="terms"
            type="checkbox"
            className="h-4 w-4 rounded"
            checked={form.terms}
            onChange={(e) => update("terms", e.target.checked)}
          />
          <label htmlFor="terms" className="text-sm">
            I agree to the{" "}
            <a href="#" className="text-(--color-primary) hover:underline">
              terms and conditions
            </a>
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-(--color-primary) text-(--color-primary-foreground) px-4 py-2 text-sm font-medium transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-(--color-muted-foreground)">
        Already have an account?{" "}
        <a href="/login" className="text-(--color-primary) hover:underline">
          Sign in
        </a>
      </p>
    </div>
  );
}
