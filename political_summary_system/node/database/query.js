const pool = require("./db");

async function insertMember(name, age, position, politics){
    const conn = await pool.getConnection();

    try{
        const [result] = await conn.execute("insert into members(name,age,position,politics) values(?,?,?,?)", [name, age, position, politics]);
        
        console.log(result);
        return result.affectedRows;
    }
    finally{
        conn.release();
    }
}

module.exports = {insertMember};

async function removeMember(name){
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.execute(
            "delete from members where name = ?",
            [name]
        );
        console.log(result);
        return result.affectedRows
    } finally {
        conn.release();
    }
}

module.exports = { insertMember, removeMember };