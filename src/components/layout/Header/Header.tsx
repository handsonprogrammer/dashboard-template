"use client";

import { Bell, Menu, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/contexts/SidebarContext";

function Breadcrumb() {
  const pathname = usePathname();
  // Split path and remove empty strings (leading slash produces one)
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-sm">
      <span className="text-(--color-muted-foreground)">Dashboard</span>
      {segments.map((segment, i) => (
        <span key={`${i}-${segment}`} className="flex items-center gap-1.5">
          <span className="text-(--color-muted-foreground)">/</span>
          <span
            className={cn(
              "capitalize",
              i === segments.length - 1
                ? "text-(--color-foreground) font-medium"
                : "text-(--color-muted-foreground)"
            )}
          >
            {segment.replace(/-/g, " ")}
          </span>
        </span>
      ))}
    </nav>
  );
}

export function Header() {
  const { toggle } = useSidebar();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-(--color-border) bg-(--color-surface)/80 backdrop-blur-sm px-4 shrink-0">
      {/* Left: menu toggle */}
      <button
        type="button"
        onClick={toggle}
        className="rounded-md p-2 text-(--color-muted-foreground) hover:bg-(--color-muted) hover:text-(--color-foreground) transition-colors"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Center: breadcrumb */}
      <div className="flex-1 min-w-0">
        <Breadcrumb />
      </div>

      {/* Right: placeholder actions + avatar */}
      <div className="flex items-center gap-1">
        {/* Phase 3: CommandPalette — replace aria-disabled with actual handler */}
        <button
          type="button"
          className="rounded-md p-2 text-(--color-muted-foreground) hover:bg-(--color-muted) hover:text-(--color-foreground) transition-colors"
          aria-label="Open command palette"
          aria-disabled="true"
          tabIndex={-1}
        >
          <Search className="h-5 w-5" />
        </button>

        {/* Phase 3: NotificationBell — replace aria-disabled with actual handler */}
        <button
          type="button"
          className="rounded-md p-2 text-(--color-muted-foreground) hover:bg-(--color-muted) hover:text-(--color-foreground) transition-colors"
          aria-label="Notifications"
          aria-disabled="true"
          tabIndex={-1}
        >
          <Bell className="h-5 w-5" />
        </button>

        {/* Avatar — hardcoded placeholder until auth is wired */}
        <div
          className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-(--color-primary) text-(--color-primary-foreground) text-xs font-semibold select-none"
          role="img"
          aria-label="User avatar: Jane Doe"
        >
          JD
        </div>
      </div>
    </header>
  );
}
