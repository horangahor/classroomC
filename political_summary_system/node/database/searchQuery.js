const pool = require('./db')

// 게시물을 검색하는 함수
/* @param {string} keyword
@returns {Promise<Array>}
*/

async function searchlike(keyword) {
    const sql = "SELECT PostId, Title, Author FROM Posts WHERE Title LIKE ?";
    const searchTerm = `%${keyword}`;
    
    try {
        const [rows] = await pool.query(sql, [searchTerm]);
        return rows;
    } catch (error) {
        console.error("검색 중 오류 발생:", error);
        throw error;
    }
}

app.get('/search', async (req, res) => {
    try {
        // 1. 요청에서 검색어를 꺼낸다.
        const keyword = req.query.keyword;

        if (!keyword) {
            return res.json([]); // 검색어가 없으면 빈 배열 응답
        }

        // 2. searchlike에 검색어 전달, 결과 기다림
        const results = await searchlike(keyword);

        // 3. 받은 결과를 응답으로 사용자한테 보냄
        res.json(results);

    } catch (error) {
        // searchlike 에서 오류뜨면 이걸로 처리
        res.stauts(500).json({ message: "서버에서 오류가 발생했습니다." });
    }
});