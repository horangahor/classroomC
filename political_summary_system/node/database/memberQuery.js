const pool = require("./db");

async function insertMember(obj){
    const conn = await pool.getConnection();
    // console.log(obj );
    
    try{
        const [result] = await conn.execute("insert into member(id,name,age,location, affiliation, profile_image_url, pledge,position) values(?, ?, ?, ?, ?, ?, ?, ?)", 
            [obj.id, obj.name, obj.age, obj.location, obj.affiliation, obj.profile_image_url, obj.pledge, obj.position   ]
        );
        console.log("insertMember의");
        // console.log(result);
        
        return result.affectedRows;
    }
    catch(err){
        console.error(err);
        
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

async function getMember() {
    const conn = await pool.getConnection();
    try {
        const [results] = await conn.execute(
            "select * from member",
        );
        return results;
    } finally {
        conn.release();
    }
}

// 새로 추가: id로 단일 정치인 조회
async function getMemberById(id) {
    const conn = await pool.getConnection();
    try {
        const [results] = await conn.execute(
            "select * from member where id = ?",
            [id]
        );
        return results[0] || null;
    } finally {
        conn.release();
    }
}


module.exports = { insertMember, removeMember, getMember, getMemberById };
