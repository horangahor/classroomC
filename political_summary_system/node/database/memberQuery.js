const pool = require("./db");

async function insertMember(name, age, position, politics){
    const conn = await pool.getConnection();

    try{
        const [result] = await conn.execute("insert into member(name,age,position,politics) values(?,?,?,?)", 
            [name, age, position, politics]
        );
        // console.log(result);
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