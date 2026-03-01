import React, { useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { allEvents } from "../constants/eventsData";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  FileText,
  ArrowLeft,
  Clock,
  Tag,
  CheckCircle2,
} from "lucide-react";

// Derive generalised prize tiers from budget amount
const derivePrizes = (event) => {
  if (event.prizes && event.prizes.length > 0) return event.prizes;
  if (event.isFree || !event.budget) return null;

  const b = event.budget;
  // Rough split: ~45% / ~30% / ~25% of budget as 1st/2nd/3rd
  if (b >= 10000) {
    const first = Math.round((b * 0.45) / 100) * 100;
    const second = Math.round((b * 0.30) / 100) * 100;
    const third = b - first - second;
    return [`₹${first.toLocaleString()}`, `₹${second.toLocaleString()}`, `₹${third.toLocaleString()}`];
  }
  if (b >= 3000) {
    const first = Math.round((b * 0.55) / 100) * 100;
    const second = b - first;
    return [`₹${first.toLocaleString()}`, `₹${second.toLocaleString()}`];
  }
  return [`₹${b.toLocaleString()}`];
};

const DEFAULT_RULES = [
  "College ID card is mandatory for participation.",
  "Participants must report to the venue 15 minutes before the event.",
  "Judges' decisions will be final and binding.",
  "Any form of malpractice will lead to immediate disqualification.",
  "Team size must comply with the specified limit.",
];

const EventDetailPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const event = allEvents.find((e) => e.id === eventId);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.from(".detail-header", {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    }, pageRef);
    return () => ctx.revert();
  }, [eventId]);

  if (!event) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-heading font-bold text-white mb-4">Event Not Found</h1>
          <Link to="/events" className="text-indigo-400 hover:text-indigo-300">
            Browse all events →
          </Link>
        </div>
      </div>
    );
  }

  const prizes = derivePrizes(event);
  const rules = event.rules?.length ? event.rules : DEFAULT_RULES;
  const isSpecial = event.category === "Special";
  const isNoReg = !event.registrationRequired;

  const categoryColors = {
    Technical: "bg-[#ddd6fe] text-black",
    "Non-Technical": "bg-[#cbf0f8] text-black",
    Special: "bg-[#fde68a] text-black",
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-pattern-dots" data-testid="event-detail-page">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-end pt-32 pb-16 overflow-hidden border-b-4 border-black">
        <div className="absolute inset-0 z-0">
          <img
            src={event.image || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80"}
            alt={event.name}
            className="w-full h-full object-cover opacity-50"
            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
        </div>

        <div className="relative z-10 container mx-auto px-6 md:px-12">
          <button
            onClick={() => navigate("/events")}
            className="detail-header flex items-center gap-2 text-white hover:text-[#22d3ee] mb-8 transition-colors font-bold bg-black/50 px-4 py-2 rounded-full w-fit backdrop-blur-md border border-white/20"
            data-testid="back-button"
          >
            <ArrowLeft size={20} />
            <span>All Events</span>
          </button>

          <div className="detail-header">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider border-2 border-black shadow-[3px_3px_0_#000] ${categoryColors[event.category] || "bg-white text-black"}`}>
                {event.category}
              </span>
              {event.dept && (
                <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider bg-slate-800 text-slate-200 border border-slate-600">
                  {event.dept}
                </span>
              )}
              {isNoReg && (
                <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider bg-green-500 text-white border-2 border-black shadow-[3px_3px_0_#000]">
                  Free Entry
                </span>
              )}
            </div>
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] leading-tight">
              {event.name}
            </h1>
            <p className="text-xl md:text-2xl text-white/80 font-mono bg-black/50 inline-block px-3 py-1 backdrop-blur-sm">
              {event.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-3 gap-12">

            {/* Left column */}
            <div className="lg:col-span-2 space-y-8">

              {/* About */}
              <div className="card-sassy p-8">
                <h2 className="font-heading text-2xl font-bold text-black mb-5 border-b-4 border-[#22d3ee] inline-block">
                  About the Event
                </h2>
                <p className="text-slate-700 leading-relaxed text-base font-medium">
                  {event.fullDescription || event.description}
                </p>
              </div>

              {/* Rules */}
              {event.id !== "5k-run" && event.id !== "flashmob" && (
                <div className="card-sassy p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <FileText size={24} className="text-indigo-600" />
                    <h2 className="font-heading text-2xl font-bold text-black border-b-4 border-indigo-400 inline-block">
                      Rules & Guidelines
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {rules.map((rule, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 size={18} className="text-indigo-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-800 font-medium">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Prizes — only show if derivable */}
              {prizes && (
                <div className="card-sassy p-8 bg-[#fefce8]">
                  <div className="flex items-center gap-3 mb-6">
                    <Trophy size={24} className="text-yellow-600" />
                    <h2 className="font-heading text-2xl font-bold text-black border-b-4 border-yellow-400 inline-block">
                      Prizes
                    </h2>
                  </div>
                  <div className={`grid gap-4 ${prizes.length === 1 ? "grid-cols-1 max-w-xs" : prizes.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
                    {prizes.map((prize, i) => {
                      const labels = ["🥇 1st Prize", "🥈 2nd Prize", "🥉 3rd Prize"];
                      const shadows = ["shadow-[4px_4px_0_#f59e0b]", "shadow-[4px_4px_0_#9ca3af]", "shadow-[4px_4px_0_#b45309]"];
                      return (
                        <div key={i} className={`text-center p-6 border-2 border-black bg-white ${shadows[i] || "shadow-[4px_4px_0_#000]"} hover:-translate-y-1 transition-transform`}>
                          <div className="text-sm font-black uppercase tracking-wider mb-2 text-slate-600">
                            {labels[i] || `Prize ${i + 1}`}
                          </div>
                          <div className="text-2xl font-black font-mono text-black mt-1">{prize}</div>
                        </div>
                      );
                    })}
                  </div>
                  {!event.prizes?.length && (
                    <p className="text-xs text-slate-400 mt-4 italic">* Prize amounts are indicative and subject to final confirmation.</p>
                  )}
                </div>
              )}

              {/* No prizes case — just certs */}
              {!prizes && !isNoReg && (
                <div className="card-sassy p-6 bg-[#fefce8] flex items-center gap-4">
                  <Trophy size={24} className="text-yellow-500 flex-shrink-0" />
                  <p className="text-slate-700 font-medium">Winners receive <strong>Certificates & Medals</strong></p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <div className="detail-content ticket-clipper bg-[#fff1f2] drop-shadow-ticket sticky top-24">
                <div className="p-7 pb-14">
                  <div className="border-b-2 border-dashed border-black/20 pb-4 mb-6 text-center">
                    <h3 className="font-heading text-xl font-bold text-black">EVENT DETAILS</h3>
                    <div className="text-xs font-mono uppercase text-slate-500">ADMIT ONE</div>
                  </div>

                  <div className="space-y-5">
                    {/* Date */}
                    {event.date && (
                      <div className="flex items-start gap-3">
                        <Calendar size={20} className="text-black flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-bold uppercase text-slate-500 mb-0.5">Date</div>
                          <div className="text-black font-bold">{event.date}</div>
                        </div>
                      </div>
                    )}
                    {/* Time */}
                    {event.time && (
                      <div className="flex items-start gap-3">
                        <Clock size={20} className="text-black flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-bold uppercase text-slate-500 mb-0.5">Time</div>
                          <div className="text-black font-bold">{event.time}</div>
                        </div>
                      </div>
                    )}
                    {/* Venue */}
                    {event.venue && (
                      <div className="flex items-start gap-3">
                        <MapPin size={20} className="text-black flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-bold uppercase text-slate-500 mb-0.5">Venue</div>
                          <div className="text-black font-bold">{event.venue}</div>
                        </div>
                      </div>
                    )}
                    {/* Team Size */}
                    {event.teamSize && (
                      <div className="flex items-start gap-3">
                        <Users size={20} className="text-black flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-bold uppercase text-slate-500 mb-0.5">Team Size</div>
                          <div className="text-black font-bold">{event.teamSize}</div>
                        </div>
                      </div>
                    )}
                    {/* Category */}
                    <div className="flex items-start gap-3">
                      <Tag size={20} className="text-black flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold uppercase text-slate-500 mb-0.5">Category</div>
                        <div className="text-black font-bold">{event.category}{event.dept ? ` · ${event.dept}` : ""}</div>
                      </div>
                    </div>
                    {/* Participation fee (CSI events) */}
                    {event.participationFee && (
                      <div className="flex items-start gap-3">
                        <Trophy size={20} className="text-black flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-bold uppercase text-slate-500 mb-0.5">Participation Fee</div>
                          <div className="text-black font-bold">{event.participationFee}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="mt-8">
                    {isNoReg ? (
                      event.href ? (
                        <a
                          href={event.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full px-6 py-4 bg-green-400 text-black border-2 border-black shadow-[4px_4px_0_#000] text-center font-heading text-xl hover:translate-y-1 hover:shadow-none transition-all uppercase"
                          data-testid="view-location-btn"
                        >
                          View Location
                        </a>
                      ) : (
                        <div className="block w-full px-6 py-4 bg-green-100 text-green-800 border-2 border-green-800 shadow-[4px_4px_0_#166534] text-center font-heading text-lg uppercase">
                          Open to All — Free Entry!
                        </div>
                      )
                    ) : (
                      <a
                        href="mailto:info@ciencia2k26.in"
                        className="block w-full px-6 py-4 bg-[#22d3ee] text-black border-2 border-black shadow-[4px_4px_0_#000] text-center font-heading text-xl hover:translate-y-1 hover:shadow-none transition-all uppercase"
                        data-testid="register-event-btn"
                      >
                        Register Now
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EventDetailPage;
