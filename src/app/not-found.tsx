import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-(--color-background) text-(--color-foreground)">
      <p className="text-8xl font-black text-(--color-primary) select-none">404</p>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-(--color-muted-foreground) text-base max-w-sm text-center">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/admin"
        className="rounded-md bg-(--color-primary) text-(--color-primary-foreground) px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
