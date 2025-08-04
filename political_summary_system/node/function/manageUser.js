const { loginUser, registerUser, updateuser, deleteuser } = require('../database/userQuery');

// 회원가입
async function join(req) {
    // 요청데이터 가져오기(body)
    console.log(req);
    const { id, pw, name, phnum } = req.body;
        const result = await registerUser(id, pw, name, phnum);

        console.log('result : ', result);
    
        // if (result > 0) {
        // res.redirect('/login');
        // } else {
        // res.redirect('/join');
        // }
}

// 로그인 기능 + 캐시 기능 추가 예정
async function login(req) {
    
    const { id, pw } = req.body;
    const [result] = await loginUser(id, pw);
    console.log(result);
    return result;
}

// 회원정보 수정 기능
async function update(id, name, phnum, cpw, npw) { // req, res를 제거하고 필요한 인자만 받습니다.
    try {

        // 쿼리 함수 호출
        const result = await updateuser(id, name, phnum, cpw, npw);
        
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
async function remove(req) {
    // const { pw } = req.body;
    try {
        const result = await deleteuser(pw);
        if (result.affectedRows > 0) {
            res.redirect('/bye');
        } else {
            res.redirect('/remove');
        }
    } catch (err) {
        console.error("회원탈퇴 중 오류", err);
        res.redirect('/remove');
    }
}

module.exports = {join, login, update, remove};