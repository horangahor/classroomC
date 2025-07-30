import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../style/Login.css'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      alert('이메일과 비밀번호를 모두 입력해주세요.')
      return
    }

    console.log('로그인 데이터:', formData)
    alert('로그인 성공!')
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

          <button type="submit" className="login-button">
            로그인
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