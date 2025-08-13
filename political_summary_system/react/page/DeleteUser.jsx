import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../style/DeleteUser.css'
import axios from 'axios'
import { getSession } from '../auth/auth'
import { useAuth } from '../contexts/AuthContext'

const DeleteUser = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        password: '',
        reason: '',
        confirmText: ''
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const { logout, currentUser } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()

        // 비밀번호 확인
        if (!formData.password) {
            alert('비밀번호를 입력해주세요.')
            return
        }

        if (formData.confirmText !== '회원탈퇴') {
            alert('"회원탈퇴"를 정확히 입력해주세요.')
            return
        }

        // 최종 확인
        if (window.confirm('정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            axios
                .post('http://localhost:8000/deleteuser', {
                    id: formData.email,
                    pw: formData.password,
                },
                    { withCredentials: true }
                )
                .then(async(res) => {
                    console.log("이건은 response", res);
                    alert('회원탈퇴가 완료되었습니다.');
                    await logout();
                    navigate('/');
                })
                .catch((err) => {
                    console.error(err);
                })
        }
    }

    return (
        <div className="delete-container">
            <div className="delete-card">
                <h2>회원탈퇴</h2>
                <p className="subtitle danger">계정을 영구적으로 삭제합니다</p>

                {/* <div className="warning-box">
                    <h3>⚠️ 주의사항</h3>
                    <ul>
                        <li>탈퇴 후 모든 개인정보가 삭제됩니다</li>
                        <li>작성한 글과 댓글은 유지됩니다</li>
                        <li>탈퇴 후 30일간 재가입이 제한됩니다</li>
                        <li>이 작업은 되돌릴 수 없습니다</li>
                    </ul>
                </div> */}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="password">현재 비밀번호 *</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="본인 확인을 위해 비밀번호를 입력하세요"
                            required
                        />
                    </div>

                    {/* <div className="form-group">
                        <label htmlFor="reason">탈퇴 사유 (선택사항)</label>
                        <textarea
                            id="reason"
                            name="reason"
                            value={formData.reason}
                            onChange={handleInputChange}
                            placeholder="탈퇴 사유를 알려주시면 서비스 개선에 도움이 됩니다"
                            rows="4"
                        />
                    </div> */}

                    <div className="form-group">
                        <label htmlFor="confirmText">확인 문구 *</label>
                        <input
                            type="text"
                            id="confirmText"
                            name="confirmText"
                            value={formData.confirmText}
                            onChange={handleInputChange}
                            placeholder='"회원탈퇴"를 입력하세요'
                            required
                        />
                        <small>탈퇴를 진행하려면 <strong>"회원탈퇴"</strong>를 정확히 입력해주세요</small>
                    </div>

                    <div className="button-group">
                        <button type="submit" className="delete-btn">
                            계정 삭제
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

export default DeleteUser