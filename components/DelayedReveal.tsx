"use client";

import { useEffect, useState } from "react";

type DelayedRevealProps = {
    children: React.ReactNode;
    delayMs?: number;
    className?: string;
};

export default function DelayedReveal({ children, delayMs = 0, className = "" }: DelayedRevealProps) {
    const [visible, setVisible] = useState(delayMs === 0);

    useEffect(() => {
        if (visible) return;
        const t = setTimeout(() => setVisible(true), delayMs);
        return () => clearTimeout(t);
    }, [visible, delayMs]);

    return (
        <div
            className={className}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 1000ms ease, transform 1000ms ease"
            }}
        >
            {children}
        </div>
    );
}


