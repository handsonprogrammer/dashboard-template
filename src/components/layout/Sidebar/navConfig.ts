import { BarChart2, LayoutDashboard, LogIn, Puzzle, ShoppingCart, UserPlus, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SidebarNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const navItems: SidebarNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Analytics", href: "/analytics", icon: BarChart2 },
  { label: "Users", href: "/users", icon: Users },
  { label: "Orders", href: "/orders", icon: ShoppingCart },
  { label: "Components", href: "/components", icon: Puzzle },
];

/** Auth pages — shown at the bottom of the sidebar as demo previews. */
export const authItems: SidebarNavItem[] = [
  { label: "Login", href: "/login", icon: LogIn },
  { label: "Register", href: "/register", icon: UserPlus },
];
