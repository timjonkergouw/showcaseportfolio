import DiamondGradient from "@/components/DiamondGradient";
import Image from "next/image";
import TiltImage from "@/components/TiltImage";
import RevealOnScroll from "@/components/RevealOnScroll";
import FadeInOnLoad from "@/components/FadeInOnLoad";
import Footer from "@/components/Footer";
import InlineCarousel from "@/components/InlineCarousel";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#1a1a1a] flex flex-col" style={{ position: 'relative' }}>
            <DiamondGradient hex="#9A3CC3" speed={0.35} bandWidth={0.8} aspectY={0.8} aspectX={0.2} softness={2} centerOffsetPx={{ x: 40, y: 0 }} />



            <main className="relative mx-auto max-w-7xl px-6 pt-20 pb-20 md:pt-28">
                {/* Top banner: name + profile image */}
                <div className="grid grid-cols-1 md:grid-cols-2 md:items-start md:gap-6">
                    <FadeInOnLoad delayMs={150}>
                        <div className="order-2 md:order-1 md:mt-8">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] text-white tracking-tight mb-4">
                                TIM JONKERGOUW
                            </h1>
                        </div>
                    </FadeInOnLoad>

                    <FadeInOnLoad delayMs={300} fromY={6} fromScale={0.98}>
                        <div className="order-1 md:order-2 flex md:justify-end">
                            <TiltImage
                                src="/voetbal 1.png"
                                alt="Profile picture of Tim Jonkergouw"
                                sizes="(max-width: 768px) 20rem, (max-width: 1024px) 25rem, 28rem"
                                className="relative h-56 w-56 md:h-72 md:w-72 lg:h-90 lg:w-90"
                            />
                        </div>
                    </FadeInOnLoad>
                </div>

                {/* Sections */}
                <div className="mt-14 space-y-14">
                    {/* ME */}
                    <RevealOnScroll>
                        <section>
                            <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-4">ME</h2>
                            <p className="text-white/90 leading-relaxed max-w-3xl">
                                Hello, my name is Tim Jonkergouw, and I am 20 years old.
                                I come from ’s-Hertogenbosch, where I live with my parents and my younger sister.
                                I play football at the club FC Engelen, which is located in a village next to ’s-Hertogenbosch.
                                I play in the Under-23 first team. In my free time, I enjoy going out for drinks and spending time with friends.
                                I also like gaming and playing darts.
                            </p>
                            <div className="mt-6">
                                <InlineCarousel
                                    images={[
                                        { src: "/voetbal.jpg", alt: "Voetbal" },
                                        { src: "/180.jpg", alt: "180" },
                                        { src: "/festival.jpg", alt: "Festival" },
                                        { src: "/tenerife.jpg", alt: "Tenerife" },
                                        { src: "/trainer.jpg", alt: "Trainer" },
                                        { src: "/propodeuse mannen.jpg", alt: "Propodeuse mannen" },
                                    ]}
                                    visible={6}
                                    heightPx={200}
                                />
                            </div>
                        </section>
                    </RevealOnScroll>

                    {/* INTEREST */}
                    <RevealOnScroll>
                        <section className="ml-auto">
                            <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-4 text-right">INTEREST</h2>
                            <p className="text-white/90 leading-relaxed max-w-3xl ml-auto text-justify">
                                I completed my higher general secondary education (HAVO) and then started studying ICT at Fontys University in Tilburg.
                                I chose this program because I have always been interested in working with computers and experimenting with programs such as Photoshop and Sony Vegas.
                                Through this, I discovered that I really enjoy the creative side of things. So, in the second semester, I decided to focus on Media Design, and in the third semester, I started working on Front-End Development to learn more about coding. In the fourth semester, I moved on to Media Creation in Eindhoven, because I have always enjoyed being creative.
                            </p>
                            <div className="mt-6 ml-auto max-w-7xl">
                                <InlineCarousel
                                    images={[
                                        { src: "/diploma.jpg", alt: "Diploma" },
                                        { src: "/propodeuse.jpg", alt: "Propedeuse" },
                                        { src: "/schoolfoto.jpg", alt: "Schoolfoto" },
                                        { src: "/pc build.jpg", alt: "PC build" },
                                        { src: "/fiori animatie loop.gif", alt: "Fiori animatie loop" },
                                        { src: "/schoolfoto.jpg", alt: "Schoolfoto" },
                                    ]}
                                    visible={6}
                                    heightPx={200}
                                />
                            </div>
                        </section>
                    </RevealOnScroll>

                    {/* QUALITIES */}
                    <RevealOnScroll>
                        <section>
                            <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-4">QUALITIES</h2>
                            <p className="text-white/90 leading-relaxed max-w-3xl">
                                My strengths mainly lie in the design aspect.
                                I'm skilled at creating web designs and coming up with creative solutions to design challenges.
                                In addition, I have a decent level of programming knowledge.
                                I can usually find the solutions I need by effectively using AI tools and resources.
                                I enjoy combining design and technology to create user-friendly and visually appealing digital experiences.
                            </p>
                            <div className="mt-6">
                                <InlineCarousel
                                    images={[
                                        { src: "/fiori blender 3.png", alt: "Fiori Blender 3" },
                                        { src: "/illustrator.png", alt: "Illustrator" },
                                        { src: "/landen ql.png", alt: "Landen QL" },
                                        { src: "/photoshop.png", alt: "Photoshop" },
                                        { src: "/cursor ss.png", alt: "Cursor screenshot" },
                                    ]}
                                    visible={4}
                                    heightPx={160}
                                />
                            </div>
                        </section>
                    </RevealOnScroll>
                </div>
            </main>

            <Footer />
        </div>
    );
}


