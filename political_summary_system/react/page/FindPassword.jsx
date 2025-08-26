import React, { useState } from 'react';
import '../style/FindPassword.css';
import axios from 'axios'

const FindPassword = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        // 실제 비밀번호 찾기 API 연동 필요
        try {
            axios.post(import.meta.env.VITE_FIND_SERVER, {
                email : email,
                name : name
            })
                 .then((res)=>{
                    
                 })
                 .catch((err)=>{

                 })
            // 예시: await axios.post('/api/find-password', { name, email });
            setMessage('비밀번호 찾기 요청이 접수되었습니다. 이메일을 확인해 주세요.');
        } catch (err) {
            setMessage('비밀번호 찾기 요청에 실패했습니다. 다시 시도해 주세요.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>비밀번호 찾기</h2>
                <div className="input-group">
                    <label htmlFor="name">이름</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        placeholder="이름을 입력하세요"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="email">이메일</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        placeholder="이메일을 입력하세요"
                    />
                </div>
                <button className="login-button" type="submit" disabled={loading}>
                    {loading ? '처리 중...' : '비밀번호 찾기'}
                </button>
                {message && <div className="login-message">{message}</div>}
            </form>
        </div>
    );
};

export default FindPassword;
