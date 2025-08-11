const express = require('express');
const { join, login, update, remove } = require("../function/manageUser");
const { getNewsList } = require("../database/newsQuery");
const sessionStore = require("../server");
const router = express.Router();

function getSession(req, res) {
    // console.log("homeRouter의 getSession 함수 :" + req.session.user);
    res.status(200).json(req.session.user);
}


// delete 세션인데 쓸까말까
function deleteSession(req, res) {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send("이유 모름");
        }
        res.clearCookie('connect.sid');
        res.status(200).send("성공");
    })
}


// main 페이지
router.get('/', getSession);


router.post('/join', async (req, res) => {
    await join(req);

    res.send("회원가입 페이지입니다.");
})

// 로그인
router.post('/login', async (req, res) => {

    const result = await login(req);

    console.log("homeRouter의 /login 결과 : " + result);

    if (result) {
        req.session.user = {
            id: result.uid,
            name: result.uname,
            isLogin: true // 필요한가 ?
        }
        console.log("homeRouter의 /login 만들어 낸 세션" + req.session.user);

        res.status(200).send('로그인 성공');
    }
    else {
        res.status(401).send("사용자 정보 없음");
    }

    // 토큰 보내기. 보류
    // const token = await login(req);
    // if(token){
    //     res.state(200).json({message : '로그인 성공' , token : token});
    // }
    // else {
    //     res.state(401).send("사용자 정보 없음");
    // }
})

router.post('/logout', async (req,res)=>{
    deleteSession(req,res);
})


// router.get('/', getSession);

// 마이페이지
router.get('/mypage', async (req, res) => {


    res.send("마이페이지입니다.");
})

// 회원 정보 수정
router.post('/updateuser', async (req, res) => {
    // 이름이 달라서 안받아짐
    const { id, name, phnum, cpw, npw } = req.body;

    try {
        // manageUser.js의 update 함수를 호출하고, 반환된 결과를 받습니다.
        const result = await update(id, name, phnum, cpw, npw);

        res.send("hi");
    }
    catch (err) {
        console.error("라우터에서 회원정보 수정 오류:", err);
        res.status(500).send("서버 오류가 발생했습니다.");
    }
});

// 회원 탈퇴
router.post('/deleteuser', async (req, res) => {
    // const { password, confirmText } = req.body;
    const { upw } = req.body;
    console.log(upw);

    // 회원 탈퇴 로직

    // res.json({ message: "회원 탈퇴가 완료되었습니다." });
    const user = await req.session.user;
    console.log(user);
    await remove(req, user);
    deleteSession(req, res);
});


router.get('/getNews', async (req, res) => {
    const newsList = await getNewsList(req.query.page);
    res.json(newsList);
})


module.exports = router;