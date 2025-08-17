/**
 * Home.jsx - 홈/메인 컴포넌트
 * 메인 진입, 안내, 네비게이션 등 UI 담당
 */

import React from 'react'
import axios from 'axios'

const Home = () => {

    function test(){
        axios
        .get('http://localhost:8000/')
        .then((res)=>{
            console.log("good");
            
        })
    }

  return (
    <div>
        Home
        <button onClick={test}></button>
        
    </div>
  )
}

export default Home