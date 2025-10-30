import PillNav from "@/components/PillNav";
import DiamondGradient from "@/components/DiamondGradient";
import Footer from "@/components/Footer";

export default function PaturainPage() {
    return (
        <div className="min-h-screen bg-[#1a1a1a] flex flex-col" style={{ position: 'relative' }}>
            <DiamondGradient hex="#9A3CC3" speed={0.35} bandWidth={0.8} aspectY={0.8} aspectX={0.2} softness={2} centerOffsetPx={{ x: 40, y: 0 }} />

            <PillNav
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'About', href: '/about' },
                    { label: 'Projects', href: '/projects' }
                ]}
                activeHref="/projects"
                baseColor="#ffffff"
                pillColor="#1a1a1a"
                hoveredPillTextColor="#000000"
                pillTextColor="#ffffff"
            />

            <main className="relative mx-auto w-full max-w-7xl px-6 pt-20 pb-16 md:pt-28 flex-1 flex flex-col gap-8">
                <h1 className="text-center text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] text-white tracking-tight">Paturain</h1>
                <p className="text-center text-white/80 max-w-3xl mx-auto">Case study content for Paturain komt hier.</p>
            </main>

            <Footer />
        </div>
    );
}


