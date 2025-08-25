/* src/contexts/AuthContext.jsx - 인증 컨텍스트(중복 경로): 상태와 제공자 설명 */

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // TODO: Add logic to check for existing session
    }, []);

    const login = (userData) => {
        setUser(userData);
        // TODO: Add logic to handle user login
    };

    const logout = () => {
        setUser(null);
        // TODO: Add logic to handle user logout
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};