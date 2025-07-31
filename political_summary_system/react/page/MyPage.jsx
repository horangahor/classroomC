import React from 'react'
import { Link } from 'react-router-dom'
import '../style/MyPage.css'

const MyPage = () => {
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
                </div>
                
                <div className="back-link">
                    <Link to="/">메인으로 돌아가기</Link>
                </div>
            </div>
        </div>
    )
}

export default MyPage