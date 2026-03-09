import React, { useEffect, useRef, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { allEvents } from "../constants/eventsData";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
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
  CheckCircle,
  X,
  Plus,
} from "lucide-react";

// Derive generalised prize pool from budget amount
const derivePrizes = (event) => {
  if (event.category === "Non-Technical" || event.category === "Special") return null;
  if (event.prizes && event.prizes.length > 0) return event.prizes;
  if (event.isFree || !event.budget) return null;

  const b = event.budget;
  let poolAmount = b;

  if (b % 1000 === 500) {
    poolAmount = b - 500;
  }

  return [`Prize Pool: ₹${poolAmount.toLocaleString()}`];
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
  const { user, token, logout } = useContext(AuthContext);

  // Registration Form State
  const [showRegModal, setShowRegModal] = React.useState(false);
  const [regFormData, setRegFormData] = React.useState({
    teamName: "",
    teamLeadName: "",
    teamMembers: [],
    phone: "",
    college: "",
    needsRental: false
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [registration, setRegistration] = React.useState(null);

  React.useEffect(() => {
    const fetchRegistrationStatus = async () => {
      if (!token || !user) return;
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/registrations/my`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const eventRegs = data.filter(r => r.eventId === eventId);
          if (eventRegs.length > 0) {
            const activeReg = eventRegs.find(r => r.paymentStatus === "completed") || eventRegs[eventRegs.length - 1];
            setRegistration(activeReg);
            if (activeReg.paymentStatus === "pending" && activeReg.details) {
              setRegFormData({
                teamName: activeReg.details.teamName || "",
                teamLeadName: activeReg.details.teamLeadName || "",
                teamMembers: activeReg.details.members || [],
                phone: activeReg.details.phone || "",
                college: activeReg.details.college || "",
                needsRental: activeReg.details.needsRental || false
              });
            }
          }
        } else if (res.status === 401 || res.status === 400) {
          logout();
          navigate('/login');
        }
      } catch (err) {
        console.error("Fetch registrations error:", err);
      }
    };
    fetchRegistrationStatus();
  }, [token, user, eventId, logout, navigate]);

  const handleRegisterClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowRegModal(true);
  };

  const addMember = () => {
    const maxLimit = parseInt(event.maxTeamSize) || 4;
    // Total participants = 1 (lead) + current members
    if (regFormData.teamMembers.length < maxLimit - 1) {
      setRegFormData({ ...regFormData, teamMembers: [...regFormData.teamMembers, ""] });
    } else {
      toast.error(`Maximum team size for this event is ${maxLimit}`);
    }
  };

  const removeMember = (index) => {
    const newMembers = regFormData.teamMembers.filter((_, i) => i !== index);
    setRegFormData({ ...regFormData, teamMembers: newMembers });
  };

  const handleMemberChange = (index, value) => {
    const newMembers = [...regFormData.teamMembers];
    newMembers[index] = value;
    setRegFormData({ ...regFormData, teamMembers: newMembers });
  };

  const handlePayment = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    const loadScript = (src) => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      setIsSubmitting(false);
      return;
    }

    // Calculate total fee
    const isTeamEvent = event.teamSize && !["Solo", "Individual"].includes(event.teamSize);
    const numParticipants = isTeamEvent ? (1 + regFormData.teamMembers.length) : 1;
    const unitFee = event.registrationFee || 0;
    const rentalFee = (event.hasRentalOption && regFormData.needsRental) ? 20 : 0;
    const feeAmount = event.isFeePerTeam ? (unitFee + rentalFee) : (numParticipants * (unitFee + rentalFee));
    const paymentDescription = `Registration for ${event.name}`;

    try {
      // Create order
      const result = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          eventId: event.id,
          feeAmount,
          details: {
            teamName: regFormData.teamName || "Solo",
            teamLeadName: regFormData.teamLeadName,
            college: regFormData.college,
            phone: regFormData.phone,
            members: regFormData.teamMembers,
            needsRental: regFormData.needsRental
          }
        })
      });
      const data = await result.json();

      if (!result.ok) {
        toast.error(data.error || "Failed to create order");
        if (result.status === 401 || result.status === 400) {
          logout();
          navigate("/login");
        }
        setIsSubmitting(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        name: "Ciencia 2K26",
        description: paymentDescription,
        order_id: data.order.id,
        handler: async function (response) {
          const verifyRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payments/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              registrationId: data.registrationId
            })
          });

          if (verifyRes.ok) {
            setShowRegModal(false);
            navigate('/my-registrations');
          } else {
            toast.error('Payment verification failed!');
          }
          setIsSubmitting(false);
        },
        prefill: {
          name: user.email,
          email: user.email,
        },
        theme: {
          color: "#22d3ee",
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error(err);
      toast.error('Network error or server down');
      setIsSubmitting(false);
    }
  };

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
  const isTeamEvent = event.teamSize && !["Solo", "Individual"].includes(event.teamSize);
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
                  <div className={`grid gap-4 ${prizes.length === 1 ? "grid-cols-1 max-w-xs" : prizes.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
                    {prizes.map((prize, i) => {
                      const shadows = ["shadow-[4px_4px_0_#f59e0b]", "shadow-[4px_4px_0_#9ca3af]", "shadow-[4px_4px_0_#b45309]"];
                      return (
                        <div key={i} className={`text-center p-6 border-2 border-black bg-white ${shadows[i % shadows.length]} hover:-translate-y-1 transition-transform flex flex-col justify-center items-center gap-2`}>
                          <Trophy size={28} className="text-yellow-500 drop-shadow-sm" />
                          <div className="text-xl md:text-2xl font-black font-heading text-black">{prize}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}


            </div>

            {/* Sidebar */}
            <div>
              <div className="detail-content ticket-clipper bg-[#fff1f2] drop-shadow-ticket sticky top-24">
                <div className="p-7 pb-14">
                  <div className="border-b-2 border-dashed border-black/20 pb-4 mb-6 text-center">
                    <h3 className="font-heading text-xl font-bold text-black">EVENT DETAILS</h3>
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
                          <div className="text-black font-bold whitespace-pre-line leading-relaxed">{event.venue}</div>
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
                    {/* Registration fee */}
                    {event.registrationFee && (
                      <div className="flex items-start gap-3">
                        <Trophy size={20} className="text-black flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-bold uppercase text-slate-500 mb-0.5">Registration Fee</div>
                          <div className="text-black font-bold">₹{event.registrationFee}{isTeamEvent ? (event.isFeePerTeam ? " per team" : " per member") : ""}</div>
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
                    ) : registration?.paymentStatus === "completed" ? (
                      <div className="block w-full px-6 py-4 bg-green-500 text-black border-2 border-black shadow-[4px_4px_0_#000] text-center font-heading text-xl uppercase cursor-not-allowed">
                        <span className="flex items-center justify-center gap-2"><CheckCircle size={24} /> Registered</span>
                      </div>
                    ) : registration?.paymentStatus === "pending" ? (
                      <button
                        onClick={handleRegisterClick}
                        className="block w-full px-6 py-4 bg-amber-400 text-black border-2 border-black shadow-[4px_4px_0_#000] text-center font-heading text-xl hover:translate-y-1 hover:shadow-none transition-all uppercase"
                        data-testid="continue-register-event-btn"
                      >
                        <span className="flex items-center justify-center gap-2"><Clock size={24} /> Continue Registration</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleRegisterClick}
                        className="block w-full px-6 py-4 bg-[#22d3ee] text-black border-2 border-black shadow-[4px_4px_0_#000] text-center font-heading text-xl hover:translate-y-1 hover:shadow-none transition-all uppercase"
                        data-testid="register-event-btn"
                      >
                        Register Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Registration Modal */}
      {showRegModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white border-4 border-black shadow-[8px_8px_0_#000] overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="bg-[#22d3ee] border-b-4 border-black p-6 flex justify-between items-center">
              <h2 className="font-heading text-2xl md:text-3xl font-black text-black uppercase">
                Event Registration
              </h2>
              <button
                onClick={() => setShowRegModal(false)}
                className="p-2 bg-white border-2 border-black hover:bg-red-400 transition-colors shadow-[2px_2px_0_#000] text-black"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handlePayment} className="p-6 md:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div>
                <h3 className="text-xl font-bold text-black mb-2">{event.name}</h3>
                <p className="text-slate-500 font-mono text-sm uppercase">Category: {event.category} • Fee: ₹{event.registrationFee || "100"}{event.isFeePerTeam ? " (Per Team)" : ""}</p>
              </div>

              {event.teamSize && ["Solo", "Individual"].includes(event.teamSize) ? (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-black uppercase text-slate-700">Participant Name</label>
                      <input type="text" required placeholder="Enter name" className="w-full p-3 border-2 border-black focus:bg-[#22d3ee]/10 outline-none font-bold text-black" value={regFormData.teamName} onChange={(e) => setRegFormData({ ...regFormData, teamName: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-black uppercase text-slate-700">Phone Number</label>
                      <input type="tel" required placeholder="Enter contact number" className="w-full p-3 border-2 border-black focus:bg-[#22d3ee]/10 outline-none font-bold text-black" value={regFormData.phone} onChange={(e) => setRegFormData({ ...regFormData, phone: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-black uppercase text-slate-700">College Name</label>
                    <input type="text" required placeholder="Your college / institution" className="w-full p-3 border-2 border-black focus:bg-[#22d3ee]/10 outline-none font-bold text-black" value={regFormData.college} onChange={(e) => setRegFormData({ ...regFormData, college: e.target.value })} />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-black uppercase text-slate-700">Team Name</label>
                      <input type="text" required placeholder="Enter team name" className="w-full p-3 border-2 border-black focus:bg-[#22d3ee]/10 outline-none font-bold text-black" value={regFormData.teamName} onChange={(e) => setRegFormData({ ...regFormData, teamName: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-black uppercase text-slate-700">Team Lead Name</label>
                      <input type="text" required placeholder="Enter lead name" className="w-full p-3 border-2 border-black focus:bg-[#22d3ee]/10 outline-none font-bold text-black" value={regFormData.teamLeadName} onChange={(e) => setRegFormData({ ...regFormData, teamLeadName: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-black uppercase text-slate-700">Team Lead Phone Number</label>
                      <input type="tel" required placeholder="Enter contact number" className="w-full p-3 border-2 border-black focus:bg-[#22d3ee]/10 outline-none font-bold text-black" value={regFormData.phone} onChange={(e) => setRegFormData({ ...regFormData, phone: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-black uppercase text-slate-700">College Name</label>
                      <input type="text" required placeholder="Your college / institution" className="w-full p-3 border-2 border-black focus:bg-[#22d3ee]/10 outline-none font-bold text-black" value={regFormData.college} onChange={(e) => setRegFormData({ ...regFormData, college: e.target.value })} />
                    </div>
                  </div>
                </>
              )}

              {event.hasRentalOption && (
                <div className="p-4 bg-indigo-50 border-2 border-indigo-200 flex items-center gap-4">
                  <input
                    type="checkbox"
                    id="needsRental"
                    className="w-5 h-5 accent-indigo-600"
                    checked={regFormData.needsRental}
                    onChange={(e) => setRegFormData({ ...regFormData, needsRental: e.target.checked })}
                  />
                  <label htmlFor="needsRental" className="text-sm font-bold text-indigo-900 cursor-pointer">
                    Do you need to rent a car? (+₹20 extra)
                  </label>
                </div>
              )}

              {event.teamSize && !["Solo", "Individual"].includes(event.teamSize) && (
                <div className="space-y-4 pt-4 border-t-2 border-dashed border-slate-200">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-black uppercase text-slate-700">Team Members</label>
                    <button
                      type="button"
                      onClick={addMember}
                      className="flex items-center gap-1 px-3 py-1 bg-white border-2 border-black text-xs font-bold hover:bg-slate-100 shadow-[2px_2px_0_#000] text-black"
                    >
                      <Plus size={14} /> Add Member
                    </button>
                  </div>
                  <div className="space-y-3">
                    {regFormData.teamMembers.map((member, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          required
                          placeholder={`Member #${idx + 1} Name`}
                          className="flex-1 p-3 border-2 border-black focus:bg-[#22d3ee]/10 outline-none font-bold text-black"
                          value={member}
                          onChange={(e) => handleMemberChange(idx, e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => removeMember(idx)}
                          className="p-3 bg-red-100 border-2 border-black hover:bg-red-200 text-black"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {event.registrationFee > 0 && (
                <div className="mt-8 p-4 bg-slate-50 border-2 border-black border-dashed flex justify-between items-center">
                  <span className="text-sm font-black uppercase text-slate-700">Total Registration Fee</span>
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-500 uppercase">
                      {event.isFeePerTeam ? "Flat Team Fee" : `${isTeamEvent ? (1 + regFormData.teamMembers.length) : 1} × ₹${event.registrationFee + ((event.hasRentalOption && regFormData.needsRental) ? 20 : 0)}`}
                    </div>
                    <div className="text-2xl font-black text-black">
                      ₹{event.isFeePerTeam ? (event.registrationRequired ? event.registrationFee + ((event.hasRentalOption && regFormData.needsRental) ? 20 : 0) : 0) : ((isTeamEvent ? (1 + regFormData.teamMembers.length) : 1) * (event.registrationFee + ((event.hasRentalOption && regFormData.needsRental) ? 20 : 0)))}
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-6">
                {/* SDK Implementation - Restored */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-black text-white font-heading text-xl uppercase tracking-widest hover:bg-[#22d3ee] hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    "Confirm & Proceed to Payment"
                  )}
                </button><p className="text-center text-xs text-slate-400 mt-4 italic font-medium">
                  By clicking proceed, you agree to the event rules and guidelines.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailPage;
