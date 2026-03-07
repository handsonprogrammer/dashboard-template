export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            {/* Decorative left panel */}
            <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-(--color-primary) text-(--color-primary-foreground)">
                <div className="max-w-sm text-center">
                    <h1 className="text-4xl font-bold mb-4">Dashboard Template</h1>
                    <p className="text-lg opacity-80">
                        A reusable, accessible dashboard built with Next.js 15 and Tailwind CSS v4.
                    </p>
                </div>
            </div>
            {/* Form right panel */}
            <div className="flex flex-1 items-center justify-center p-8 bg-(--color-background)">
                <div className="w-full max-w-sm">{children}</div>
            </div>
        </div>
    );
}
