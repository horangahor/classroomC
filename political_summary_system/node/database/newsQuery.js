const pool = require("./db");

async function getNewsList(page) {
    const conn = await pool.getConnection();
    const f_news = (page-1) * 9 + 1;
    const l_news = page * 9;
    try {
        const [results] = await conn.execute(
            "select * from news WHERE news_identifier >= ? and news_identifier <= ?",
            [f_news , l_news]
        );
        console.log("newsQueyr의" +results);
        return results;
    }
    finally{
        conn.release();
    }
}

module.exports = { getNewsList };