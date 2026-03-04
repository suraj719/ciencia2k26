import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { teamMembers } from "../constants/eventsData";

gsap.registerPlugin(ScrollTrigger);

const TeamSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".team-card", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="team"
      className="relative overflow-hidden bg-[#030712]"
      data-testid="team-section"
    >
      {/* Hero Header - Matching Events Page Style */}
      <div className="relative pt-28 pb-16 bg-pattern-dots border-b-4 border-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
          <p className="font-mono text-indigo-400 text-sm uppercase tracking-[0.3em] mb-4">Ciencia 2K26 · Core Team</p>
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-white drop-shadow-[4px_4px_0_#000] mb-6">
            MEET THE <span className="text-[#ec4899]">TEAM</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-body">
            The dedicated minds working behind the scenes to make Ciencia 2K26 a grand success.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-20">
        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="team-card group relative glass-effect rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300"
              data-testid={`team-member-${member.name.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {/* Image */}
              <div className="relative h-80 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/30 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-heading text-2xl font-bold text-white mb-1 leading-tight">
                  {member.name}
                </h3>
                <p className="text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative Orbs */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
    </section>
  );
};

export default TeamSection;
