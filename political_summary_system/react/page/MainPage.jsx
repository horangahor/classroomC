import React from 'react'
import krSvg from '../assets/kr.svg'

const MainPage = () => {
  return (
    <div>
      <div>MainPage화면입니다</div>
      <img src={krSvg} alt="대한민국 지도" style={{ width: '400px', height: 'auto' }} />
    </div>
  )
}

export default MainPage