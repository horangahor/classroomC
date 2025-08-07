import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const MemberInfo = () => {
    const { id } = useParams();
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMember = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/members/${id}`);
                if (!response.ok) {
                    throw new Error("인물 정보를 찾을 수 없습니다.");
            }
                const data = await response.json();
                setMember(data);
           } catch (err) {
                setError(err.message);
           } finally {
                setLoading(false);
           }
       };
        fetchMember();
    }, [id]);

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>오류: {error}</div>;
    }

    if (!member) {
        return <div>인물 정보를 찾을 수 없습니다.</div>;
    }

    // 데이터 렌더링
    return (
        <div>
            <h1>인물 상세 정보</h1>
            <p>이름: {member.name}</p>
            <p>소속 정당: {member.politics}</p>
            <p>나이: {member.age}</p>
            <p>직책: {member.position}</p>
        </div>
    );
};

export default MemberInfo;