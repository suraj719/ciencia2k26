import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { teamMembers } from "../constants/eventsData";
import { Linkedin, Twitter, Mail } from "lucide-react";

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
      className="relative py-24 md:py-32 overflow-hidden bg-pattern-dots"
      data-testid="team-section"
    >
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl font-black mb-6">
            <span className="gradient-text">Meet</span>
            <br />
            <span className="text-white">Our Team</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            The dedicated minds behind Ciencia 2k26
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
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
                <h3 className="font-heading text-2xl font-bold text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-cyan-400 font-mono text-sm mb-4">
                  {member.role}
                </p>

                {/* Social Links */}
                <div className="flex gap-4">
                  <a
                    href="https://www.linkedin.com/in/surajthammi/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 glass-effect rounded-lg hover:bg-indigo-600/30 transition-colors"
                    data-testid={`linkedin-${member.name.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <Linkedin size={18} className="text-slate-300" />
                  </a>
                  <a
                    href="https://x.com/0xsuraj719"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 glass-effect rounded-lg hover:bg-cyan-600/30 transition-colors"
                    data-testid={`twitter-${member.name.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <Twitter size={18} className="text-slate-300" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl -z-10"></div>
    </section>
  );
};

export default TeamSection;
