"use client";

import { SidebarProvider } from "@/contexts/SidebarContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <NotificationProvider>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex flex-1 flex-col min-w-0">
            <Header />
            <main className="flex-1 p-6 bg-(--color-background)">
              {children}
            </main>
          </div>
        </div>
      </NotificationProvider>
    </SidebarProvider>
  );
}
