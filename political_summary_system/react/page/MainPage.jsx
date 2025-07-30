import React from 'react'
import krSvg from '../assets/kr.svg'
import '../style/MainPage.css';

const MainPage = () => {
  return (
    <div id='main-page'>
      <div id="main-text">지도로 확인하는 지역 정치 이슈</div>
      <img id='map' src={krSvg} alt="대한민국 지도" />
    </div>
  )
}

export default MainPage