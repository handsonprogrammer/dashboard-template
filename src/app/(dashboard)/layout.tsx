"use client";

import { SidebarProvider } from "@/contexts/SidebarContext";
import { NotificationProvider } from "@/contexts/NotificationContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <NotificationProvider>
        {/* TODO Phase 2: compose <Sidebar /> + <Header /> + <main> */}
        <div className="flex min-h-screen">
          {/* <Sidebar /> */}
          <div className="flex flex-1 flex-col">
            {/* <Header /> */}
            <main className="flex-1 p-6 bg-(--color-background)">{children}</main>
          </div>
        </div>
      </NotificationProvider>
    </SidebarProvider>
  );
}
