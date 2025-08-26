import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { FavoritesContext } from '../contexts/FavoritesContext';

const Favorites = () => {
    const [response, setResponse] = useState(null);
    const { favorites } = useContext(FavoritesContext); // Context에서 배열 받아옴

    // 즐겨찾기 배열을 백엔드로 전송하는 함수
    const sendFavoritesToBackend = async () => {
        try {
            console.log('보낼 즐겨찾기 배열:', favorites); // 디버그: 배열 확인
            const res = await axios.post('/api/users/me/favorites/bulk', { favorites }, { withCredentials: true });
            setResponse(res.data);
            console.log('백엔드 응답:', res.data); // 디버그: 응답 확인
        } catch (e) {
            console.error('백엔드 전송 실패:', e);
        }
    };

    useEffect(() => {
        // 페이지 접근 시 즐겨찾기 배열값 콘솔 디버그
        console.log('[Favorites 페이지 접근] 전달받은 favorites 배열:', favorites);
        // 페이지 로드 시 자동 전송 (원하면 주석 해제)
        // sendFavoritesToBackend();
    }, [favorites]);

    return (
        <div>
            <button onClick={sendFavoritesToBackend}>즐겨찾기 배열 백엔드로 전송</button>
            <pre>{JSON.stringify(favorites, null, 2)}</pre> {/* 디버그: 배열 시각화 */}
            <pre>{JSON.stringify(response, null, 2)}</pre> {/* 디버그: 응답 시각화 */}
        </div>
    );
};

export default Favorites;
