const pool = require("./db");

async function getNewsList(page) {
    const conn = await pool.getConnection();
    // const f_news = (page-1) * 9 + 1;
    // const l_news = page * 9;
    try {
        const [results] = await conn.execute(
            "select * from news"
        );
        // console.log("newsQueyr의" +results);
        return results;
    }
    finally{
        conn.release();
    }
}

async function insertNews(obj){
    
    const conn = await pool.getConnection();
    // console.log(obj);
    
    try{
        const [result] = await conn.execute(
            "insert into news(news_identifier,date,media_company,politician, location, institution, title, summary, url) values(?, ?, ?, ?, ?, ?, ?, ?, ?)"
            ,[obj.news_identifier, obj.date, obj.media_company, obj.politician, obj.location, obj.institution, obj.title, obj.summary, obj.url]
        );
        console.log("insertNews의");
         console.log(result);
        return result.affectedRows;
    }
    catch(err){
        console.error(err);
    }
    finally{
        conn.release();
    }
}

module.exports = { getNewsList, insertNews };