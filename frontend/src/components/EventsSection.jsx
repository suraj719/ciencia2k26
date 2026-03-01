import { useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Calendar, MapPin, ArrowRight, Zap } from "lucide-react";
import { featuredEvents } from "../constants/eventsData";

gsap.registerPlugin(ScrollTrigger);

const EventsSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.from(".event-title-anim", {
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power4.out",
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#030712] relative overflow-hidden"
      id="events"
    >
      {/* Sticker Badge */}
      <div className="hidden md:block absolute top-10 right-10 sticker-badge rotate-12 bg-yellow-400 text-black p-4 text-xl z-20 shadow-[6px_6px_0_#000]">
        DON'T MISS OUT!
      </div>

      <div className="py-20 bg-pattern-dots border-b-4 border-black">
        <div className="container mx-auto px-4 text-center mb-10">
          <h2 className="font-heading text-5xl md:text-8xl text-white mb-6 event-title-anim drop-shadow-[6px_6px_0_#000]">
            UPCOMING <span className="text-[#ec4899]">EVENTS</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto event-title-anim font-mono">
            Join the biggest fest of the year. Technical, non-technical, and
            special events awaiting you.
          </p>
        </div>

        {/* Horizontal scrolling featured event cards */}
        <div className="flex overflow-x-auto gap-10 pb-12 pt-4 px-4 hide-scrollbar snap-x snap-mandatory">
          {featuredEvents.map((event, index) => {
            const rotations = ["rotate-1", "-rotate-2", "rotate-3", "-rotate-1", "rotate-2"];
            const rotationClass = rotations[index % rotations.length];
            const cardColors = ["bg-[#ffcfd2]", "bg-[#cbf0f8]", "bg-[#d9f99d]", "bg-[#ddd6fe]", "bg-[#fde68a]", "bg-[#fbcfe8]"];
            const cardColor = cardColors[index % cardColors.length];
            const headerColors = ["bg-[#fda4af]", "bg-[#67e8f9]", "bg-[#bef264]", "bg-[#c4b5fd]", "bg-[#fbbf24]", "bg-[#f9a8d4]"];
            const headerColor = headerColors[index % headerColors.length];

            return (
              <Link
                key={event.id}
                to={event.registrationRequired ? `/event/${event.id}` : event.href}
                className={`flex-shrink-0 w-[300px] md:w-[340px] snap-center group ${rotationClass} transition-transform duration-300 hover:scale-105 hover:rotate-0 hover:z-50`}
                data-testid={`event-card-${event.id}`}
              >
                <div className="w-full relative drop-shadow-ticket">
                  <div className={`ticket-clipper ${cardColor} flex flex-col min-h-[380px]`}>
                    {/* Ticket Header */}
                    <div className={`${headerColor} p-4 text-center border-b-2 border-dashed border-black/20 relative`}>
                      <div className="absolute top-1/2 -translate-y-1/2 left-3 w-3 h-3 bg-black rounded-full" />
                      <div className="absolute top-1/2 -translate-y-1/2 right-3 w-3 h-3 bg-black rounded-full" />
                      <div className="flex items-center justify-center gap-1 mb-1">
                        {event.category === "Special" && <Zap size={12} className="text-black" />}
                        <span className="font-mono text-xs font-bold uppercase tracking-widest text-black/60">
                          {event.category}
                        </span>
                      </div>
                      <h3 className="font-heading text-lg md:text-xl text-black uppercase tracking-wider">
                        {event.tagline || "EVENT"}
                      </h3>
                    </div>

                    {/* Ticket Body */}
                    <div className="p-5 text-black flex flex-col flex-grow relative">
                      {event.date && (
                        <div className="flex items-center gap-2 mb-3 font-mono font-bold text-xs uppercase">
                          <Calendar size={13} />
                          <span>{event.date}</span>
                        </div>
                      )}

                      <h2 className="font-heading text-2xl md:text-3xl mb-3 leading-tight text-black group-hover:text-[#ec4899] transition-colors">
                        {event.name}
                      </h2>

                      <p className="text-xs text-black/60 font-body mb-3 line-clamp-3">
                        {event.description}
                      </p>

                      <div className="mt-auto">
                        <div className="border-b-2 border-dashed border-black/30 my-3 w-full" />

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 font-mono text-xs font-bold uppercase">
                            {event.venue && (
                              <>
                                <MapPin size={13} />
                                <span className="truncate max-w-[140px]">{event.venue}</span>
                              </>
                            )}
                          </div>
                          <div className="w-9 h-9 rounded-full border-2 border-black flex items-center justify-center bg-white group-hover:bg-[#ec4899] group-hover:border-[#ec4899] group-hover:text-white transition-colors">
                            <ArrowRight size={18} className="-rotate-45 group-hover:rotate-0 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Events CTA */}
        <div className="text-center mt-4">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#ec4899] text-white font-heading text-lg uppercase tracking-wider border-4 border-black shadow-[6px_6px_0_#000] hover:shadow-[2px_2px_0_#000] hover:translate-x-1 hover:translate-y-1 transition-all duration-150"
          >
            View All Events <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
