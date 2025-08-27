const { loginUser, registerUser, updateuser, deleteuser } = require('../database/userQuery');
const crypto = require('crypto');

// 회원가입
async function join(req, code) {
    // 요청데이터 가져오기(body)
    try {
        const { id, pw, name, phnum } = req.body;
        const hashed_pw = crypto.createHash('sha256').update(pw).digest('base64');
        const result = await registerUser(id, hashed_pw, name, phnum, code);

        // registerUser의 결과 형태에 따라 성공 여부 판단
        if (result && result.affectedRows > 0) {
            return { success: true, message: '회원가입이 완료되었습니다. 이메일을 확인하세요.' };
        } else {
            return { errorCode: 'DUPLICATE', message: '이미 존재하는 회원입니다.' };
        }
    } catch (err) {
        console.error('join error', err);
        return { errorCode: 'SERVER_ERROR', message: '서버 오류가 발생했습니다. 잠시 후 다시 시도하세요.' };
    }
}

// 로그인 기능 (DB 결과를 그대로 반환하여 기존 라우터와 호환)
async function login(req) {
    try {
        const { id, pw } = req.body;
        const hashed_pw = crypto.createHash('sha256').update(pw).digest('base64');
        const [result] = await loginUser(id, hashed_pw);
        return result;
    } catch (err) {
        console.error('login error', err);
        return { errorCode: 'SERVER_ERROR', message: '서버 오류가 발생했습니다.' };
    }
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
            return { errorCode: 'NOT_MODIFIED', message: '수정할 회원을 찾을 수 없거나 변경된 내용이 없습니다.' };
        }

    } catch (err) {
        console.error("회원정보 수정 중 오류:", err);
        // 오류 발생 시에도 응답을 반환합니다.
        return { errorCode: 'SERVER_ERROR', message: '서버 오류가 발생했습니다.' };
    }
}

// 회원탈퇴 기능
async function remove(req, session) {
    try {
        const { pw } = req.body;
        const hashed_pw = crypto.createHash('sha256').update(pw).digest('base64');
        const result = await deleteuser(session.id, session.name , hashed_pw);

        if (result && result.affectedRows > 0) {
            return { success: true, message: '회원탈퇴가 완료되었습니다.' };
        } else {
            return { errorCode: 'NOT_FOUND', message: '해당 회원을 찾을 수 없거나 비밀번호가 일치하지 않습니다.' };
        }
    } catch (err) {
        console.error('remove error', err);
        return { errorCode: 'SERVER_ERROR', message: '서버 오류가 발생했습니다.' };
    }
}

module.exports = {join, login, update, remove};