import React from 'react'
import { useNavigate } from 'react-router-dom';
import '../style/Header.css';

const Header = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/'); // 홈으로 이동
  };


  return (
    <header id="header" >
      {/* 로고를 클릭하면 onClick으로 이동 */}
      <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        정리소
      </div>

      <div className="search-container">
        <input type="text" className="search-input" placeholder="검색어 입력" />
        <img src="../images/search-icon.ico" alt="검색" className='search-icon'/>
      </div>

      <ul className="nav-menu">
        <li onClick={() => navigate('/news')} style={{ cursor: 'pointer' }}>뉴스</li>
        <li onClick={() => navigate('/people')} style={{ cursor: 'pointer' }}>인물</li>
        {/* <li onClick={() => navigate('/politics')} style={{ cursor: 'pointer' }}>정치</li> */}
        <li onClick={() => navigate('/mypage')} style={{ cursor: 'pointer' }}>마이페이지</li>
      </ul>
    </header>
  );

}

export default Header