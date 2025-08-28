// 이곳은 사용자들의 정보를 관리하는 페이지입니다.
// 여기는 쿼리문만 써요.
const pool = require("./db");
const crypto = require("crypto");



async function loginUser(id, hashed_pw){
    const conn = await pool.getConnection();
    try {
        const [results] = await conn.execute(
            "select * from user WHERE uid = ? and upw = ? and isVerified='Y'",
            [id, hashed_pw]
        );
        return results;
    }
    finally{
        conn.release();
    }

}

async function findSalt(id){
    const conn = await pool.getConnection();
    try{
            const [result_salt] = await conn.execute(
            "select salt from user WHERE uid = ? and isVerified='Y'",
            [id]
        );
        const salt = result_salt[0].salt;

        return salt;
    }catch(err){
        console.error(err);
    }
    finally{
        conn.release();
    }
}



async function registerUser(id, pw, name, phnum, code , salt){
    const conn = await pool.getConnection();
    try{
        const [results] = await conn.execute(
            "insert into user values(? , ? , ? , ?, 'F', ? , ? )",
            [id , pw , name , phnum, code, salt]
        );
        return results;
    }
    catch(err){
        if(err.code == 'ER_DUP_ENTRY'){
            const [result] = await conn.execute(
                "update user set code = ? where uid = ? ",
                [code, id]
            );
        }
        
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

async function confirmQuery(query){
    const conn = await pool.getConnection();
    try{
        const [result] = await conn.execute(
            "update user set isVerified = 'Y', code = null where code = ? "
            ,[query.token ]
        )
        return result;
    }
    catch(err){
        console.error(err);
    }
    finally{
        conn.release();
    }
}

async function giveCodeToTuple(email, name, code){
    const conn = await pool.getConnection();
    try{
        const [result] = await conn.execute(
            "update user set code = ? where email = ? and name = ? "
            ,[code, email, name ]
        )
        return result;
    }
    catch(err){
        console.error(err);
    }
    finally{
        conn.release();
    }
}

async function giveCodeToTuple(email,name,code){
    const conn = await pool.getConnection();
    try{
        const [result] = await conn.execute(
            "update user set code = ?  where uid = ? and uname = ? "
            ,[code, email, name ]
        )
        return result;
    }
    catch(err){
        console.error(err);
    }
    finally{
        conn.release();
    }
}

async function changePwWithCode(token, pw){
    // console.log("코드로 비번 변경하기", pw);
    
    const conn = await pool.getConnection();
    try{
        const [salt_re] = await conn.execute(
            "select salt from user where code = ? "
            ,[token]
        )
        const salt = salt_re[0].salt;

        const salted_pw = salt + pw;
        const hashed_pw = crypto.createHash('sha256').update(salted_pw).digest('base64');

        const [result] = await conn.execute(
            "update user set code = null, upw = ?  where code = ? "
            ,[hashed_pw, token ]
        )
        return result;
    }
    catch(err){
        console.error(err);
    }
    finally{
        conn.release();
    }
}


module.exports = { loginUser, registerUser, updateuser, deleteuser, confirmQuery, giveCodeToTuple, changePwWithCode, findSalt };
