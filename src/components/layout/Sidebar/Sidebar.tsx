"use client";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { ChevronLeft, ChevronRight, LayoutDashboard, X } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";
import { navItems, authItems } from "./navConfig";
import { NavItem } from "./NavItem";

function NavList({
  collapsed,
  onNavClick,
}: {
  collapsed: boolean;
  onNavClick?: () => void;
}) {
  return (
    <nav className="flex-1 space-y-1 px-2 py-4">
      {navItems.map((item) => (
        <NavItem
          key={item.href}
          item={item}
          collapsed={collapsed}
          onClick={onNavClick}
        />
      ))}
    </nav>
  );
}

function AuthLinks({
  collapsed,
  onNavClick,
}: {
  collapsed: boolean;
  onNavClick?: () => void;
}) {
  return (
    <div className="border-t border-(--color-border) px-2 py-3 space-y-1">
      {!collapsed && (
        <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-(--color-muted-foreground)">
          Auth Pages
        </p>
      )}
      {authItems.map((item) => (
        <NavItem
          key={item.href}
          item={item}
          collapsed={collapsed}
          onClick={onNavClick}
        />
      ))}
    </div>
  );
}

export function Sidebar() {
  const { isOpen, isCollapsed, close, collapse } = useSidebar();

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside
        aria-label="Main navigation"
        className={cn(
          "hidden md:flex flex-col h-screen sticky top-0 bg-(--color-sidebar-bg) border-r border-(--color-border) transition-[width] duration-200 overflow-hidden shrink-0",
          isCollapsed ? "w-16" : "w-60"
        )}
      >
        {/* Logo / brand */}
        <div
          className={cn(
            "flex h-16 items-center border-b border-(--color-border) px-4 shrink-0",
            isCollapsed ? "justify-center" : "gap-2"
          )}
        >
          <LayoutDashboard className="h-5 w-5 shrink-0 text-(--color-primary)" />
          {!isCollapsed && (
            <span className="font-semibold text-sm truncate">
              Dashboard
            </span>
          )}
        </div>

        <NavList collapsed={isCollapsed} />

        {/* Auth page links */}
        <AuthLinks collapsed={isCollapsed} />

        {/* Collapse toggle */}
        <div className="border-t border-(--color-border) p-2 shrink-0">
          <button
            type="button"
            onClick={collapse}
            className="flex w-full items-center justify-center rounded-md p-2 text-(--color-muted-foreground) hover:bg-(--color-muted) hover:text-(--color-foreground) transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </aside>

      {/* ── Mobile drawer ── */}
      <Dialog open={isOpen} onClose={close} className="relative z-50 md:hidden" aria-label="Navigation menu">
        {/* Backdrop */}
        <DialogBackdrop className="fixed inset-0 bg-black/40" />

        <div className="fixed inset-0 flex">
          <DialogPanel className="flex flex-col w-60 h-full bg-(--color-sidebar-bg) border-r border-(--color-border)">
            {/* Drawer header */}
            <div className="flex h-16 items-center justify-between border-b border-(--color-border) px-4 shrink-0">
              <span className="font-semibold text-sm">Dashboard</span>
              <button
                type="button"
                onClick={close}
                className="rounded-md p-1 text-(--color-muted-foreground) hover:bg-(--color-muted) hover:text-(--color-foreground) transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <NavList collapsed={false} onNavClick={close} />

            {/* Auth page links */}
            <AuthLinks collapsed={false} onNavClick={close} />
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
