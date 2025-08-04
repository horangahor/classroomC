const express = require('express');
const {join , login, update, remove} = require("../function/manageUser");
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
router.get('/deleteuser', async (req, res) => {
    // const { password, confirmText } = req.body;

    // if (!password || confirmText !== "회원탈퇴") {
    //     return res.status(400).json({ message: "입력값이 올바르지 않습니다." });
    // }

    // res.json({ message: "회원 탈퇴가 완료되었습니다." });

        await remove(req);
        res.send("회원 탈퇴 페이지입니다.");
});

module.exports = router;