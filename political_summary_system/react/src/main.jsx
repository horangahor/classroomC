/**
 * main.jsx - 앱 진입점
 * React DOM 렌더링, 루트 컴포넌트 마운트 담당
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <App />
  // </StrictMode>,
)
