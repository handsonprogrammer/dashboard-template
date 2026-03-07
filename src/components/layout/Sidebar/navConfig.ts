import { BarChart2, LayoutDashboard, Puzzle, ShoppingCart, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { label: "Dashboard",  href: "/admin",      icon: LayoutDashboard },
  { label: "Analytics",  href: "/analytics",  icon: BarChart2 },
  { label: "Users",      href: "/users",      icon: Users },
  { label: "Orders",     href: "/orders",     icon: ShoppingCart },
  { label: "Components", href: "/components", icon: Puzzle },
];
