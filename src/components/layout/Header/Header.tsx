"use client";

import { LogOut, Menu, Settings, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/contexts/SidebarContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle/ThemeToggle";
import { NotificationBell } from "@/components/ui/NotificationBell/NotificationBell";
import { CommandPalette } from "@/components/ui/CommandPalette/CommandPalette";

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

      {/* Right: actions */}
      <div className="flex items-center gap-1">
        <CommandPalette />
        <NotificationBell />
        <ThemeToggle />

        {/* Avatar with profile dropdown */}
        <Popover className="relative ml-2">
          <PopoverButton
            className="flex h-8 w-8 items-center justify-center rounded-full bg-(--color-primary) text-(--color-primary-foreground) text-xs font-semibold select-none outline-none ring-offset-1 focus-visible:ring-2 focus-visible:ring-(--color-ring)"
            aria-label="Open user menu"
          >
            JD
          </PopoverButton>

          <PopoverPanel
            anchor="bottom end"
            className="z-50 mt-2 w-56 rounded-(--radius-lg) border border-(--color-border) bg-(--color-popover) shadow-lg outline-none"
          >
            {/* User info */}
            <div className="px-4 py-3 border-b border-(--color-border)">
              <p className="text-sm font-semibold text-(--color-foreground)">Jane Doe</p>
              <p className="text-xs text-(--color-muted-foreground) truncate">jane.doe@example.com</p>
            </div>

            {/* Menu items */}
            <div className="p-1">
              {[
                { icon: User, label: "Profile", href: "/users" },
                { icon: Settings, label: "Settings", href: "#" },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-(--radius-sm) px-3 py-2 text-sm text-(--color-foreground)",
                    "hover:bg-(--color-muted) transition-colors"
                  )}
                >
                  <Icon className="h-4 w-4 text-(--color-muted-foreground)" />
                  {label}
                </a>
              ))}
            </div>

            <div className="border-t border-(--color-border) p-1">
              <button
                type="button"
                onClick={() => { }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-(--radius-sm) px-3 py-2 text-sm",
                  "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                )}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </PopoverPanel>
        </Popover>
      </div>
    </header>
  );
}
