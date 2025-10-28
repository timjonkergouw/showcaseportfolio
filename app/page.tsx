import PillNav from "@/components/PillNav";
import DiamondGradient from "@/components/DiamondGradient";
import Image from "next/image";
import Link from "next/link";
import StarBorder from "@/components/StarBorder";
import TypewriterText from "@/components/TypewriterText";
import DelayedReveal from "@/components/DelayedReveal";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col" style={{ position: 'relative' }}>
      <DiamondGradient hex="#9A3CC3" speed={0.35} bandWidth={0.8} aspectY={0.8} aspectX={0.2} softness={2} centerOffsetPx={{ x: 40, y: 0 }} />
      <PillNav
        items={[
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
          { label: 'Projects', href: '/projects' }
        ]}
        activeHref="/"
        baseColor="#ffffff"
        pillColor="#1a1a1a"
        hoveredPillTextColor="#000000"
        pillTextColor="#ffffff"
      />

      <main className="relative mx-auto max-w-7xl px-6 pt-20 pb-20 md:pt-28">
        <div className="grid grid-cols-1 gap-0 md:gap-0 md:grid-cols-2 md:items-center">
          <div className="text-left">
            <p className="text-white/80 text-sm md:text-base tracking-[0.08em] font-semibold mb-3">
              <TypewriterText text="Hi, it's" speed={60} startDelay={200} />
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] text-white tracking-tight mb-3">
              <TypewriterText text="TIM JONKERGOUW" speed={90} startDelay={900} />
            </h1>
            <p className="text-base md:text-lg text-white/90 mb-6">
              <TypewriterText text="Designer & Front-End Developer" speed={55} startDelay={2400} />
            </p>

            <DelayedReveal delayMs={4500}>
              <div className="flex items-center gap-3">
                <Link href="/about" className="inline-block">
                  <StarBorder as="div" color="#9A3CC3" speed="7s" thickness={2} className="hover:opacity-90 transition-opacity cursor-pointer">
                    ABOUT
                  </StarBorder>
                </Link>
                <Link href="/projects" className="inline-block">
                  <StarBorder as="div" color="#9A3CC3" speed="7s" thickness={2} className="hover:opacity-90 transition-opacity cursor-pointer">
                    PROJECTS
                  </StarBorder>
                </Link>
              </div>
            </DelayedReveal>
          </div>

          <DelayedReveal delayMs={4500} className="flex md:justify-center lg:justify-end">
            <div className="relative h-90 w-90 md:h-120 md:w-120 lg:h-[525px] lg:w-[525px]">
              <Image
                src="/elipse plaatje.png"
                alt="Project previews"
                fill
                sizes="(max-width: 768px) 22.5rem, (max-width: 1024px) 30rem, 525px"
                className="object-contain"
              />
            </div>
          </DelayedReveal>
        </div>
      </main>
      <Footer />
    </div>
  );
}
