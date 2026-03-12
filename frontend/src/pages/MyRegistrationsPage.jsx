import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Calendar, MapPin, Tag, CheckCircle, Clock, Eye, X, Phone, School, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { allEvents } from "../constants/eventsData";

const MyRegistrationsPage = () => {
    const { token, user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReg, setSelectedReg] = useState(null);

    const formatTime = (dateStr) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        }).toLowerCase();
    };

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
                                                <div className="flex flex-col">
                                                    <p className="text-[10px] font-black uppercase text-slate-500">Order ID</p>
                                                    <p className="text-xs font-mono font-bold text-black">{reg.razorpayOrderId?.split('_').pop() || "Pending"}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {reg.paymentStatus === "completed" && (
                                                        <button
                                                            onClick={() => setSelectedReg(reg)}
                                                            className="p-1.5 bg-white border-2 border-black shadow-[2px_2px_0_#000] hover:translate-y-px hover:shadow-none transition-all"
                                                            title="View Details"
                                                        >
                                                            <Eye size={16} className="text-black" />
                                                        </button>
                                                    )}
                                                    {reg.paymentStatus === "completed" ? (
                                                        reg.attended ? (
                                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-700 border-2 border-indigo-700 font-black text-[10px] uppercase tracking-tighter rounded shadow-[2px_2px_0_#4338ca]">
                                                                <CheckCircle size={12} /> Attended
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-1 text-green-700 font-black text-xs uppercase text-right">
                                                                <CheckCircle size={14} /> Confirmed
                                                            </div>
                                                        )
                                                    ) : (
                                                        <Link to={`/event/${eventInfo.id}`} className="flex items-center gap-1 px-3 py-1.5 bg-amber-400 text-black border-2 border-black shadow-[2px_2px_0_#000] hover:translate-y-px hover:shadow-none transition-all font-black text-xs uppercase cursor-pointer">
                                                            <Clock size={14} /> Continue
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Registration Details Modal */}
            {selectedReg && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="relative w-full max-w-lg bg-white border-4 border-black shadow-[12px_12px_0_#000] overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="bg-black text-white p-6 flex justify-between items-center">
                            <div>
                                <h2 className="font-heading text-2xl font-black uppercase tracking-wider">
                                    Ticket Details
                                </h2>
                                <p className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-widest">{selectedReg._id}</p>
                            </div>
                            <button
                                onClick={() => setSelectedReg(null)}
                                className="p-2 border-2 border-white hover:bg-white hover:text-black transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto bg-pattern-dots bg-[length:20px_20px]">
                            {/* Attendance Status Banner */}
                            {selectedReg.attended && (
                                <div className="bg-indigo-100 border-4 border-indigo-700 p-4 flex items-center gap-4 shadow-[4px_4px_0_#4338ca]">
                                    <CheckCircle className="text-indigo-700 shrink-0" size={28} />
                                    <div>
                                        <p className="text-indigo-700 font-black uppercase text-sm tracking-widest">Attendance Verified</p>
                                        <p className="text-indigo-900 text-xs font-bold font-mono">Recorded on {new Date(selectedReg.attendedAt).toLocaleDateString()} at {formatTime(selectedReg.attendedAt)}</p>
                                    </div>
                                </div>
                            )}

                            {/* Section 1: Event Info */}
                            <div className="space-y-4">
                                <h3 className="font-black uppercase text-lg border-b-4 border-black pb-1 inline-block">Event Info</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white border-2 border-black p-3 shadow-[4px_4px_0_#000]">
                                        <p className="text-[10px] font-black uppercase text-slate-600 mb-1">Event ID</p>
                                        <p className="font-black text-sm uppercase text-black">{selectedReg.eventId}</p>
                                    </div>
                                    <div className="bg-white border-2 border-black p-3 shadow-[4px_4px_0_#000]">
                                        <p className="text-[10px] font-black uppercase text-slate-600 mb-1">Time Booked</p>
                                        <p className="font-black text-sm uppercase text-black">{formatTime(selectedReg.createdAt)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Team Info */}
                            <div className="bg-yellow-50 border-4 border-black p-6 space-y-6 shadow-[8px_8px_0_#000]">
                                <h3 className="font-black uppercase text-xl text-slate-600 flex items-center gap-2">
                                    <Users size={20} /> Team Details
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-600 mb-1">Team Name</p>
                                        <p className="font-black text-black">{selectedReg.details?.teamName || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-600 mb-1">Lead Name</p>
                                        <p className="font-black text-black">{selectedReg.details?.teamLeadName || "N/A"}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-black rounded shadow-[2px_2px_0_#000]">
                                            <Phone size={14} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-slate-600 mb-1">Mobile No</p>
                                            <p className="font-black text-black">{selectedReg.details?.phone || "N/A"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-black rounded shadow-[2px_2px_0_#000]">
                                            <School size={14} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-slate-600 mb-1">College</p>
                                            <p className="font-black text-black line-clamp-1">{selectedReg.details?.college || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>

                                {selectedReg.details?.members && selectedReg.details.members.filter(m => m.trim() !== "").length > 0 && (
                                    <div className="pt-4 border-t-2 border-black border-dashed">
                                        <p className="text-[10px] font-black uppercase text-slate-600 mb-3 block">Additional Members</p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedReg.details.members.filter(m => m.trim() !== "").map((member, idx) => (
                                                <span key={idx} className="bg-white border-2 border-black px-3 py-1 text-xs font-black shadow-[2px_2px_0_#000]">
                                                    {member}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Section 3: Payment Tracking */}
                            <div className="space-y-4">
                                <h3 className="font-black uppercase text-lg border-b-4 border-black pb-1 inline-block">Order Info</h3>
                                <div className="bg-slate-100 border-2 border-black p-4 font-mono text-[11px] leading-relaxed shadow-[4px_4px_0_#000]">
                                    <div className="flex justify-between border-b border-black/10 py-1">
                                        <span className="font-bold text-slate-600">Transaction ID:</span>
                                        <span className="text-black">{selectedReg.razorpayPaymentId || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-black/10 py-1">
                                        <span className="font-bold text-slate-600">Bank RRN/ARN:</span>
                                        <span className="text-black">{selectedReg.bankRrn || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="font-bold">Fee Amount:</span>
                                        <span className="font-black text-black">₹{selectedReg.feeAmount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-black p-4">
                            <button
                                onClick={() => setSelectedReg(null)}
                                className="w-full bg-[#22d3ee] text-black border-2 border-white py-3 font-black uppercase tracking-widest hover:translate-y-0.5 hover:shadow-none transition-all shadow-[4px_4px_0_#fff]"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}


            <Footer />
        </div>
    );
};

export default MyRegistrationsPage;
