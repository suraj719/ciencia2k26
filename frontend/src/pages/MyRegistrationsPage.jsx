import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Calendar, MapPin, Tag, CheckCircle, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { allEvents } from "../constants/eventsData";

const MyRegistrationsPage = () => {
    const { token, user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/registrations/my`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                if (res.ok) {
                    setRegistrations(data);
                } else if (res.status === 401 || res.status === 400) {
                    logout();
                    navigate("/login");
                }
            } catch (err) {
                console.error("Fetch registrations error:", err);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchRegistrations();
    }, [token, logout, navigate]);

    // Deduplicate registrations: prioritize completed, otherwise latest pending.
    const uniqueRegistrations = React.useMemo(() => {
        const eventMap = {};
        for (const reg of registrations) {
            if (!eventMap[reg.eventId]) eventMap[reg.eventId] = [];
            eventMap[reg.eventId].push(reg);
        }
        const unique = [];
        for (const eventId in eventMap) {
            const regs = eventMap[eventId];
            const completed = regs.find(r => r.paymentStatus === "completed");
            if (completed) {
                unique.push(completed);
            } else {
                unique.push(regs[regs.length - 1]);
            }
        }
        return unique.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }, [registrations]);

    return (
        <div className="min-h-screen bg-pattern-dots">
            <Navbar />

            <main className="container mx-auto px-6 py-32 md:py-40">
                <div className="mb-12">
                    <h1 className="font-heading text-4xl md:text-6xl font-black text-black uppercase mb-4">
                        <span className="text-[#22d3ee]"> My Registrations</span>
                    </h1>
                    <p className="text-slate-900 font-mono text-lg font-bold">
                        Hi {user?.email}, here are your booked events
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 border-8 border-black border-t-[#22d3ee] rounded-full animate-spin mb-4" />
                        <p className="font-black uppercase tracking-widest text-black">Loading your tickets...</p>
                    </div>
                ) : uniqueRegistrations.length === 0 ? (
                    <div className="text-center py-20 bg-white border-4 border-black shadow-[8px_8px_0_#000] p-12">
                        <h2 className="text-2xl font-black mb-4 text-black">You haven't registered for any events yet!</h2>
                        <Link
                            to="/events"
                            className="inline-block px-8 py-4 bg-[#22d3ee] text-black border-2 border-black font-black uppercase tracking-wider hover:translate-y-1 hover:shadow-none transition-all shadow-[4px_4px_0_#000]"
                        >
                            Explore Events
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {uniqueRegistrations.map((reg) => {
                            const eventInfo = allEvents.find(e => e.id === reg.eventId) || {
                                name: "Event - " + reg.eventId,
                                category: "General",
                                image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80"
                            };

                            return (
                                <div key={reg._id} className="group relative">
                                    {/* Decorative Ticket Stub Clip */}
                                    <div className="ticket-clipper bg-white border-4 border-black shadow-[8px_8px_0_#000] transition-transform group-hover:-translate-y-2">
                                        <div className="relative h-48 overflow-hidden border-b-4 border-black text-black">
                                            <img
                                                src={eventInfo.image}
                                                alt={eventInfo.name}
                                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                            />
                                            <div className="absolute top-4 right-4 bg-white border-2 border-black px-3 py-1 text-xs font-black uppercase text-black">
                                                {reg.paymentStatus}
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Tag size={14} className="text-[#22d3ee]" />
                                                <span className="text-xs font-black uppercase text-slate-600">{eventInfo.category}</span>
                                            </div>

                                            <h3 className="font-heading text-xl font-bold text-black mb-4 line-clamp-1">
                                                {eventInfo.name}
                                            </h3>

                                            <div className="space-y-2 mb-6 text-slate-800">
                                                <div className="flex items-center gap-3 text-sm font-bold">
                                                    <Calendar size={16} />
                                                    <span>{eventInfo.date || "March 15, 2026"}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm font-bold">
                                                    <MapPin size={16} />
                                                    <span>{eventInfo.venue || "Main Auditorium"}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm font-bold">
                                                    <Clock size={16} />
                                                    <span>{eventInfo.time || "10:00 AM"}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-black/10">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-slate-500">Order ID</p>
                                                    <p className="text-xs font-mono font-bold text-black">{reg.razorpayOrderId?.split('_').pop() || "Pending"}</p>
                                                </div>
                                                {reg.paymentStatus === "completed" ? (
                                                    <div className="flex items-center gap-1 text-green-700 font-black text-xs uppercase">
                                                        <CheckCircle size={14} /> Confirmed
                                                    </div>
                                                ) : (
                                                    <Link to={`/event/${eventInfo.id}`} className="flex items-center gap-1 px-3 py-1.5 bg-amber-400 text-black border-2 border-black shadow-[2px_2px_0_#000] hover:translate-y-px hover:shadow-none transition-all font-black text-xs uppercase cursor-pointer">
                                                        <Clock size={14} /> Continue
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default MyRegistrationsPage;
