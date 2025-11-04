import DiamondGradient from "@/components/DiamondGradient";
import Footer from "@/components/Footer";
import CircularGallery from "@/components/CircularGallery";

export default function ProjectsPage() {
    const items = [
        { image: "/carrousel rosh.png", text: "ROSH", href: "/projects/rosh" },
        { image: "/carrousel paturain.png", text: "Paturain", href: "/projects/paturain" },
        { image: "/carrousel fiori.png", text: "FIORI", href: "/projects/fiori" },
        { image: "/carrousel ql.png", text: "Quality Lodgings", href: "/projects/quality-lodgings" },
        { image: "/carrousel fis.png", text: "FIS", href: "/projects/fis" },
    ];

    return (
        <div className="min-h-screen bg-[#1a1a1a] flex flex-col" style={{ position: 'relative' }}>
            {/* Dark purple gradient background accent */}
            <DiamondGradient hex="#9A3CC3" speed={0.35} bandWidth={0.8} aspectY={0.8} aspectX={0.2} softness={2} centerOffsetPx={{ x: 40, y: 0 }} />

            {/* Header Navigation is in Root Layout */}

            {/* Main */}
            <main className="relative mx-auto w-full max-w-7xl px-6 pt-20 pb-16 md:pt-28 flex-1 flex flex-col">
                {/* Heading */}
                <h1 className="text-center text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] text-white tracking-tight mb-10">
                    PROJECTS
                </h1>

                {/* Carousel container (fixed height as requested) */}
                <div style={{ height: '400px', position: 'relative', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '16px', overflow: 'hidden' }}>
                    <CircularGallery bend={3} textColor="#ffffff" borderRadius={0.12} scrollEase={0.02} activeScale={1.3} items={items} />
                </div>
            </main>

            {/* Footer with contact and socials */}
            <Footer />
        </div>
    );
}


