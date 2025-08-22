/**
 * App.jsx - 전체 앱 라우팅/구성
 * 페이지 라우트, 컨텍스트, 글로벌 레이아웃 등 담당
 */

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext'
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

import Upload from '../components/Upload'
import DetailPeople from '../page/DetailPeople' // 추가
import SearchResult from '../page/SearchResult'; // 검색 결과 페이지 추가


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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

            <Route path="/people/:id" element={<DetailPeople />} />
            <Route path="/searchresult" element={<SearchResult />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
