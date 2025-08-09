const pool = require("./db");

async function insertMember(name, age, position, politics){
    const conn = await pool.getConnection();

    try{
        const [result] = await conn.execute("insert into members(name,age,position,politics) values(?,?,?,?)", 
            [name, age, position, politics]
        );
        // console.log(result);
        return result.affectedRows;
    }
    catch (error) {
        // 1. catch에 error 파라미터를 추가
        // 2. 발생한 오류내용을 콘솔에 출력해서 원인파악
        console.error("db insert 중 오류가 발생했습니다:", error);
        // 3. 오류를 다시 던져서 이 함수를 호출한 곳에서도 오류를 인지할수있게한다
        throw error;
    } finally {
        conn.release();
    }
}

async function removeMember(name){
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.execute(
            "delete from members where name = ?",
            [name]
        );
        console.log(result);
        return result.affectedRows;
    } 
    finally {
        conn.release();
    }
}

async function getMemberByName(name) {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.execute(
            "select * from members where name = ?",
            [name]
        );
        return rows;
    } finally {
        conn.release();
    }
}



module.exports = { insertMember, removeMember, getMemberByName };