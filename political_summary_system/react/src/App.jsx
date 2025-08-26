/* App.jsx - 애플리케이션 라우트/공용 설정 컴포넌트 설명 */

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
import Favorites from '../page/Favorites'
import { FavoritesProvider } from '../contexts/FavoritesContext'


function App() {
  return (
    <FavoritesProvider>
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
              <Route path="/favorites" element={<Favorites />} />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </FavoritesProvider>
  )
}

export default App
