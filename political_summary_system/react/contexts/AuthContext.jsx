/* contexts/AuthContext.jsx - 인증 컨텍스트: 상태/로그인/로그아웃 설명 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSession, logout as logoutAPI } from '../auth/auth';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [isLogin, setIsLogin] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 세션 확인 함수
    const checkSession = async () => {
        try {
            const sessionData = await getSession();
            
            if (sessionData && sessionData.id) {
                setIsLogin(true);
                setUser(sessionData);
                console.log('로그인 상태:', sessionData);
            } else {
                setIsLogin(false);
                setUser(null);
                console.log('로그아웃 상태');
            }
        } catch (error) {
            console.error('세션 확인 오류:', error);
            setIsLogin(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // 페이지 로드 시 세션 확인
    useEffect(() => {
        checkSession();
    }, []);

    // 로그인 함수
    const login = async (credentials) => {
        try {
            const response = await axios.post('http://localhost:8000/login', {
                id: credentials.email,
                pw: credentials.password,
            }, {
                withCredentials: true
            });

            console.log("로그인 응답:", response);
            
            // 로그인 성공 후 세션 다시 확인
            await checkSession();
            
            return { success: true, message: '로그인 성공!' };
        } catch (error) {
            console.error('로그인 오류:', error);
            return { 
                success: false, 
                message: error.response?.status === 401 ? '로그인 실패' : '서버 오류가 발생했습니다.' 
            };
        }
    };

    // 로그아웃 함수
    const logout = async () => {
        try {
            // 백엔드에 로그아웃 요청 (세션 삭제)
            const result = await logoutAPI();
            
            // 클라이언트 상태 초기화
            setIsLogin(false);
            setUser(null);
            
            console.log('로그아웃 완료:', result.message);
            return result;
        } catch (error) {
            console.error('로그아웃 오류:', error);
            // 에러가 발생해도 클라이언트 상태는 초기화
            setIsLogin(false);
            setUser(null);
            return { success: false, message: '로그아웃 중 오류가 발생했습니다.' };
        }
    };

    const value = {
        isLogin,    // boolean: 로그인 상태
        user,       // object: 사용자 정보
        loading,    // boolean: 로딩 상태
        login,      // function: 로그인 함수
        logout,     // function: 로그아웃 함수
        checkSession // function: 세션 확인 함수
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};