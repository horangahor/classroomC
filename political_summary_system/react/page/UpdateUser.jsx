import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../style/UpdateUser.css'

const UpdateUser = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    // 폼 데이터 상태 관리
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    // 컴포넌트 마운트 시 사용자 정보 불러오기
    // useEffect(() => {
    //     fetchUserInfo()
    // }, [])

    // // 현재 사용자 정보 가져오기
    // const fetchUserInfo = async () => {
    //     try {
    //         setLoading(true)
    //         const response = await axios.get('http://localhost:8000/updateuser')

    //         if (response.data.success) {
    //             const { name, email, phone } = response.data.user
    //             setFormData(prev => ({
    //                 ...prev,
    //                 name: name || '',
    //                 email: email || '',
    //                 phone: phone || ''
    //             }))
    //         }
    //     } catch (error) {
    //         console.error('사용자 정보 조회 실패:', error)
    //         alert('사용자 정보를 불러오는데 실패했습니다.')
    //     } finally {
    //         setLoading(false)
    //     }
    // }

    // 입력 필드 변경 처리
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // 폼 제출 처리
    const handleSubmit = async (e) => {
        e.preventDefault()

        // 새 비밀번호 일치 확인
        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            alert('새 비밀번호가 일치하지 않습니다.')
            return
        }

        // 현재 비밀번호 필수 입력
        if (!formData.currentPassword) {
            alert('현재 비밀번호를 입력해주세요.')
            return
        }

        
        axios
            .post('http://localhost:8000/updateuser', {
                // 데이터 감싸서 보낼 때 변수명 통일이 안되어있는 문제
                id : formData.email,
                name : formData.name,
                phnum : formData.phone,
                cpw: formData.currentPassword,
                npw: formData.newPassword,
            })
            .then ((res) =>{
                // 수정 처리 로직 (실제로는 API 호출)
                alert(res.data.message || '회원정보가 수정되었습니다!')
                navigate('/mypage')
            })
            .catch((err)=>{
                console.error(err);
                alert(err.response?.data?.message || "회원정보 수정에 실패했습니다.")
            })
    }


    return (
        <div className="update-container">
            <div className="update-card">
                <h2>회원정보 수정</h2>
                <p className="subtitle">정보를 수정하세요</p>

                <form onSubmit={handleSubmit}>
                    {/* 이름 입력 */}
                    <div className="form-group">
                        <label htmlFor="name">이름</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            disabled={loading}
                            required
                        />
                    </div>

                    {/* 이메일 입력 */}
                    <div className="form-group">
                        <label htmlFor="email">이메일</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={loading}
                            required
                        />
                    </div>

                    {/* 전화번호 입력 */}
                    <div className="form-group">
                        <label htmlFor="phone">전화번호</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="010-0000-0000"
                            disabled={loading}
                        />
                    </div>

                    <hr className="divider" />

                    {/* 현재 비밀번호 입력 */}
                    <div className="form-group">
                        <label htmlFor="currentPassword">현재 비밀번호 *</label>
                        <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            placeholder="변경을 위해 현재 비밀번호를 입력하세요"
                            disabled={loading}
                            required
                        />
                    </div>

                    {/* 새 비밀번호 입력 */}
                    <div className="form-group">
                        <label htmlFor="newPassword">새 비밀번호</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            placeholder="변경하지 않으려면 비워두세요"
                            disabled={loading}
                        />
                    </div>

                    {/* 새 비밀번호 확인 */}
                    <div className="form-group">
                        <label htmlFor="confirmPassword">새 비밀번호 확인</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="새 비밀번호를 다시 입력하세요"
                            disabled={loading}
                        />
                        {/* 비밀번호 불일치 에러 메시지 */}
                        {formData.newPassword && formData.confirmPassword &&
                            formData.newPassword !== formData.confirmPassword && (
                                <small className="error-text">비밀번호가 일치하지 않습니다.</small>
                            )}
                    </div>

                    {/* 버튼 그룹 */}
                    <div className="button-group">
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? '수정 중...' : '정보 수정'}
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