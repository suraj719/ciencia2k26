import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Mic2, Zap, Users } from "lucide-react";

const FlagshipSpotlight = () => {
    const navigate = useNavigate();
    const sectionRef = useRef(null);

    return (
        <section
            ref={sectionRef}
            className="relative py-24 bg-[#030712] overflow-hidden border-t-4 border-black"
        >
            {/* Background pattern */}
            <div className="absolute inset-0 bg-pattern-dots opacity-40 pointer-events-none" />

            {/* Scrolling ticker tape */}
            <div className="w-full overflow-hidden bg-[#ef4444] border-y-4 border-black py-3 mb-16 relative z-10">
                <div className="flex animate-marquee whitespace-nowrap gap-12">
                    {Array(8).fill(null).map((_, i) => (
                        <span key={i} className="flex items-center gap-6 font-heading text-lg font-black text-white uppercase tracking-widest">
                            <Zap size={18} className="text-yellow-300 flex-shrink-0" />
                            Startup or Shut Down
                            <span className="text-yellow-300">★</span>
                            ft. Charan Lakkaraju
                            <span className="text-yellow-300">★</span>
                            CEO, Student Tribe
                            <span className="text-yellow-300">★</span>
                            March 13, 2026
                        </span>
                    ))}
                </div>
            </div>

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* ── LEFT: Text content ── */}
                    <div className="space-y-8">
                        {/* Badge */}
                        <div className="flex flex-wrap gap-3">
                            <span className="inline-flex items-center gap-2 bg-[#ef4444] text-white px-4 py-2 text-xs font-black uppercase tracking-wider border-2 border-black shadow-[3px_3px_0_#000]">
                                <Zap size={14} /> Flagship Event
                            </span>
                            <span className="inline-flex items-center gap-2 bg-[#fefce8] text-black px-4 py-2 text-xs font-black uppercase tracking-wider border-2 border-black shadow-[3px_3px_0_#000]">
                                March 13th · ₹50
                            </span>
                        </div>

                        {/* Headline */}
                        <div>
                            <h2 className="font-heading text-6xl md:text-7xl lg:text-8xl font-black text-white leading-none mb-2 drop-shadow-[4px_4px_0_#ef4444]">
                                STARTUP
                            </h2>
                            <h2 className="font-heading text-6xl md:text-7xl lg:text-8xl font-black leading-none mb-2">
                                <span className="text-[#ef4444] drop-shadow-[4px_4px_0_#000]">OR</span>
                            </h2>
                            <h2 className="font-heading text-6xl md:text-7xl lg:text-8xl font-black text-white leading-none drop-shadow-[4px_4px_0_#ef4444]">
                                SHUT DOWN
                            </h2>
                        </div>

                        {/* Speaker info */}
                        <div className="flex items-center gap-4 bg-white/5 border-2 border-white/10 backdrop-blur-sm px-5 py-4 w-fit">
                            <Mic2 size={28} className="text-[#ef4444] flex-shrink-0" />
                            <div>
                                <div className="text-white font-black text-lg leading-tight">Charan Lakkaraju</div>
                                <div className="text-slate-400 text-sm font-mono">CEO & Founder · Student Tribe</div>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-slate-300 text-lg leading-relaxed font-medium max-w-lg">
                            The most electric session of Ciencia 2K26. Hear the unfiltered story
                            of building Student Tribe from scratch, then step up and pitch your
                            own idea. Brutal feedback. Real stakes. One question — are you ready?
                        </p>

                        {/* Stats row */}
                        <div className="flex flex-wrap gap-6">
                            {[
                                { icon: <Mic2 size={20} />, label: "LIVE TALK", sub: "Entrepreneurship" },
                                { icon: <Users size={20} />, label: "PITCH ROUND", sub: "Your idea gets judged" },
                                { icon: <Zap size={20} />, label: "FLAGSHIP", sub: "Don't miss this" },
                            ].map(({ icon, label, sub }) => (
                                <div key={label} className="flex items-center gap-3">
                                    <div className="p-2 bg-[#ef4444] border-2 border-black text-white shadow-[2px_2px_0_#000]">
                                        {icon}
                                    </div>
                                    <div>
                                        <div className="text-white text-xs font-black uppercase tracking-wide">{label}</div>
                                        <div className="text-slate-400 text-xs font-mono">{sub}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <button
                            onClick={() => navigate("/event/startup-or-shut-down")}
                            className="group flex items-center gap-3 bg-[#ef4444] text-white px-8 py-4 border-4 border-black shadow-[6px_6px_0_#000] font-heading text-xl uppercase tracking-wider hover:translate-y-1 hover:shadow-[3px_3px_0_#000] transition-all"
                        >
                            Register Now
                            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* ── RIGHT: Big image card ── */}
                    <div className="relative flex justify-center lg:justify-end">
                        {/* Decorative background blocks */}
                        <div className="absolute -top-6 -right-6 w-full h-full bg-[#ef4444] border-4 border-black -z-0" />
                        <div className="absolute -top-3 -right-3 w-full h-full bg-yellow-300 border-4 border-black -z-0" />

                        {/* Main image card */}
                        <div className="relative z-10 border-4 border-black shadow-[10px_10px_0_#000] overflow-hidden w-full max-w-md lg:max-w-full">
                            <img
                                src="/PHOTO-2026-03-11-20-28-09.jpg"
                                alt="Startup or Shut Down ft. Charan Lakkaraju"
                                className="w-full object-cover object-top"
                                style={{ aspectRatio: "3/4", maxHeight: "600px" }}
                            />
                            {/* Overlay strip at bottom */}
                            <div className="absolute bottom-0 left-0 right-0 bg-black border-t-4 border-black px-5 py-4">
                                <div className="font-heading text-white text-xl font-black uppercase">Charan Lakkaraju</div>
                                <div className="text-[#ef4444] text-sm font-mono font-bold">CEO, Student Tribe · March 13th, 2026</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default FlagshipSpotlight;
