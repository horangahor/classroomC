import { useState } from 'react'
import {Route , Routes} from 'react-router-dom'
import Home from '../components/Home'
import './App.css'
import '../components/Upload'
import Upload from '../components/Upload'
function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/upload' element={<Upload/>}></Route>
      </Routes>
    </>
  )
}

export default App
