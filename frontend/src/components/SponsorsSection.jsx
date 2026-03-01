import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { sponsors } from "../constants/eventsData";

gsap.registerPlugin(ScrollTrigger);

const SponsorsSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".sponsor-title", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const allSponsors = [...sponsors, ...sponsors];

  return (
    <section
      ref={sectionRef}
      id="sponsors"
      className="relative py-24 bg-pattern-dots-alt overflow-hidden"
      data-testid="sponsors-section"
    >
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="sponsor-title font-heading text-5xl md:text-6xl lg:text-7xl font-black mb-6">
            <span className="text-white">Our</span>
            <br />
            <span className="gradient-text">Sponsors</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            Powered by industry leaders who believe in innovation
          </p>
        </div>

        {/* Infinite Marquee - Silver Tier */}
        <div className="relative overflow-hidden py-8">
          <div className="flex animate-marquee">
            {allSponsors.map((sponsor, index) => (
              <div
                key={index}
                className="flex-shrink-0 mx-8 glass-effect rounded-lg p-6 hover:scale-105 transition-all duration-300"
              >
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="h-14 object-contain opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Become a Sponsor CTA */}
        <div className="text-center mt-16">
          <div className="glass-effect rounded-2xl p-12 max-w-2xl mx-auto">
            <h3 className="text-3xl font-heading font-bold text-white mb-4">
              Become a Sponsor
            </h3>
            <p className="text-slate-400 mb-8">
              Partner with us and showcase your brand to thousands of talented
              students
            </p>
            <a
              href="mailto:sponsors@ciencia2k26.in"
              className="inline-block px-8 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white font-heading rounded-full transition-all duration-300 neon-border-primary hover:scale-105"
              data-testid="become-sponsor-btn"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl -z-10"></div>
    </section>
  );
};

export default SponsorsSection;
