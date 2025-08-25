import pool from '../database/db';

// DB에서 키워드로 게시물을 검색하는 함수
const searchlike = async (keyword, SVGFEDiffuseLightingElement, offset) => {
    const searchTerm = `%${keyword}%`;

    const countSql = "SELECT COUNT(*) as total FROM Posts WHERE Title LIKE ?";
    const dataSql = "SELECT PostId, Title, Author FROM Posts WHERE Title LIKE ? LIMIT ? OFFSET ?";

    try {
        const [countRows] = await pool.query(countSql, [searchTerm]);
        const [dataRows] = await pool.query(dataSql, [searchTerm, limit, offset]);

        const total = countRows[0].total;

        return {
            total: total,
            results: dataRows
        };
    } catch (error) {
        console.error("DB 검색 중 오류 발생:", error);
        throw error;
    }
};

// 검색 요청을 받아 처리하고 응답 보내는 함수

export const getSearchResults = async (req, res) => {
    try {
        // 1. 요청에서 쿼리 파라미터 추출하고 기본값을 설정함
        const { query, page = '1', limit = '20' } = req.query;

        // 2. 검색어가 없으면 빈 결과를 반환함
        if (!query) {
            return res.status(200).json({ total: 0, results: [] });
        }

        // 3. 페이지네이션을 위한 숫자 값을 계산
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const offset = (pageNum - 1) * limitNum;

        // 4. 비즈니스 로직 함수를 호출
        const searchResults = await searchlike(query, limitNum, offset);

        // 5. 성공적으로 결과를 클라이언트에 보냄
        res.status(200).json(searchResults);

    } catch (error) {
        // 6. DB 조회 등 로직 처리 중 에러가 발생하면 500 에러를 보냄
        res.status(500).json({ message: "서버 내부에서 오류가 발생했습니다." })
    }
};