/* components/Header.jsx - 헤더/네비게이션 컴포넌트 설명: 검색/링크/인증 표시 역할 */

import React, { useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../style/Header.css'

const Header = () => {
  const { isLogin, user } = useAuth() // loading 제거
  const nav = useNavigate()
  const location = useLocation()
  const searchInputRef = useRef()

  // 경로 그룹핑 (people/:id도 people으로 처리)
  const isPathActive = (basePath) => {
    if (basePath === '/people') {
      return location.pathname === '/people' || location.pathname.startsWith('/people/')
    }
    return location.pathname === basePath
  }

  // 검색창에서 엔터 또는 아이콘 클릭 시 검색 결과 페이지로 이동
  const handleSearch = (e) => {
    e.preventDefault()
    const value = searchInputRef.current?.value?.trim()
    if (value) {
      nav(`/searchresult?query=${encodeURIComponent(value)}`)
    }
  }

  return (
    <header id="header">
      <div className="logo" onClick={() => nav('/') }>
        <span>정</span>
        <span>리소</span>
      </div>
      <form className="search-container" onSubmit={handleSearch}>
        <input type="text" className="search-input" placeholder="검색어 입력" ref={searchInputRef} />
        <img src="../images/search-icon.ico" alt="검색" className='search-icon' onClick={handleSearch} />
      </form>
      <ul className="nav-menu">
        <li
          onClick={() => nav('/news')}
          className={isPathActive('/news') ? 'active' : ''}
        >
          뉴스
        </li>
        <li
          onClick={() => nav('/people')}
          className={isPathActive('/people') ? 'active' : ''}
        >
          인물
        </li>
        
        {/* 로그인 상태일 때만 마이페이지 노출 */}
        {isLogin && (
          <li
            onClick={() => nav('/mypage')}
            className={isPathActive('/mypage') ? 'active mypage-btn' : 'mypage-btn'}
          >
            <span className="mypage-name">{user?.name ? `${user.name}님` : '마이페이지'}</span>
            <img src="https://cdn-icons-png.flaticon.com/512/456/456212.png" alt="마이페이지" className="mypage-icon" />
          </li>
        )}
        {/* 로그인 상태에 따라 조건부 렌더링 */}
        {/* 로그아웃은 헤더에서 제거, 마이페이지 내부에서만 노출 */}
        {!isLogin && (
          <li
            onClick={() => nav('/login')}
            className={isPathActive('/login') ? 'active' : ''}
          >
            로그인
          </li>
        )}
      </ul>
    </header>
  )
}

export default Header