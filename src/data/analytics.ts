/**
 * Mock analytics data for dashboard pages and chart demos.
 * Replace these with real API calls when integrating a backend.
 */
import type { CategoryDataPoint } from "@/types";

export interface MonthlyDataPoint {
    month: string;
    revenue: number;
    expenses: number;
}

export interface SignupDataPoint {
    month: string;
    signups: number;
    churned: number;
}

export const revenueData: MonthlyDataPoint[] = [
    { month: "Jan", revenue: 42000, expenses: 28000 },
    { month: "Feb", revenue: 47000, expenses: 31000 },
    { month: "Mar", revenue: 51000, expenses: 33000 },
    { month: "Apr", revenue: 49000, expenses: 30000 },
    { month: "May", revenue: 58000, expenses: 35000 },
    { month: "Jun", revenue: 63000, expenses: 38000 },
    { month: "Jul", revenue: 59000, expenses: 36000 },
    { month: "Aug", revenue: 68000, expenses: 40000 },
    { month: "Sep", revenue: 72000, expenses: 42000 },
    { month: "Oct", revenue: 69000, expenses: 41000 },
    { month: "Nov", revenue: 78000, expenses: 45000 },
    { month: "Dec", revenue: 84000, expenses: 48000 },
];

export const signupData: SignupDataPoint[] = [
    { month: "Jan", signups: 320, churned: 45 },
    { month: "Feb", signups: 410, churned: 52 },
    { month: "Mar", signups: 390, churned: 48 },
    { month: "Apr", signups: 450, churned: 60 },
    { month: "May", signups: 520, churned: 55 },
    { month: "Jun", signups: 610, churned: 70 },
    { month: "Jul", signups: 580, churned: 65 },
    { month: "Aug", signups: 640, churned: 72 },
    { month: "Sep", signups: 720, churned: 80 },
    { month: "Oct", signups: 690, churned: 75 },
    { month: "Nov", signups: 780, churned: 85 },
    { month: "Dec", signups: 850, churned: 90 },
];

/** Traffic source breakdown — use with PieChart or DonutChart. */
export const trafficSourceData: CategoryDataPoint[] = [
    { label: "Organic",  value: 4200, color: "var(--color-primary)" },
    { label: "Direct",   value: 2800, color: "var(--color-secondary)" },
    { label: "Referral", value: 1900, color: "oklch(0.65 0.15 140)" },
    { label: "Social",   value: 1100, color: "oklch(0.65 0.15 30)" },
];

/** Order status breakdown — use with PieChart or DonutChart. */
export const orderStatusData: CategoryDataPoint[] = [
    { label: "Delivered",   value: 540, color: "oklch(0.65 0.15 140)" },
    { label: "Processing",  value: 230, color: "var(--color-primary)" },
    { label: "Shipped",     value: 190, color: "var(--color-secondary)" },
    { label: "Pending",     value: 120, color: "oklch(0.65 0.15 60)" },
    { label: "Cancelled",   value:  45, color: "var(--color-destructive)" },
];
