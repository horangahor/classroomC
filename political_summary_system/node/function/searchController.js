// db.js 파일은 현재 파일 위치에서 한 단계 위(../)에 있습니다.
const pool = require('../database/db.js');

// 실제 DB 쿼리를 실행하는 로직
const searchPostsInDB = async (keyword, limit, offset) => {
    const searchTerm = `%${keyword}%`;
    const countSql = "SELECT COUNT(*) as total FROM news WHERE title LIKE ?";
    const dataSql = "SELECT news_identifier, date, media_company, politician, location, institution, title, summary, url FROM news WHERE title LIKE ? ORDER BY news_identifier DESC LIMIT ? OFFSET ?";

    try {
        const [countRows] = await pool.query(countSql, [searchTerm]);
        const [dataRows] = await pool.query(dataSql, [searchTerm, limit, offset]);
        const total = countRows[0].total;
        return { total, results: dataRows };
    } catch (error) {
        console.error("DB 검색 중 오류 발생:", error);
        throw error;
    }
};

// 라우터로부터 요청(req)과 응답(res)을 받아 처리하는 함수
const getSearchResults = async (req, res) => {
    try {
        const { query, page = '1', limit = '20' } = req.query;
        if (!query) {
            return res.status(200).json({ total: 0, results: [] });
        }
        const limitNum = parseInt(limit, 10);
        const offset = (parseInt(page, 10) - 1) * limitNum;
        const searchResults = await searchPostsInDB(query, limitNum, offset);
        res.status(200).json(searchResults);
    } catch (error) {
        res.status(500).json({ message: "서버 내부에서 오류가 발생했습니다." });
    }
};

// 이 파일의 getSearchResults 함수를 다른 파일에서 쓸 수 있도록 내보냅니다.
module.exports = {
    getSearchResults
};
