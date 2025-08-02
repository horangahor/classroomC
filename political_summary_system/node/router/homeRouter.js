const express = require('express');
const {join , login, remove} = require("../function/manageUser");
const router = express.Router();

// main 페이지
router.get('/' , async (req, res)=>{
    
    // const csvData = await csvReader.readFile();
    // console.log("get : ", csvData);


    // for(i=0;i<csvData.length;i++){
    //     insertMember(csvData[i].name,csvData[i].age,csvData[i].position,csvData[i].politics );
    // }


    res.send("hello from server!");
})

// 회원가입
router.post('/join', async (req, res) => {

    await join(req);
    
    res.send("회원가입 페이지입니다.");
})

// 로그인
router.post('/login', async (req, res) => {

    const result = await login(req);
    const nick = result.uname;
    res.json({nick : nick});
})

// 마이페이지
router.get('/mypage', async (req, res) => {


    res.send("마이페이지입니다.");
})

// 회원 정보 수정
router.get('/updateuser', async (req, res) => {

    res.send("회원 정보 수정 페이지입니다.");
})

// 회원 탈퇴
router.post('/deleteuser', async (req, res) => {
    await remove(req);
    res.send("회원 탈퇴 페이지입니다.");
})

module.exports = router;