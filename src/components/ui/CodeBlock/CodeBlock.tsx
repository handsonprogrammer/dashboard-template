"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CodeBlockProps {
    /** The code string to display and copy */
    code: string;
    /** Language label shown in the header (cosmetic only) */
    language?: string;
    className?: string;
}

export function CodeBlock({ code, language = "tsx", className }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback for older browsers
            const el = document.createElement("textarea");
            el.value = code;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }

    return (
        <div
            className={cn(
                "rounded-lg border border-(--color-border) bg-(--color-muted) overflow-hidden text-sm",
                className
            )}
        >
            {/* Header bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-(--color-border) bg-(--color-surface)">
                <span className="text-xs font-mono text-(--color-muted-foreground) select-none">
                    {language}
                </span>
                <button
                    type="button"
                    onClick={handleCopy}
                    aria-label={copied ? "Copied" : "Copy code"}
                    className={cn(
                        "flex items-center gap-1.5 text-xs font-medium transition-colors rounded px-1.5 py-0.5",
                        copied
                            ? "text-green-600 dark:text-green-400"
                            : "text-(--color-muted-foreground) hover:text-(--color-foreground)"
                    )}
                >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    {copied ? "Copied!" : "Copy"}
                </button>
            </div>

            {/* Code */}
            <pre className="overflow-x-auto p-4 text-xs font-mono leading-relaxed text-(--color-foreground) m-0">
                <code>{code.trim()}</code>
            </pre>
        </div>
    );
}
