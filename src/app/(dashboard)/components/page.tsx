export default function ComponentsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Component Showcase</h1>
            <p className="text-(--color-muted-foreground) mb-8">
                A living catalog of every UI primitive. All variants, props, and copy-paste snippets.
            </p>
            {/* TODO Phase 6: Tab-organized sections for every component */}
            <p className="text-(--color-muted-foreground) text-sm">
                Phase 6 — Component catalog coming soon. Run{" "}
                <code className="font-mono bg-(--color-muted) px-1 rounded">npm run storybook</code>{" "}
                to see all components in Storybook in the meantime.
            </p>
        </div>
    );
}
