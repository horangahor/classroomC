/* Join.jsx - 회원가입 페이지 컴포넌트 설명: 입력/유효성/서브밋 관련 역할 */

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../style/Join.css'

const Join = () => {
    const nav = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: ''
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
        
        // 간단한 유효성 검사
        if (formData.password !== formData.confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.')
            return
        }

        if (!formData.email || !formData.password || !formData.name) {
            alert('필수 항목을 모두 입력해주세요.')
            return
        }
        // 서버에 회원가입 요청 보내기
        axios
            .post(import.meta.env.VITE_JOIN_SERVER, {
                id : formData.email,
                pw : formData.password,
                name : formData.name,
                phnum : formData.phone
            })
            .then ((res) =>{
                console.log('회원가입 데이터:', formData)
                alert('이메일을 확인해서 인증하기');
                nav('/');
            })
            .catch((err)=>{
                console.error(err);
                
            })

    }

    return (
        <div className="join-container">
            <div className="join-form">
                <h2>회원가입</h2>
                <form onSubmit={handleSubmit} method = "post">
                    <div className="input-group">
                        <label>이메일 *</label>
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
                        <label>이름 *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="이름을 입력하세요"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>비밀번호 *</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="비밀번호를 입력하세요"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>비밀번호 확인 *</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="비밀번호를 다시 입력하세요"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>전화번호</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="전화번호를 입력하세요 (선택사항)"
                        />
                    </div>

                    <button type="submit" className="join-button" >
                        회원가입
                    </button>
                </form>

                <div className="login-link">
                    <p>이미 계정이 있으신가요? <Link to="/login">로그인</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Join
