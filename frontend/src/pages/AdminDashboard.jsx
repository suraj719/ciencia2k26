import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { X, Eye, Search, Filter, Download, Users } from 'lucide-react';

const AdminDashboard = () => {
    const { token, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [eventFilter, setEventFilter] = useState("all");
    const [selectedReg, setSelectedReg] = useState(null);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }

        const fetchRegistrations = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/registrations`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) setRegistrations(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRegistrations();
    }, [user, token, navigate]);

    const uniqueEvents = [...new Set(registrations.map(r => r.eventId))].sort();

    const filteredRegistrations = registrations.filter(reg => {
        const matchesSearch =
            (reg.userId?.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (reg.eventId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (reg.details?.teamName || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || reg.paymentStatus === statusFilter;
        const matchesEvent = eventFilter === "all" || reg.eventId === eventFilter;
        return matchesSearch && matchesStatus && matchesEvent;
    });

    const totalRevenue = filteredRegistrations
        .filter(r => r.paymentStatus === 'completed')
        .reduce((sum, r) => sum + r.feeAmount, 0);

    const totalParticipants = filteredRegistrations.reduce((sum, r) => {
        const extraMembers = r.details?.members?.filter(m => m && m.trim() !== "").length || 0;
        return sum + 1 + extraMembers;
    }, 0);

    const exportCSV = () => {
        const headers = ["Date", "Email", "Event ID", "Amount", "Status", "Team/Participant", "Lead Name", "Phone", "College", "Members", "Bank RRN", "Razorpay Order ID"];
        const rows = filteredRegistrations.map(reg => [
            new Date(reg.createdAt).toLocaleString(),
            reg.userId?.email || 'Guest User',
            reg.eventId,
            reg.feeAmount,
            reg.paymentStatus,
            reg.details?.teamName || '',
            reg.details?.teamLeadName || '',
            reg.details?.phone || '',
            reg.details?.college || '',
            (reg.details?.members || []).filter(m => m && m.trim() !== "").join(" ; "),
            reg.bankRrn || '',
            reg.razorpayOrderId || ''
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `ciencia_admin_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return (
        <div className="min-h-screen bg-[#030712] flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#030712] text-white p-6 md:p-12 relative overflow-x-hidden">
            <div className="max-w-[1400px] mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-indigo-500/20 pb-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-2 uppercase tracking-tight">
                            Admin <span className="text-indigo-400">Dashboard</span>
                        </h1>
                        <p className="text-slate-400 font-mono text-sm">Ciencia 2K26 Registration Control Center</p>
                    </div>
                    <button
                        onClick={exportCSV}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-indigo-500/25"
                    >
                        <Download size={18} /> Export CSV
                    </button>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center">
                        <p className="text-slate-400 text-sm uppercase font-black mb-1">Total Registrations</p>
                        <p className="text-3xl font-heading font-bold text-white">{filteredRegistrations.length}</p>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center">
                        <p className="text-slate-400 text-sm uppercase font-black mb-1">Total Participants</p>
                        <p className="text-3xl font-heading font-bold text-[#ec4899]">{totalParticipants}</p>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center">
                        <p className="text-slate-400 text-sm uppercase font-black mb-1">Completed Payments</p>
                        <p className="text-3xl font-heading font-bold text-green-400">
                            {filteredRegistrations.filter(r => r.paymentStatus === 'completed').length}
                        </p>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center">
                        <p className="text-slate-400 text-sm uppercase font-black mb-1">Total Revenue</p>
                        <p className="text-3xl font-heading font-bold text-indigo-400">₹{totalRevenue.toLocaleString()}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-slate-900/80 border border-indigo-500/20 p-6 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 backdrop-blur-sm">
                    <div className="flex-1 relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search by Email, Team Name, or Event..."
                            className="w-full bg-slate-800/50 border border-slate-700 p-3 pl-12 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-slate-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:flex-none">
                            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <select
                                className="w-full bg-slate-800/50 border border-slate-700 p-3 pl-9 pr-8 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-slate-200 min-w-[180px] appearance-none"
                                value={eventFilter}
                                onChange={(e) => setEventFilter(e.target.value)}
                            >
                                <option value="all">All Events</option>
                                {uniqueEvents.map(ev => <option key={ev} value={ev}>{ev}</option>)}
                            </select>
                        </div>
                        <div className="relative flex-1 md:flex-none">
                            <select
                                className="w-full bg-slate-800/50 border border-slate-700 p-3 px-4 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-slate-200 min-w-[160px] appearance-none"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Statuses</option>
                                <option value="completed">Completed</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Failed</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Main Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead>
                                <tr className="bg-slate-800/50 font-mono text-xs uppercase tracking-widest text-slate-400">
                                    <th className="p-5 font-black">Date</th>
                                    <th className="p-5 font-black">User Email</th>
                                    <th className="p-5 font-black">Event ID</th>
                                    <th className="p-5 font-black">Team / Participant</th>
                                    <th className="p-5 font-black">Status</th>
                                    <th className="p-5 font-black text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRegistrations.map(reg => (
                                    <tr key={reg._id} className="hover:bg-slate-800/40 transition-colors border-t border-slate-800">
                                        <td className="p-5">
                                            <div className="text-sm font-bold text-slate-200">
                                                {new Date(reg.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="text-[10px] text-slate-500 uppercase font-mono mt-1">
                                                {new Date(reg.createdAt).toLocaleTimeString()}
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <span className="text-slate-200 font-medium">{reg.userId?.email || 'Guest User'}</span>
                                        </td>
                                        <td className="p-5">
                                            <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-300 font-bold text-xs uppercase">
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
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${reg.paymentStatus === 'completed'
                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                : reg.paymentStatus === 'failed'
                                                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${reg.paymentStatus === 'completed' ? 'bg-green-400 animate-pulse' : 'bg-current'
                                                    }`} />
                                                {reg.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="p-5 text-center">
                                            <button
                                                onClick={() => setSelectedReg(reg)}
                                                className="p-2 bg-slate-800 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 rounded-lg transition-colors text-slate-300 hover:text-white inline-flex"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredRegistrations.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="p-16 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="p-4 bg-slate-800 rounded-full text-slate-600">
                                                    <Search size={32} />
                                                </div>
                                                <p className="text-slate-400 font-bold">No registrations found matching your criteria.</p>
                                                <button
                                                    onClick={() => { setSearchTerm(""); setStatusFilter("all"); setEventFilter("all"); }}
                                                    className="text-indigo-400 hover:text-white transition-colors text-sm underline"
                                                >
                                                    Clear All Filters
                                                </button>
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

                            {/* Row 1: Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">User Account</p>
                                    <p className="text-slate-200 font-bold">{selectedReg.userId?.email || 'N/A'}</p>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Event</p>
                                    <p className="text-indigo-400 font-bold uppercase">{selectedReg.eventId}</p>
                                </div>
                            </div>

                            {/* Row 2: Participant/Team Info */}
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

                            {/* Row 3: Payment Details */}
                            <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700/50 space-y-4">
                                <h3 className="font-heading text-lg text-white border-b border-slate-700 pb-2">Payment Details</h3>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Status</p>
                                        <p className={`font-bold uppercase ${selectedReg.paymentStatus === 'completed' ? 'text-green-400' : 'text-yellow-400'}`}>
                                            {selectedReg.paymentStatus}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Amount Paid</p>
                                        <p className="text-white font-medium">₹{selectedReg.feeAmount}</p>
                                    </div>
                                    <div className="col-span-2 text-xs font-mono text-slate-400 bg-black/30 p-3 rounded-lg border border-white/5">
                                        <div className="flex justify-between mb-1">
                                            <span>Razorpay Order ID:</span>
                                            <span className="text-slate-200">{selectedReg.razorpayOrderId || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between mb-1">
                                            <span>Razorpay Payment ID:</span>
                                            <span className="text-slate-200">{selectedReg.razorpayPaymentId || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Bank RRN:</span>
                                            <span className="text-slate-200">{selectedReg.bankRrn || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
