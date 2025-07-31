import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Upload from '../components/Upload'
import Header from '../components/Header'
import News from '../page/News'
import People from '../page/People'
import Politics from '../page/Politics'
import MainPage from '../page/MainPage'
import Join from '../page/Join'
import Login from '../page/Login'
import MyPage from '../page/MyPage'
import UpdateUser from '../page/UpdateUser'
import DeleteUser from '../page/DeleteUser'

function App() {
  return (  
    <BrowserRouter>
      <Header />
      <div id="body">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/news" element={<News />} />
          <Route path="/people" element={<People />} />
          <Route path="/politics" element={<Politics />} />
          <Route path="/join" element={<Join />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/updateuser" element={<UpdateUser />} />
          <Route path="/deleteuser" element={<DeleteUser />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
