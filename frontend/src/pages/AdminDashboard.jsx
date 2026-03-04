import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { token, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

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

    const filteredRegistrations = registrations.filter(reg => {
        const matchesSearch =
            (reg.userId?.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (reg.eventId || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || reg.paymentStatus === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalRevenue = filteredRegistrations
        .filter(r => r.paymentStatus === 'completed')
        .reduce((sum, r) => sum + r.feeAmount, 0);

    if (loading) return (
        <div className="min-h-screen bg-[#030712] flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#030712] text-white p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-2 uppercase tracking-tight">
                            Admin <span className="text-indigo-400">Dashboard</span>
                        </h1>
                        <p className="text-slate-400 font-mono text-sm">Ciencia 2K26 Registration Control Center</p>
                    </div>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl shadow-xl">
                        <p className="text-slate-400 text-sm uppercase font-black mb-1">Total Registrations</p>
                        <p className="text-3xl font-heading font-bold text-white">{filteredRegistrations.length}</p>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl shadow-xl">
                        <p className="text-slate-400 text-sm uppercase font-black mb-1">Completed Payments</p>
                        <p className="text-3xl font-heading font-bold text-green-400">
                            {filteredRegistrations.filter(r => r.paymentStatus === 'completed').length}
                        </p>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl shadow-xl">
                        <p className="text-slate-400 text-sm uppercase font-black mb-1">Total Revenue (Completed)</p>
                        <p className="text-3xl font-heading font-bold text-indigo-400">₹{totalRevenue.toLocaleString()}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-slate-900/80 border border-indigo-500/20 p-6 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 backdrop-blur-sm">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Search by Email or Event..."
                            className="w-full bg-slate-800/50 border border-slate-700 p-3 pl-4 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-slate-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4">
                        <select
                            className="bg-slate-800/50 border border-slate-700 p-3 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-slate-200 min-w-[160px]"
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

                {/* Main Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-800/50 font-mono text-xs uppercase tracking-widest text-slate-400">
                                    <th className="p-5 font-black">Date & Time</th>
                                    <th className="p-5 font-black">User Email</th>
                                    <th className="p-5 font-black">Event ID</th>
                                    <th className="p-5 font-black">Amount</th>
                                    <th className="p-5 font-black">Status</th>
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
                                            <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-300 font-bold text-sm uppercase">
                                                {reg.eventId}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <span className="font-heading font-bold text-white">₹{reg.feeAmount}</span>
                                        </td>
                                        <td className="p-5 text-right md:text-left">
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
                                    </tr>
                                ))}
                                {filteredRegistrations.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="p-16 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="p-4 bg-slate-800 rounded-full text-slate-600">
                                                    {/* Missing Icon Placeholder */}
                                                    <div className="w-12 h-12 border-4 border-slate-700 rounded-full flex items-center justify-center font-black text-2xl">?</div>
                                                </div>
                                                <p className="text-slate-400 font-bold">No registrations found matching your criteria.</p>
                                                <button
                                                    onClick={() => { setSearchTerm(""); setStatusFilter("all"); }}
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
        </div>
    );
};

export default AdminDashboard;
