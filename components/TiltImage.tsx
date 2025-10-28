"use client";

import Image from "next/image";
import { useRef } from "react";

type TiltImageProps = {
    src: string;
    alt: string;
    sizes?: string;
    className?: string;
};

export default function TiltImage({ src, alt, sizes, className = "" }: TiltImageProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const frameRef = useRef<number | null>(null);

    const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = containerRef.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const midX = rect.width / 2;
        const midY = rect.height / 2;

        const rotateY = ((x - midX) / midX) * 12; // left/right
        const rotateX = -((y - midY) / midY) * 12; // up/down

        if (frameRef.current) cancelAnimationFrame(frameRef.current);
        frameRef.current = requestAnimationFrame(() => {
            el.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.03)`;
        });
    };

    const handleLeave = () => {
        const el = containerRef.current;
        if (!el) return;
        if (frameRef.current) cancelAnimationFrame(frameRef.current);
        frameRef.current = requestAnimationFrame(() => {
            el.style.transform = `perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)`;
        });
    };

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            className={`rounded-full overflow-hidden ring-2 ring-white/20 will-change-transform transition-transform duration-150 ease-out ${className}`}
            style={{ transform: "perspective(900px)" }}
        >
            <Image
                src={src}
                alt={alt}
                fill
                sizes={sizes}
                className="object-cover select-none"
                priority
            />
        </div>
    );
}


