// 정치인 인물들의 정보를 관리하는 페이지 입니다

const pool = require("./db"); 
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// CSV 파일에서 로드된 데이터를 저장할 전역 변수
let membersFromCsv = [];

// CSV 파일 로드 및 파싱 함수
// 서버 시작하면 한번만 실행되게 할거임
const loadMembersFromCsv = () => {
    return new Promise((resolve, reject) => {
        const filePath = path.join(__dirname, 'politician.csv');
        fs.createReadStream(filePath, { encoding: 'utf-8' })
            .pipe(csv())
            .on('data', (data) => membersFromCsv.push(data))
            .on('end', () => {
                console.log('politician.csv 파일 로드 완료.');
                resolve();
            })
            .on('error', (err) => {
                console.error('CSV 파일 로드 중 오류 발생:', err);
                reject(err);
            });
    });
};

async function insertMember(name, age, position, politics){
    const conn = await pool.getConnection();

    try{
        const [result] = await conn.execute("insert into member(name,age,position,politics) values(?,?,?,?)", 
            [name, age, position, politics]
        );
        // console.log(result);
        return result.affectedRows;
    }
    catch (err) {
        console.error("데이터베이스 삽입 오류:", err);
        throw err;
    } finally {
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
        const [results] = await conn.execute(
            "select * from member where name = ?",
            [name]
        );
        return results;
    } finally {
        conn.release();
    }
}

async function getMemberById(id) {
    const conn = await pool.getConnection();
    try {
        const [results] = await conn.execute(
            "select * from member where id = ?",
            [id]
        );
        return results[0];
    } finally {
        conn.release();
    }
}


module.exports = { 
    insertMember, 
    removeMember, 
    getMemberByName, 
    getMemberById
};
