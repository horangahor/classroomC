const { loginUser, registerUser, deleteUser } = require('../database/userQuery');

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
async function update(req, res) {
    
}

// 회원탈퇴 기능
async function remove(req) {
    
    const { pw } = req.body;
    const result = await deleteUser(pw);
    
    return result;

}

module.exports = {join, login, remove};