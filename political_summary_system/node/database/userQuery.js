// 이곳은 사용자들의 정보를 관리하는 페이지입니다.
// 여기는 쿼리문만 써요.
const pool = require("./db");

async function loginUser(id, pw){
    const conn = await pool.getConnection();
    try {
        const [results] = await conn.execute(
            "select * from user WHERE uid = ? and upw = ? and isVerified='Y'",
            [id, pw]
        );
        return results;
    }
    finally{
        conn.release();
    }

}

async function registerUser(id, pw, name, phnum){
    const conn = await pool.getConnection();
    try{
        const [results] = await conn.execute(
            "insert into user values(? , ? , ? , ?, 'F' )",
            [id , pw , name , phnum]
        );
        return results;
    }
    finally {
        conn.release();
    }
}

async function updateuser(id, name, phnum, cpw, npw) {
    const conn = await pool.getConnection();
    try{
        const [results] = await conn.execute(
            "update user set upw = ?  WHERE uid = ? and uname = ? and uphnum = ? and upw = ? ",
            [npw, id, name, phnum, cpw]
        );
        return results;
    } finally {
        conn.release();
    }
}

async function deleteuser(id, name ,pw) {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.execute(
            "delete from user where uid = ? and uname = ? and upw = ?",
            [id,name, pw]
        );
        return result;
    } finally {
        conn.release();
    }
}

module.exports = { loginUser, registerUser, updateuser, deleteuser };
