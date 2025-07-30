import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Upload from '../components/Upload'
import Header from '../components/Header'
import News from '../page/News'
import People from '../page/People'
import Politics from '../page/Politics'
import MainPage from '../page/MainPage'


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
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
