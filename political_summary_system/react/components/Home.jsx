/* components/Home.jsx - 홈 컴포넌트: 메인 랜딩 섹션 구성 설명 */

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