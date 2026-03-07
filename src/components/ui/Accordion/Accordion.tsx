"use client";

import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
    key: string;
    trigger: React.ReactNode;
    content: React.ReactNode;
    defaultOpen?: boolean;
}

export interface AccordionProps {
    items: AccordionItem[];
    className?: string;
    itemClassName?: string;
}

export function Accordion({ items, className, itemClassName }: AccordionProps) {
    return (
        <div className={cn("divide-y divide-(--color-border)", className)}>
            {items.map((item) => (
                <Disclosure key={item.key} defaultOpen={item.defaultOpen}>
                    {({ open }) => (
                        <div className={cn("py-1", itemClassName)}>
                            <DisclosureButton className="flex w-full items-center justify-between gap-4 px-1 py-3 text-left text-sm font-medium text-(--color-foreground) hover:text-(--color-primary) transition-colors outline-none">
                                <span>{item.trigger}</span>
                                <ChevronDown
                                    size={16}
                                    className={cn(
                                        "shrink-0 text-(--color-muted-foreground) transition-transform duration-200",
                                        open && "rotate-180",
                                    )}
                                />
                            </DisclosureButton>
                            <DisclosurePanel className="px-1 pb-3 text-sm text-(--color-muted-foreground)">
                                {item.content}
                            </DisclosurePanel>
                        </div>
                    )}
                </Disclosure>
            ))}
        </div>
    );
}
