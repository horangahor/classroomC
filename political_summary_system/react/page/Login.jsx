/**
 * Login.jsx - 로그인 페이지
 * 사용자 로그인 폼, 인증, 세션 처리 등 담당
 */

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../style/Login.css'
import axios from 'axios'
import { getSession } from '../auth/auth'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const nav = useNavigate();
  const { login, loading } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      alert('이메일과 비밀번호를 모두 입력해주세요.')
      return
    }
    const result = await login(formData)

    if (result.success) {
      alert(result.message)
      nav('/')
    } else {
      alert(result.message)
    }

  }

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>로그인</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>이메일</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="이메일을 입력하세요"
              required
            />
          </div>

          <div className="input-group">
            <label>비밀번호</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="join-link">
          <p>계정이 없으신가요? <Link to="/join">회원가입</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Login