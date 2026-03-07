"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

interface SidebarContextValue {
    isOpen: boolean;       // mobile drawer open
    isCollapsed: boolean;  // desktop icon-only mode
    toggle: () => void;    // toggle mobile drawer
    collapse: () => void;  // toggle desktop collapse
    close: () => void;     // close mobile drawer
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile breakpoint
    useEffect(() => {
        const mq = window.matchMedia("(max-width: 768px)");
        const handler = (e: MediaQueryListEvent | MediaQueryList) => {
            setIsMobile(e.matches);
            if (e.matches) setIsOpen(false);
        };
        handler(mq);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    const toggle = useCallback(() => {
        if (isMobile) {
            setIsOpen((prev) => !prev);
        } else {
            setIsCollapsed((prev) => !prev);
        }
    }, [isMobile]);

    const collapse = useCallback(() => setIsCollapsed((prev) => !prev), []);
    const close = useCallback(() => setIsOpen(false), []);

    return (
        <SidebarContext.Provider value={{ isOpen, isCollapsed, toggle, collapse, close }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar(): SidebarContextValue {
    const ctx = useContext(SidebarContext);
    if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
    return ctx;
}
