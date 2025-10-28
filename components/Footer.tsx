import Link from 'next/link';
import { Instagram, Facebook } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#1a1a1a] text-white py-8 px-6 mt-auto relative z-10">
            <div className="max-w-7xl mx-auto">
                {/* Top Row */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8">
                    {/* Navigation */}
                    <div className="flex flex-wrap gap-8 mb-6 md:mb-0">
                        <Link href="/" className="uppercase font-bold text-sm tracking-wide hover:text-white/70 transition-colors">
                            HOME
                        </Link>
                        <Link href="/about" className="uppercase font-bold text-sm tracking-wide hover:text-white/70 transition-colors">
                            ABOUT
                        </Link>
                        <Link href="/projects" className="uppercase font-bold text-sm tracking-wide hover:text-white/70 transition-colors">
                            PROJECTS
                        </Link>
                    </div>

                    {/* Contact Info */}
                    <div className="text-sm space-y-1 text-right">
                        <p className="uppercase font-bold text-sm tracking-wide mb-2">CONTACT ME</p>
                        <p>MAIL: timjonkergouw@home.nl</p>
                        <p>PHONE: 0622350586</p>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="flex items-center gap-6">
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-70 transition-opacity"
                        aria-label="Instagram"
                    >
                        <Instagram size={24} />
                    </a>
                    <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-70 transition-opacity"
                        aria-label="Facebook"
                    >
                        <Facebook size={24} />
                    </a>
                </div>
            </div>
        </footer>
    );
}

