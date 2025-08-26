import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import '../style/ResetPassword.css'

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [pw, setPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!pw || pw !== confirmPw) {
            setMessage('비밀번호가 일치하지 않습니다.');
            return;
        }
        try {
            await axios.post(import.meta.env.VITE_RESETPW_SERVER, { token, pw });
            setMessage('비밀번호가 성공적으로 변경되었습니다.');
        } catch (err) {
            setMessage('비밀번호 변경에 실패했습니다.');
        }
    };

    return (
        <div className="resetpw-container">
            <form className="resetpw-form" onSubmit={handleSubmit}>
                <h2>비밀번호 변경</h2>
                <div className="input-group">
                    <input
                        type="password"
                        placeholder="새 비밀번호"
                        value={pw}
                        onChange={e => setPw(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <input
                        type="password"
                        placeholder="새 비밀번호 확인"
                        value={confirmPw}
                        onChange={e => setConfirmPw(e.target.value)}
                        required
                    />
                </div>
                <button className="resetpw-button" type="submit">변경하기</button>
                {message && <div className="resetpw-message">{message}</div>}
            </form>
        </div>
    );
};

export default ResetPassword;