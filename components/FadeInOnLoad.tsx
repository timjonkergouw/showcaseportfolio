"use client";

import { useEffect, useState } from "react";

type FadeInOnLoadProps = {
    children: React.ReactNode;
    delayMs?: number;
    className?: string;
    fromY?: number;
    fromScale?: number;
};

export default function FadeInOnLoad({ children, delayMs = 0, className = "", fromY = 8, fromScale = 1 }: FadeInOnLoadProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), delayMs);
        return () => clearTimeout(t);
    }, [delayMs]);

    return (
        <div
            className={className}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0) scale(1)" : `translateY(${fromY}px) scale(${fromScale})`,
                transition: "opacity 700ms ease, transform 700ms ease"
            }}
        >
            {children}
        </div>
    );
}


