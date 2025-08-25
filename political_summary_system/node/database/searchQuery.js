const pool = require('./db')

// 게시물을 검색하는 함수
@param {string} keyword
@returns {Promise<Array>}

async function searchlike(keyword) {
    const sql = "SELECT PostId, Title, Author FROM Posts WHERE Title LIKE ?";
    const searchTerm = `%${keyword}`;
    
    try {
        const [rows] = await pool.query(sql, [searchTerm]);
        return rows;
    } catch (error) {
        console.error("검색 중 오류 발생:", error);
        return [];
    }
}