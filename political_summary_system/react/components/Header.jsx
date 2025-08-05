import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import '../style/Header.css'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation() // 현재 경로 가져오기

  const handleLogoClick = () => {
    navigate('/')
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
      {/* 로고를 클릭하면 onClick으로 이동 */}
      <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        <span>정</span>
        <span>리소</span>
      </div>

      <div className="search-container">
        <input type="text" className="search-input" placeholder="검색어 입력" />
        <img src="../images/search-icon.ico" alt="검색" className='search-icon'/>
      </div>

      <ul className="nav-menu">
        <li 
          onClick={() => navigate('/news')} 
          className={isPathActive('/news') ? 'active' : ''}
          style={{ cursor: 'pointer' }}
        >
          뉴스
        </li>
        <li 
          onClick={() => navigate('/people')} 
          className={isPathActive('/people') ? 'active' : ''}
          style={{ cursor: 'pointer' }}
        >
          인물
        </li>
        <li 
          onClick={() => navigate('/mypage')} 
          className={isPathActive('/mypage') ? 'active' : ''}
          style={{ cursor: 'pointer' }}
        >
          마이페이지
        </li>
        <li 
          onClick={() => navigate('/login')} 
          className={isPathActive('/login') ? 'active' : ''}
          style={{ cursor: 'pointer' }}
        >
          로그인
        </li>
      </ul>
    </header>
  )
}

export default Header