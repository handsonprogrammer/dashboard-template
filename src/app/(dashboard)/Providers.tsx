"use client";

import { SidebarProvider } from "@/contexts/SidebarContext";
import { NotificationProvider } from "@/contexts/NotificationContext";

export function DashboardProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      {/* NotificationProvider wires the bell badge in Header (Phase 3) */}
      <NotificationProvider>{children}</NotificationProvider>
    </SidebarProvider>
  );
}
