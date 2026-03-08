import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const SignupPage = () => {
    const { user, login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') navigate('/admin', { replace: true });
            else navigate('/events', { replace: true });
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role: 'student' })
            });
            const data = await res.json();
            if (res.ok) {
                login(data.user, data.token);
                toast.success('Welcome to Ciencia 2K26!');
                navigate('/events', { replace: true });
            } else {
                toast.error(data.error || 'Signup failed');
            }
        } catch (err) {
            toast.error('Network error');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#030712] text-white">
            <form onSubmit={handleSubmit} className="bg-slate-900 p-8 rounded-xl w-96 border border-slate-700 shadow-xl">
                <h2 className="text-3xl font-heading mb-6 text-center text-rose-400">Sign Up</h2>
                <div className="mb-4">
                    <label className="block mb-2 font-mono text-sm">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-2 rounded bg-slate-800 border border-slate-600 focus:outline-none focus:border-rose-500" />
                </div>
                <div className="mb-6">
                    <label className="block mb-2 font-mono text-sm">Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-2 rounded bg-slate-800 border border-slate-600 focus:outline-none focus:border-rose-500" />
                </div>
                <button type="submit" className="w-full bg-rose-600 p-2 rounded hover:bg-rose-500 font-bold tracking-wider">REGISTER</button>
                <p className="mt-4 text-center text-sm text-slate-400">
                    Already have an account? <Link to="/login" className="text-rose-400">Log in</Link>
                </p>
            </form>
        </div>
    );
};
export default SignupPage;
