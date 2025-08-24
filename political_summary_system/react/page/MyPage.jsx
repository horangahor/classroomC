/* MyPage.jsx - 마이페이지 컴포넌트: 계정 관리 액션(수정/탈퇴/로그아웃) 설명 */

import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../style/MyPage.css'

const MyPage = () => {
    const { logout } = useAuth();
    const handleLogout = async () => {
        const result = await logout();
        if (result.success) {
            alert('로그아웃 성공');
            window.location.href = '/';
        } else {
            alert(result.message);
        }
    };
    return (
        <div className="mypage-container">
            <div className="mypage-card">
                <h2>마이페이지</h2>
                <p className="subtitle">계정을 관리하세요</p>
                
                <div className="menu-buttons">
                    <Link to="/updateuser" className="menu-btn">
                        회원정보 수정
                    </Link>
                    
                    <Link to="/deleteuser" className="menu-btn danger">
                        회원탈퇴
                    </Link>
                    
                    <button className="menu-btn logout" onClick={handleLogout}>
                        로그아웃
                    </button>
                </div>
                
                <div className="back-link">
                    <Link to="/">메인으로 돌아가기</Link>
                </div>
            </div>
        </div>
    )
}

export default MyPage