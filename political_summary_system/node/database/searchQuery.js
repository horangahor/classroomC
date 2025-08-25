import express from 'express';
import pool from './db';

const app = express();

// 게시물을 검색하는 함수
/* @param {string} keyword
@returns {Promise<Array>}
*/

async function searchlike(keyword, limit, offset) {
    const searchTerm = `%${keyword}%`;

    // 총 개수를 세는 올바른 쿼리
    const countSql = "SELECT PostId, Title, Author FROM Posts WHERE Title LIKE ?";

    const dataSql = "SELECT PostId, Title, Author FROM Posts WHERE Title LIKE ? LIMIT ? OFFSET ?";
    
    try {
        const [[countRows], [dataRows]] = await Promise.all([
        pool.query(countSql, [searchTerm]),
        pool.query(dataSql, [searchTerm, limit, offset])
        ]);

        return {
            total: countRows[0].total,  // 전체 개수
            results: dataRows           // 현재 페이지 데이터
        }
    } catch (error) {
        console.error("검색 중 오류 발생:", error);
        throw error;
    }
};

app.get('/api/search', async (req, res) => {
    try {
        // 1. 요청에서 검색어를 꺼낸다.
        const { query, page = '1', limit = '20' } = req.query;

        if (!query) {
            return res.json({ total: 0, results: [] }); // 검색어가 없으면 빈 배열 응답
        }

        // 2. 페이지네이션을 위한 숫자 값을 계산합니다.
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const offset = (pageNum - 1) * limitNum // 건너뛸 개수 계산

        // 3. DB 조회 함수에 검색어와 페이지네이션 값을 전달하고 결과를 기다림
        const searchResults = await searchlike(query, limitNum, offset);

        // 4. 받은 결과 사용자한테 보냄
        res.json(searchResults);

    } catch (error) {
        // searchlike 에서 오류뜨면 이걸로 처리
        res.stauts(500).json({ message: "서버에서 오류가 발생했습니다." });
    }
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});