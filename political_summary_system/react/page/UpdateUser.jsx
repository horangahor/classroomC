import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../style/UpdateUser.css'

const UpdateUser = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '홍길동',
        email: 'hong@example.com',
        phone: '010-1234-5678',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
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

        // 새 비밀번호 확인
        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            alert('새 비밀번호가 일치하지 않습니다.')
            return
        }

        // 현재 비밀번호 확인 (실제로는 서버에서 검증)
        if (!formData.currentPassword) {
            alert('현재 비밀번호를 입력해주세요.')
            return
        }

        // 수정 처리 로직 (실제로는 API 호출)
        alert('회원정보가 수정되었습니다!')
        navigate('/mypage')
    }

    return (
        <div className="update-container">
            <div className="update-card">
                <h2>회원정보 수정</h2>
                <p className="subtitle">정보를 수정하세요</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">이름</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">이메일</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">전화번호</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="010-0000-0000"
                        />
                    </div>

                    <hr className="divider" />

                    <div className="form-group">
                        <label htmlFor="currentPassword">현재 비밀번호 *</label>
                        <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            placeholder="변경을 위해 현재 비밀번호를 입력하세요"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="newPassword">새 비밀번호</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            placeholder="변경하지 않으려면 비워두세요"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">새 비밀번호 확인</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="새 비밀번호를 다시 입력하세요"
                        />
                    </div>

                    <div className="button-group">
                        <button type="submit" className="submit-btn">
                            정보 수정
                        </button>
                        <Link to="/mypage" className="cancel-btn">
                            취소
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdateUser