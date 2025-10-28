"use client";

import { useEffect, useRef, useState } from "react";

type RevealOnScrollProps = {
    children: React.ReactNode;
    className?: string;
    threshold?: number;
    rootMargin?: string;
    once?: boolean;
};

export default function RevealOnScroll({
    children,
    className = "",
    threshold = 0.15,
    rootMargin = "0px 0px -25% 0px",
    once = true
}: RevealOnScrollProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisible(true);
                        if (once) observer.unobserve(entry.target);
                    } else if (!once) {
                        setVisible(false);
                    }
                });
            },
            { threshold, rootMargin }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold, rootMargin, once]);

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 700ms ease, transform 700ms ease"
            }}
        >
            {children}
        </div>
    );
}


