import React from 'react'
import axios from 'axios'

const Home = () => {

    function test(){
        axios
        .get('http://localhost:8000/')
        .then((res)=>{

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