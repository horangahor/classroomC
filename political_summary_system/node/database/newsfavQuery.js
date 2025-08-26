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

async function favor(obj){
    
    if(obj.uid!==undefined){ // 세션 로그인이 되어 있으면
        const conn = await pool.getConnection();
        if (obj.nid != -1){
            try{
                const existing = await conn.execute(
                "select * from user_favor where fuid = ? and news_id = ?",
                [obj.uid , obj.nid]
                );
                console.log("select 절의",existing[0]);

                if(existing[0].length != 0){ // 검색 결과가 존재하면
                    if(existing[0][0].del == "Y") // 얘가 Y 면 -> N으로 
                    {
                        const result = await conn.execute(
                        "update user_favor set del = 'N' where fuid = ? and news_id = ?",
                        [obj.uid, obj.nid])
                    }
                    else{
                        const result = await conn.execute( // 얘가 N 이면 -> Y로
                        "update user_favor set del = 'Y' where fuid = ? and news_id = ?",
                        [obj.uid, obj.nid])
                    }
                }
                else{
                    const result = await conn.execute( // 만약 검색 결과가 없다면 새로운 즐겨찾기 튜플 추가
                        "insert into user_favor values(?,?,'N')",
                        [obj.uid, obj.nid] 
                    )
                }
            }
            catch(err){ console.log(err);
            }
        }
        
        try{
            const favorList = await conn.execute(
            "select news_id from user_favor where fuid = ? and del= 'N'",
            [obj.uid]
            );
            const rows = favorList[0];
            
            return rows.map(item => item.news_id);
        }
        catch(err){
            console.log(err);
        }
        finally{
            conn.release();
        }
        }
    else{ // 세션이 존재하지 않음 ?? 
        console.log("로그인 안되어 있음");
    }
}

async function getFavor(obj){
    const conn = await pool.getConnection();
    // const f_news = (page-1) * 9 + 1;
    // const l_news = page * 9;
    try {
        const [results] = await conn.execute(
            "select * from user_favor where uid = ? and del = 'N'",
            [obj.uid]
        );
        console.log("getFavor의" +results);
        return results;
    }
    finally{
        conn.release();
    }
}

// 즐겨찾기 뉴스 리스트 반환 (사용자별)
async function getFavoriteNewsByUser(userId) {
    const conn = await pool.getConnection();
    try {
        const [results] = await conn.execute(
            `SELECT n.* FROM user_favor f JOIN news n ON f.news_id = n.news_identifier WHERE f.fuid = ? AND f.del = 'N'`,
            [userId]
        );
        return results;
    } finally {
        conn.release();
    }
}

module.exports = { getNewsList, insertNews, favor, getFavor, getFavoriteNewsByUser };