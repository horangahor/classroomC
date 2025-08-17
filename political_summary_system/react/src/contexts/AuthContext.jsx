```javascript
/**
 * AuthContext.jsx - 인증/세션 컨텍스트
 * 사용자 인증, 세션 관리, 글로벌 상태 제공
 */

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
```