"use client";

import { createContext, useCallback, useContext, useState } from "react";

export interface Notification {
  id: string;
  title: string;
  description?: string;
  read: boolean;
  createdAt: Date;
}

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  addNotification: (n: Omit<Notification, "id" | "read" | "createdAt">) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "New user registered",
    description: "Alice Johnson just signed up.",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: "2",
    title: "Order #1042 shipped",
    description: "Estimated delivery in 3 days.",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "3",
    title: "Monthly report ready",
    description: "Your March 2026 report is available.",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
];

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const addNotification = useCallback(
    (n: Omit<Notification, "id" | "read" | "createdAt">) => {
      setNotifications((prev) => [
        { ...n, id: String(Date.now()), read: false, createdAt: new Date() },
        ...prev,
      ]);
    },
    []
  );

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markRead, markAllRead, addNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
