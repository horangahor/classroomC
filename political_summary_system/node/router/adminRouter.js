// 프론트 서버의 /upload를 통해 접근

// 1. 필요한 모듈 가져오기 (import)
const express = require('express');
const multer = require('multer');                               // 파일 업로드
const fs = require('fs');                                       // 파일 시스템 모듈 (ex.파일 읽기, 쓰기, 삭제 등)
const path = require('path');                                   // 경로(path) 관리 모듈
const { insertMember } = require('../database/memberQuery');    // 회원 정보에 삽입하는 insertMember 함수를 가져옴
const router = express.Router();                                // 라우터 객체를 생성


// 파일 리더
const csvReader = require("../function/fileReader")             // CSV 파일 내용을 JSON 형태로 변환

// 2. Multer 설정 (파일 저장 방식 및 위치 지정)
const storage = multer.diskStorage({
    // 파일을 어떻게 저장할지 정의
    destination : (req, file, cb) => {
        cb(null , 'dataset/');
    },
    // 파일 이름을 어떻게 할지 정의
    filename : (req , file, cb) => {
        cb(null, Date.now() +path.extname(file.originalname));
    }
})

const upload = multer({
    storage
});

// 3. 라우트 핸들러 정의 (실제 기능 구현)
router.post('/upload',upload.single('file'), async(req, res)=>{
    
    const fileType = req.file.originalname.slice(-3,);
    console.log(fileType);

    if(fileType != "csv"){
        res.status(415).json({message : "파일 형식 맞지 않음"});
    }
    
    const filePath = path.join(__dirname, "..", "dataset", req.file.filename);
    console.log(filePath);

    try{
        const csvData = await csvReader.readFile(filePath);
        // console.log("get : ", csvData);


        const insertionPromises = csvData.map(data => insertMember(data.id, data.name, data.age, data.location, data.affiliation, data.profile_image_url, data.pledge));
        await Promise.all(insertionPromises);

        // for(i=0;i<csvData.length;i++){
        //     await insertMember(csvData[i].name,csvData[i].age,csvData[i].position,csvData[i].politics );
        // }
        res.status(200).json({ message: "파일 업로드 및 처리 성공", status: "ok" });
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "알 수 없는 오류"});
    }
    finally{
        fs.unlink(filePath, (err) => {
            if(err){
                console.error(err);
            }
        });
    }
})

// 4. 라우터 내보내기 (export)
module.exports = router;