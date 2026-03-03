import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok) {
                login(data.user, data.token);
                if (data.user.role === 'admin') navigate('/admin');
                else navigate('/events');
            } else {
                alert(data.error || 'Login failed');
            }
        } catch (err) {
            alert('Network error');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#030712] text-white">
            <form onSubmit={handleSubmit} className="bg-slate-900 p-8 rounded-xl w-96 border border-slate-700 shadow-xl">
                <h2 className="text-3xl font-heading mb-6 text-center text-indigo-400">Login</h2>
                <div className="mb-4">
                    <label className="block mb-2 font-mono text-sm">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-2 rounded bg-slate-800 border border-slate-600 focus:outline-none focus:border-indigo-500" />
                </div>
                <div className="mb-6">
                    <label className="block mb-2 font-mono text-sm">Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-2 rounded bg-slate-800 border border-slate-600 focus:outline-none focus:border-indigo-500" />
                </div>
                <button type="submit" className="w-full bg-indigo-600 p-2 rounded hover:bg-indigo-500 font-bold tracking-wider">LOG IN</button>
                <p className="mt-4 text-center text-sm text-slate-400">
                    Don't have an account? <Link to="/register" className="text-indigo-400">Sign up</Link>
                </p>
            </form>
        </div>
    );
};
export default LoginPage;
