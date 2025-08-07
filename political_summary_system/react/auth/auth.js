import axios from 'axios'


// 세션 객체를 받아오는 함수
export async function getSession() {
    const user = await axios.get('http://localhost:8000', { withCredentials: true })
        .then((res) => {
            return res.data; // 세션 객체가 전달됨
        })
    return user;
}

// 로그아웃 함수 추가
export async function logout() {
    try {
        // 라우터가 받아서 session 정보를 보내줘야함 ?
        const response = await axios.post('http://localhost:8000/logout', {}, {
            withCredentials: true
        });

        console.log('로그아웃 응답:', response.data);
        return { success: true, message: '로그아웃 완료' };
    } catch (error) {
        console.error('로그아웃 오류:', error);
        return {
            success: false,
            message: '로그아웃 중 오류가 발생했습니다.'
        };
    }
}

