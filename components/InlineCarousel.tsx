"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type InlineCarouselProps = {
    images: { src: string; alt?: string }[];
    heightPx?: number;
    visible?: number; // number of images visible at once (default 6)
    speedPxPerSec?: number; // scroll speed in px/sec (default 60)
    gapPx?: number; // gap between items (default 12)
};

export default function InlineCarousel({ images, heightPx = 180, visible = 6, speedPxPerSec = 60, gapPx = 12 }: InlineCarouselProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [offsetPx, setOffsetPx] = useState(0);

    // exactly 6 items (or first 6)
    const items = useMemo(() => {
        if (!images || images.length === 0) return [] as { src: string; alt?: string }[];
        return images.slice(0, 6);
    }, [images]);

    // measure container
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const resize = () => setContainerWidth(el.clientWidth);
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    // compute geometry
    const itemWidth = containerWidth > 0 ? containerWidth / visible : 0;
    const trackWidth = items.length * itemWidth + Math.max(0, items.length - 1) * gapPx;

    // continuous loop via rAF
    useEffect(() => {
        let raf: number;
        let last = performance.now();
        const tick = (now: number) => {
            const dt = (now - last) / 1000; // seconds
            last = now;
            const delta = speedPxPerSec * dt;
            setOffsetPx(prev => {
                let next = prev + delta;
                if (trackWidth > 0) {
                    if (next >= trackWidth) next -= trackWidth; // wrap seamlessly
                }
                return next;
            });
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [speedPxPerSec, trackWidth]);

    // apply transforms
    const transformA = `translateX(${-offsetPx}px)`;
    const transformB = `translateX(${trackWidth - offsetPx}px)`; // starts right after A ends

    return (
        <div className="relative">
            <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-sm p-3 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
                <div className="relative" style={{ height: `${heightPx}px` }}>
                    <div ref={containerRef} className="relative h-full overflow-hidden rounded-xl border border-white/10 bg-black/25">
                        {/* Track A */}
                        <div
                            className="absolute inset-y-0 left-0 flex items-stretch"
                            style={{ width: `${trackWidth}px`, transform: transformA, willChange: 'transform' }}
                        >
                            {items.map((img, i) => (
                                <div key={`A-${img.src}-${i}`} style={{ width: `${itemWidth}px`, marginRight: i === items.length - 1 ? 0 : gapPx, backgroundColor: "#2a2030" }} className="relative h-full border-2 border-[#9A3CC3]/60">
                                    <div className="absolute inset-0 bg-[#9A3CC3]/15" />
                                    <Image src={img.src} alt={img.alt || 'carousel image'} fill className="object-cover" unoptimized priority={i < visible} />
                                </div>
                            ))}
                        </div>
                        {/* Track B (preloaded, positioned after A) */}
                        <div
                            className="absolute inset-y-0 left-0 flex items-stretch"
                            style={{ width: `${trackWidth}px`, transform: transformB, willChange: 'transform' }}
                        >
                            {items.map((img, i) => (
                                <div key={`B-${img.src}-${i}`} style={{ width: `${itemWidth}px`, marginRight: i === items.length - 1 ? 0 : gapPx, backgroundColor: "#2a2030" }} className="relative h-full border-2 border-[#9A3CC3]/60">
                                    <div className="absolute inset-0 bg-[#9A3CC3]/15" />
                                    <Image src={img.src} alt={img.alt || 'carousel image'} fill className="object-cover" unoptimized />
                                </div>
                            ))}
                        </div>
                        {/* Edge fades */}
                        <div className="pointer-events-none absolute left-0 top-0 h-full w-12 md:w-20" style={{ background: "linear-gradient(90deg, rgba(26,26,26,1) 0%, rgba(26,26,26,0) 100%)" }} />
                        <div className="pointer-events-none absolute right-0 top-0 h-full w-12 md:w-20" style={{ background: "linear-gradient(270deg, rgba(26,26,26,1) 0%, rgba(26,26,26,0) 100%)" }} />
                    </div>
                </div>
            </div>
        </div>
    );
}


