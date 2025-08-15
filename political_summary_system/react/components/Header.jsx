import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../style/Header.css'

const Header = () => {
  const { isLogin, user, logout, loading } = useAuth()
  const nav = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    const result = await logout()

    if (result.success) {
      alert('로그아웃 성공')
      nav('/')
    } else {
      alert(result.message)
    }
  }

  const handleLogoClick = () => {
    nav('/')
  }

  // 현재 경로에 따라 활성 클래스 결정하는 함수
  const getActiveClass = (path) => {
    return location.pathname === path ? 'active' : ''
  }

  // 경로 그룹핑 (people/:id도 people으로 처리)
  const isPathActive = (basePath) => {
    if (basePath === '/people') {
      return location.pathname === '/people' || location.pathname.startsWith('/people/')
    }
    return location.pathname === basePath
  }

  return (
    <header id="header">
      <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        <span>정</span>
        <span>리소</span>
      </div>
      <div className="search-container" style={{ flex: 1, margin: '0 24px' }}>
        <input type="text" className="search-input" placeholder="검색어 입력" />
        <img src="../images/search-icon.ico" alt="검색" className='search-icon' />
      </div>
      <ul className="nav-menu">
        <li
          onClick={() => nav('/news')}
          className={isPathActive('/news') ? 'active' : ''}
          style={{ cursor: 'pointer' }}
        >
          뉴스
        </li>
        <li
          onClick={() => nav('/people')}
          className={isPathActive('/people') ? 'active' : ''}
          style={{ cursor: 'pointer' }}
        >
          인물
        </li>
        {/* 로그인 상태일 때만 마이페이지 노출 */}
        {isLogin && (
          <li
            onClick={() => nav('/mypage')}
            className={isPathActive('/mypage') ? 'active' : ''}
            style={{ cursor: 'pointer' }}
          >
            마이페이지
          </li>
        )}
        {/* 로그인 상태에 따라 조건부 렌더링 */}
        {/* 로그아웃은 헤더에서 제거, 마이페이지 내부에서만 노출 */}
        {!isLogin && (  
          <li
            onClick={() => nav('/login')}
            className={isPathActive('/login') ? 'active' : ''}
            style={{ cursor: 'pointer' }}
          >
            로그인
          </li>
        )}
      </ul>
    </header>
  )
}

export default Header