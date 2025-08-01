const pool = require("./db");

async function loginUser(id, pw){
    const conn = await pool.getConnection();
    try {
        const [results] = await conn.execute(
            "select * from user where uid = ? and upw = ?",
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
            "insert into user values(? , ? , ? , ? )",
            [id , pw , name , phnum]
        );
        return results;
    }
    finally {
        conn.release();
    }
}




module.exports = {loginUser, registerUser};