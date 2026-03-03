import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { token, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#030712] text-white p-8">
            <h1 className="text-4xl font-heading mb-8 border-b border-slate-700 pb-4 text-indigo-400">Admin Dashboard</h1>
            <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-700">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-800 font-mono text-sm text-slate-400">
                            <th className="p-4 border-b border-slate-700">Date</th>
                            <th className="p-4 border-b border-slate-700">User Email</th>
                            <th className="p-4 border-b border-slate-700">Event ID</th>
                            <th className="p-4 border-b border-slate-700">Amount</th>
                            <th className="p-4 border-b border-slate-700">Payment Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registrations.map(reg => (
                            <tr key={reg._id} className="hover:bg-slate-800/50">
                                <td className="p-4 border-b border-slate-700 text-sm opacity-80">{new Date(reg.createdAt).toLocaleString()}</td>
                                <td className="p-4 border-b border-slate-700">{reg.userId?.email || 'N/A'}</td>
                                <td className="p-4 border-b border-slate-700 font-bold">{reg.eventId}</td>
                                <td className="p-4 border-b border-slate-700">₹{reg.feeAmount}</td>
                                <td className="p-4 border-b border-slate-700">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${reg.paymentStatus === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                        {reg.paymentStatus}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {registrations.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-slate-500">No registrations found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
