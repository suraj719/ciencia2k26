import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const getInitialUser = () => {
        const t = localStorage.getItem('token');
        if (t) {
            try { return JSON.parse(atob(t.split('.')[1])); } catch (e) { }
        }
        return null;
    };
    const [user, setUser] = useState(getInitialUser);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    useEffect(() => {
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser(payload);
            } catch (e) {
                setToken(null);
                setUser(null);
                localStorage.removeItem('token');
            }
        } else {
            setUser(null);
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
