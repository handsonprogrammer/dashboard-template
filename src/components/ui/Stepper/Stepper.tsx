import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import React from "react";

export type StepStatus = "complete" | "current" | "upcoming";

export interface StepperStep {
    id: string;
    label: string;
    description?: string;
    status: StepStatus;
}

export interface StepperProps {
    steps: StepperStep[];
    orientation?: "horizontal" | "vertical";
    className?: string;
}

export function Stepper({ steps, orientation = "horizontal", className }: StepperProps) {
    return orientation === "horizontal" ? (
        <HorizontalStepper steps={steps} className={className} />
    ) : (
        <VerticalStepper steps={steps} className={className} />
    );
}

/* ─── Horizontal ────────────────────────────────────────────────── */

function HorizontalStepper({ steps, className }: { steps: StepperStep[]; className?: string }) {
    return (
        <nav aria-label="Progress" className={cn("w-full", className)}>
            <ol className="flex items-center">
                {steps.map((step, i) => {
                    const last = i === steps.length - 1;
                    return (
                        <li key={step.id} className={cn("flex items-center", !last && "flex-1")}>
                            {/* Circle */}
                            <StepCircle status={step.status} index={i} />

                            {/* Connector */}
                            {!last && (
                                <div
                                    className={cn(
                                        "h-0.5 flex-1 mx-2 rounded-full transition-colors",
                                        step.status === "complete"
                                            ? "bg-(--color-primary)"
                                            : "bg-(--color-muted)",
                                    )}
                                />
                            )}
                        </li>
                    );
                })}
            </ol>

            {/* Labels */}
            <ol className="mt-3 flex">
                {steps.map((step, i) => {
                    const last = i === steps.length - 1;
                    return (
                        <li
                            key={step.id}
                            className={cn("flex flex-col text-xs", !last && "flex-1")}
                        >
                            <span
                                className={cn(
                                    "font-medium",
                                    step.status === "current"
                                        ? "text-(--color-primary)"
                                        : step.status === "complete"
                                            ? "text-(--color-foreground)"
                                            : "text-(--color-muted-foreground)",
                                )}
                            >
                                {step.label}
                            </span>
                            {step.description && (
                                <span className="text-(--color-muted-foreground)">{step.description}</span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

/* ─── Vertical ──────────────────────────────────────────────────── */

function VerticalStepper({ steps, className }: { steps: StepperStep[]; className?: string }) {
    return (
        <nav aria-label="Progress" className={cn("w-full", className)}>
            <ol className="space-y-0">
                {steps.map((step, i) => {
                    const last = i === steps.length - 1;
                    return (
                        <li key={step.id} className="relative flex gap-4">
                            {/* Connector + circle column */}
                            <div className="flex flex-col items-center">
                                <StepCircle status={step.status} index={i} />
                                {!last && (
                                    <div
                                        className={cn(
                                            "mt-1 w-0.5 flex-1 rounded-full transition-colors",
                                            step.status === "complete"
                                                ? "bg-(--color-primary)"
                                                : "bg-(--color-muted)",
                                        )}
                                    />
                                )}
                            </div>

                            {/* Text */}
                            <div className={cn("pb-6 pt-0.5 text-sm", last && "pb-0")}>
                                <p
                                    className={cn(
                                        "font-medium",
                                        step.status === "current"
                                            ? "text-(--color-primary)"
                                            : step.status === "complete"
                                                ? "text-(--color-foreground)"
                                                : "text-(--color-muted-foreground)",
                                    )}
                                >
                                    {step.label}
                                </p>
                                {step.description && (
                                    <p className="mt-0.5 text-xs text-(--color-muted-foreground)">
                                        {step.description}
                                    </p>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

/* ─── Shared step circle ────────────────────────────────────────── */

function StepCircle({ status, index }: { status: StepStatus; index: number }) {
    return (
        <div
            aria-hidden="true"
            className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors",
                status === "complete" &&
                "border-(--color-primary) bg-(--color-primary) text-(--color-primary-foreground)",
                status === "current" &&
                "border-(--color-primary) bg-(--color-card) text-(--color-primary)",
                status === "upcoming" &&
                "border-(--color-border) bg-(--color-card) text-(--color-muted-foreground)",
            )}
        >
            {status === "complete" ? (
                <Check size={13} strokeWidth={3} />
            ) : (
                index + 1
            )}
        </div>
    );
}
