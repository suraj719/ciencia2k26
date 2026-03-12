import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { X, Eye, Search, Filter, Download, Users, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CoordinatorDashboard = () => {
    const { token, user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [eventFilter, setEventFilter] = useState("all");
    const [selectedReg, setSelectedReg] = useState(null);
    const [markingAttended, setMarkingAttended] = useState(false);

    const formatTime = (dateStr) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        }).toLowerCase();
    };

    const fetchRegistrations = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/coordinator/registrations`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setRegistrations(data);
            } else if (res.status === 401 || res.status === 400) {
                logout();
                navigate('/login');
            } else {
                toast.error(data.error || "Failed to fetch registrations");
            }
        } catch (err) {
            console.error(err);
            toast.error("Network error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user || (user.role !== 'coordinator' && user.role !== 'admin')) {
            navigate('/login');
            return;
        }

        fetchRegistrations();
    }, [user, token, navigate]);

    const handleMarkAttended = async (regId) => {
        if (!window.confirm("Mark this participant as attended? This action is permanent.")) return;

        setMarkingAttended(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/coordinator/mark-attended`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ registrationId: regId })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Participant marked as attended");
                // Update local state
                setRegistrations(prev => prev.map(r => r._id === regId ? { ...r, attended: true, attendedAt: new Date() } : r));
                if (selectedReg && selectedReg._id === regId) {
                    setSelectedReg(prev => ({ ...prev, attended: true, attendedAt: new Date() }));
                }
            } else {
                toast.error(data.error || "Failed to mark attendance");
            }
        } catch (err) {
            console.error(err);
            toast.error("Network error");
        } finally {
            setMarkingAttended(false);
        }
    };

    const uniqueEvents = [...new Set(registrations.map(r => r.eventId))].sort();

    const filteredRegistrations = registrations.filter(reg => {
        const matchesSearch =
            (reg.userId?.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (reg.eventId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (reg.details?.teamName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (reg.details?.teamLeadName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (reg.razorpayOrderId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (reg.razorpayPaymentId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (reg.bankRrn || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (reg._id || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchesEvent = eventFilter === "all" || reg.eventId === eventFilter;
        return matchesSearch && matchesEvent;
    });

    const totalAttended = filteredRegistrations.filter(r => r.attended).length;
    const pendingAttendance = filteredRegistrations.filter(r => r.paymentStatus === 'completed' && !r.attended).length;

    if (loading) return (
        <div className="min-h-screen bg-[#030712] flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#030712] text-white relative overflow-x-hidden">
            <Navbar />
            <div className="max-w-[1400px] mx-auto px-6 py-32 md:py-40">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-emerald-500/20 pb-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-2 uppercase tracking-tight">
                            Coordinator <span className="text-emerald-400">Dashboard</span>
                        </h1>
                        <p className="text-slate-400 font-mono text-sm">Event Check-in & Attendance Management</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={fetchRegistrations}
                            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-3 rounded-xl font-bold border border-slate-700 transition-all shadow-lg text-sm"
                        >
                            <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Refresh
                        </button>
                    </div>
                </div>

                {/* Status Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center">
                        <p className="text-slate-400 text-sm uppercase font-black mb-1">Total Bookings</p>
                        <p className="text-3xl font-heading font-bold text-white">{filteredRegistrations.length}</p>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center">
                        <p className="text-slate-400 text-sm uppercase font-black mb-1">Pending Check-in</p>
                        <p className="text-3xl font-heading font-bold text-amber-400">{pendingAttendance}</p>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center">
                        <p className="text-slate-400 text-sm uppercase font-black mb-1">Attended</p>
                        <p className="text-3xl font-heading font-bold text-emerald-400">{totalAttended}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-slate-900/80 border border-emerald-500/20 p-6 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 backdrop-blur-sm">
                    <div className="flex-1 relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search by Email, Team Name, or ID..."
                            className="w-full bg-slate-800/50 border border-slate-700 p-3 pl-12 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-slate-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative flex-1 md:flex-none">
                        <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                            className="w-full bg-slate-800/50 border border-slate-700 p-3 pl-9 pr-8 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-slate-200 min-w-[200px] appearance-none"
                            value={eventFilter}
                            onChange={(e) => setEventFilter(e.target.value)}
                        >
                            <option value="all">All My Events</option>
                            {uniqueEvents.map(ev => <option key={ev} value={ev}>{ev}</option>)}
                        </select>
                    </div>
                </div>

                {/* Main Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead>
                                <tr className="bg-slate-800/50 font-mono text-xs uppercase tracking-widest text-slate-400">
                                    <th className="p-5 font-black text-center">Actions</th>
                                    <th className="p-5 font-black">User Email</th>
                                    <th className="p-5 font-black">Event ID</th>
                                    <th className="p-5 font-black">Team / Participant</th>
                                    <th className="p-5 font-black">Attendance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRegistrations.map(reg => (
                                    <tr key={reg._id} className="hover:bg-slate-800/40 transition-colors border-t border-slate-800">
                                        <td className="p-5 flex justify-center gap-2">
                                            <button
                                                onClick={() => setSelectedReg(reg)}
                                                className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors text-slate-300"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            {!reg.attended && reg.paymentStatus === 'completed' && (
                                                <button
                                                    onClick={() => handleMarkAttended(reg._id)}
                                                    className="p-2 bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 rounded-lg transition-all text-emerald-400 hover:text-white"
                                                    title="Mark Attended"
                                                >
                                                    <CheckCircle2 size={18} />
                                                </button>
                                            )}
                                        </td>
                                        <td className="p-5">
                                            <span className="text-slate-200 font-medium">{reg.userId?.email || 'Guest User'}</span>
                                        </td>
                                        <td className="p-5">
                                            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-300 font-bold text-xs uppercase">
                                                {reg.eventId}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <div className="text-sm font-bold text-white">
                                                {reg.details?.teamName || "N/A"}
                                            </div>
                                            <div className="text-xs text-slate-400">
                                                {reg.details?.college || "-"}
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            {reg.attended ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                                    <CheckCircle2 size={12} />
                                                    Attended
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700">
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filteredRegistrations.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="p-16 text-center">

                                            <div className="flex flex-col items-center gap-4">
                                                <div className="p-4 bg-slate-800 rounded-full text-slate-600">
                                                    <Search size={32} />
                                                </div>
                                                <p className="text-slate-400 font-bold">No registrations found matching your criteria.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* View Details Modal */}
            {selectedReg && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative w-full max-w-2xl bg-[#0a0f1c] border-2 border-slate-800 shadow-2xl rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="bg-slate-900 border-b border-slate-800 p-6 flex justify-between items-center">
                            <div>
                                <h2 className="font-heading text-2xl font-black text-white uppercase tracking-wider">
                                    Registration Details
                                </h2>
                                <p className="text-sm text-slate-400 font-mono mt-1">ID: {selectedReg._id}</p>
                            </div>
                            <button
                                onClick={() => setSelectedReg(null)}
                                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">

                            {selectedReg.attended && (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center gap-3">
                                    <CheckCircle2 className="text-emerald-400" size={24} />
                                    <div>
                                        <p className="text-emerald-400 font-bold uppercase text-xs tracking-widest">Checked In</p>
                                        <p className="text-slate-300 text-sm">
                                            This participant was marked as attended on {new Date(selectedReg.attendedAt).toLocaleDateString()}, {formatTime(selectedReg.attendedAt)}
                                        </p>
                                    </div>
                                </div>
                            )}


                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">User Account</p>
                                    <p className="text-slate-200 font-bold">{selectedReg.userId?.email || 'N/A'}</p>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Event</p>
                                    <p className="text-emerald-400 font-bold uppercase">{selectedReg.eventId}</p>
                                </div>
                            </div>

                            <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700/50 space-y-4">
                                <h3 className="font-heading text-lg text-white border-b border-slate-700 pb-2">Participant Information</h3>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Team / Participant Name</p>
                                        <p className="text-white font-medium">{selectedReg.details?.teamName || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Team Lead Name</p>
                                        <p className="text-white font-medium">{selectedReg.details?.teamLeadName || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Phone Number</p>
                                        <p className="text-white font-medium">{selectedReg.details?.phone || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">College</p>
                                        <p className="text-white font-medium">{selectedReg.details?.college || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Booked At</p>
                                        <p className="text-white font-medium">{formatTime(selectedReg.createdAt)}</p>
                                    </div>

                                </div>

                                {selectedReg.details?.members && selectedReg.details.members.filter(m => m.trim() !== "").length > 0 && (
                                    <div className="pt-3 border-t border-slate-700/50 mt-4">
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2 flex items-center gap-1">
                                            <Users size={12} /> Additional Team Members
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedReg.details.members.filter(m => m.trim() !== "").map((member, i) => (
                                                <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300">
                                                    {member}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer Actions */}
                            {!selectedReg.attended && selectedReg.paymentStatus === 'completed' && (
                                <div className="pt-4">
                                    <button
                                        disabled={markingAttended}
                                        onClick={() => handleMarkAttended(selectedReg._id)}
                                        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2"
                                    >
                                        {markingAttended ? <RefreshCw className="animate-spin" /> : <CheckCircle2 />}
                                        {markingAttended ? "Marking..." : "Confirm Attendance"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default CoordinatorDashboard;
