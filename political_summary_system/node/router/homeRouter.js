const express = require('express');
const {insertMember} = require('../database/query');
const router = express.Router();

// test
router.get('/' , async (req, res)=>{
    
    // const csvData = await csvReader.readFile();
    // console.log("get : ", csvData);


    // for(i=0;i<csvData.length;i++){
    //     insertMember(csvData[i].name,csvData[i].age,csvData[i].position,csvData[i].politics );
    // }


    res.send("hello from server!");
})

// 회원가입
router.get('/join', async (req, res) => {


    res.send("회원가입 페이지입니다.");
})
// 로그인
router.get('/login', async (req, res) => {

    res.send("로그인 페이지입니다.");
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
router.get('/deleteuser', async (req, res) => {
    res.send("회원 탈퇴 페이지입니다.");
})
module.exports = router;