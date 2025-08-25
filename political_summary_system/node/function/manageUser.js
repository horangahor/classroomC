const { loginUser, registerUser, updateuser, deleteuser } = require('../database/userQuery');
const jwt = require("jsonwebtoken");
const crypto = require('crypto');

// 회원가입
async function join(req) {
    // 요청데이터 가져오기(body)
    console.log(req);
    const { id, pw, name, phnum } = req.body;
    const hashed_pw = crypto.createHash('sha256').update(pw).digest('base64');
        const result = await registerUser(id, hashed_pw, name, phnum);

        console.log('manageUser의 join 함수 result : ', result);
}

// 로그인 기능 + 캐시 기능 추가 예정
async function login(req) {
    
    const { id, pw } = req.body;
    const hashed_pw = crypto.createHash('sha256').update(pw).digest('base64');
    const [result] = await loginUser(id, hashed_pw);
    // console.log(result);


    return result;


    // 토큰 발급
    // if (result){
    //     const token = jwt.sign(
    //         { id : result.uid , name : result.uname , phnum : result.uphnum },
    //         "mysecretkey",
    //         { expiresIn : "5m" });
    //     return token;
    // }
    // else{
    //     return result;
    // }
}

// 회원정보 수정 기능
async function update(id, name, phnum, cpw, npw) { // req, res를 제거하고 필요한 인자만 받습니다.
    try {

        const hashed_cpw = crypto.createHash('sha256').update(cpw).digest('base64');
        
        const hashed_npw = crypto.createHash('sha256').update(npw).digest('base64');
        // 쿼리 함수 호출
        const result = await updateuser(id, name, phnum,hashed_cpw,hashed_npw);
        
        // 쿼리 결과(affectedRows)를 보고 성공/실패 여부를 판단하여 반환
        if (result.affectedRows > 0) {
            return { success: true, message: '회원 정보가 성공적으로 수정되었습니다.' };
        } else {
            return { success: false, message: '수정할 회원을 찾을 수 없거나 변경된 내용이 없습니다.' };
        }

    } catch (err) {
        console.error("회원정보 수정 중 오류:", err);
        // 오류 발생 시에도 응답을 반환합니다.
        return { success: false, message: '서버 오류가 발생했습니다.' };
    }
}

// 회원탈퇴 기능
async function remove(req, session) {
    const { pw } = req.body;
        const result = await deleteuser(session.id, session.name , pw);
}

module.exports = {join, login, update, remove};