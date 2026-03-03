import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    useEffect(() => {
        if (token) {
            // Decode JWT casually to get user info, or fetch from /api/auth/me
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser(payload);
            } catch (e) {
                setToken(null);
                localStorage.removeItem('token');
            }
        }
    }, [token]);

    const login = (userData, jwtToken) => {
        setToken(jwtToken);
        localStorage.setItem('token', jwtToken);
        setUser(userData);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
