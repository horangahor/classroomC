const express = require('express');
const { join, login, update, remove } = require("../function/manageUser");
const { getNewsList , favor, getFavor } = require("../database/newsQuery");
const { sendEmail, generateRandomNumber , sendPwMail } = require("../function/sendMail");
const { confirmQuery, giveCodeToTuple } = require("../database/userQuery");
const sessionStore = require("../server");
const router = express.Router();

function getSession(req, res) {
    // console.log("homeRouter의 getSession 함수 :" + req.session.user);
    res.status(200).json(req.session.user);
}



// delete 세션인데 쓰기로 함
function deleteSession(req,res){
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
    try{
        const code = await generateRandomNumber(10);
        const {id} = req.body;

        const result = await join(req, code); // 여기서 가계정을 만듦 
        sendEmail(id , code);
        res.send("회원가입 페이지입니다.");
    }
    catch(err){
        // console.log("join의 ",err);
        
        res.json(err);
    }
})
//문제는 인증을 하지 않을 때 코드의 유효기간은?

router.get('/confirm', async (req,res)=>{
    await confirmQuery(req.query);
    res.send("인증됨");
});


// 로그인
router.post('/login', async (req, res) => {

    const result = await login(req);

    console.log("homeRouter의 /login 결과 : " + result);

    if (result) {
        req.session.user = {
            id: result.uid,
            name: result.uname,
            isLogin: true, // 필요한가 ?
            phnum: result.uphnum
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


router.post('/favor', async (req, res) => {
    console.log("라우터 /favor에서 받은", req.body);
    const result = await favor(req.body);
    
    res.json(result);
})

// router.post('/getFavor', async (req, res) => {
//     const favorList = await getFavor(req.body);
//     console.log("/getFavor 받음");
    
//     res.json(favorList);
// })

router.post('/find', async (req, res)=> {
    console.log(req.body);
    
    const { email, name } = req.body;
    const code = generateRandomNumber(10); // 튜플을 인식하는 임시 코드를 발급
    await giveCodeToTuple(email, name, code); // 튜플에 임시 코드 부여
    await sendPwMail(email,code);
    res.send("hi");
})
//문제는 비밀번호 변경 메일의 주소를 외워서 아무나 접근할 수 있다면?
// => 코드를 발급해줬으니까 코드를 발급받은 대상이 없다면 실패하도록?


// 프론트에서 resetPw 페이지의 입력을 처리하는 라우터
router.get('/resetPw', async (req, res)=>{
    const {code} = req.query;
    // await changePwWithCode(,code); // 코드 가지고 비번 바꾸기 
})

module.exports = router;