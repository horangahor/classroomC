const pool = require("./db");

async function insertMember(id, name, age, location, affiliation, profile_image_url, pledge){
    const conn = await pool.getConnection();

    try{
        const [result] = await conn.execute("insert into member(id,name,age,location, affiliation, profile_image_url, pledge) values(?, ?, ?, ?, ?, ?, ?)", 
            [id, name, age, location, affiliation, profile_image_url, pledge]
        );
        console.log("insertMember의");
        console.log(result);
        
        return result.affectedRows;
    }
    catch{
        
    }
    finally{
        conn.release();
    }
}

async function removeMember(name){
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.execute(
            "delete from member where name = ?",
            [name]
        );
        console.log("memberQUery, removeMemeber 결과 " + result);
        return result.affectedRows;
    } 
    finally {
        conn.release();
    }
}

async function getMemberByName(name) {
    const conn = await pool.getConnection();
    try {
        const [results] = await conn.execute(
            "select * from member where name = ?",
            [name]
        );
        return results;
    } finally {
        conn.release();
    }
}



module.exports = { insertMember, removeMember, getMemberByName };
