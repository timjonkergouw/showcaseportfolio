import PillNav from "@/components/PillNav";
import DiamondGradient from "@/components/DiamondGradient";
import Footer from "@/components/Footer";

export default function FIORIPage() {
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

            <main className="relative mx-auto w-full max-w-7xl px-6 pt-20 pb-16 md:pt-28 flex-1 flex flex-col gap-16">
                {/* Title */}
                <h1 className="text-center text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] text-white tracking-tight">FIORI</h1>

                {/* Large hero image */}
                <div className="w-full">
                    <img
                        src="/fiori combilogo.png"
                        alt="FIORI combi logo"
                        className="w-full h-[56vh] md:h-[70vh] lg:h-[80vh] object-contain bg-transparent"
                    />
                </div>

                {/* Research section (left aligned) */}
                <section className="flex flex-col gap-0">
                    <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-0">RESEARCH</h2>
                    <p className="text-white/80 max-w-3xl">
                        For the personal project, I quickly knew what I wanted to create. I spend a lot of time on social media and often see ads from clothing brands. I enjoy looking at what is printed on the shirts.
                        That inspired me to try it myself and come up with the idea of creating my own clothing brand. I started by looking for inspiration and exploring different websites and design references. I noticed that most sites have a navigation bar at the top, followed by a large header image with the brand’s logo. I also like shirts that feature artistic prints, almost like wearable art.
                        Coming up with a name was a bit challenging. I noticed that some brands use French or Italian names, such as Bagouve or Flâneur, because they often sound elegant and stylish. I asked ChatGPT to give me ten summery words of five letters, and from that, I found the word Fiori, which means flower in Italian. It immediately felt like the perfect fit for my brand.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            "/bagouve inspiratie.png",
                            "/flaneur inspiratie.png",
                            "/newamsterdam inspiratie.png",
                            "/baskets inspiratie.png",
                        ].map((src, idx) => (
                            <div key={`research-img-${idx}`} className="overflow-hidden rounded-2xl ring-1 ring-white/10">
                                <img
                                    src={src}
                                    alt={`Research ${idx + 1}`}
                                    className="w-full aspect-4/3 object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Design section (right aligned) */}
                <section className="flex flex-col gap-0">
                    <div className="ml-auto max-w-3xl text-right">
                        <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-0">DESIGN</h2>
                        <p className="text-white/80 max-w-3xl">
                            For the logo, I decided to work with a 3D software called Blender. I already had some basic experience with the program from personal interest, so I knew a little about how it worked. I chose a font in Photoshop, downloaded it, and then imported it into Blender. I also added a small flower as the dot above the “i,” since Fiori means flower.
                            After creating this logo, I continued designing logos for different t-shirts. I was also able to generate model photos with the help of AI. Unfortunately, we only had two weeks for this project, but during that time, I made significant progress in design, AI tools, and working with HTML, CSS, and JavaScript.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { src: "/carrousel fiori.png", alt: "Carrousel FIORI" },
                            { src: "/fiori blender 3.png", alt: "FIORI Blender 3" },
                            { src: "/fiori combilogo.png", alt: "FIORI combilogo" },
                            { src: "/illustrator.png", alt: "Illustrator" },
                            { src: "/photoshop.png", alt: "Photoshop" },
                            { src: "/fiori logo.png", alt: "FIORI logo" },
                            { src: "/fiori papegaai shirt.png", alt: "FIORI papegaai shirt" },
                            { src: "/fiori t shirt template fruit 3.png", alt: "FIORI T-shirt template fruit 3" },
                        ].map(({ src, alt }, idx) => {
                            const isPng = src.toLowerCase().endsWith(".png");
                            return (
                                <div
                                    key={`design-img-${idx}`}
                                    className={`overflow-hidden rounded-2xl ring-1 ring-white/10 ${isPng ? "bg-white" : "bg-transparent"}`}
                                >
                                    <img
                                        src={src}
                                        alt={alt}
                                        className="w-full aspect-4/3 object-contain"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Development section (left aligned) */}
                <section className="flex flex-col gap-0">
                    <h2 className="text-left text-5xl md:text-6xl font-black text-white tracking-tight mb-0">DEVELOPMENT</h2>
                    <p className="text-left text-white/80 max-w-3xl">
                        I started by creating a wireframe in Figma. After that, I added colors and customized it to my liking. In the few days we had left, I tried to bring it to life using Cursor AI. On the left, you can see the two designs created in Figma, and on the right, the final versions of those two designs.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { src: "/cursor ss.png", alt: "Cursor screenshot" },
                            { src: "/carrousel fiori.png", alt: "Carrousel FIORI" },
                            { src: "/fiori animatie loop.png", alt: "FIORI animatie loop" },
                        ].map(({ src, alt }, idx) => {
                            const isPng = src.toLowerCase().endsWith(".png");
                            return (
                                <div
                                    key={`dev-img-${idx}`}
                                    className={`overflow-hidden rounded-2xl ring-1 ring-white/10 ${isPng ? "bg-white" : "bg-transparent"}`}
                                >
                                    <img
                                        src={src}
                                        alt={alt}
                                        className="w-full aspect-4/3 object-contain"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}


