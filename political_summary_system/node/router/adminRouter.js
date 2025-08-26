// 프론트 서버의 /upload를 통해 접근

// 1. 필요한 모듈 가져오기 (import)
const express = require('express');

const multer = require('multer');
const fs = require('fs');
const path = require('path');
const {insertMember, } = require('../database/memberQuery');
const router = express.Router();
const {insertNews} = require('../database/newsfavQuery');


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
    console.log("json 파일 생성");
    
    
    const fileName  = req.file.originalname
    const fileType = fileName.slice(fileName.indexOf(".")+1,);
    console.log(fileType);

    if(fileType == "csv"){
        const filePath = path.join(__dirname, "..", "dataset", req.file.filename);
        // console.log(filePath);

        try{
            const csvData = await csvReader.readFile(filePath);
            // console.log("/upload의 : ", csvData);


            const insertionPromises = csvData.map(data => insertMember(data));
            await Promise.all(insertionPromises);

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
    }
    else if (fileType == "json"){
        const filePath = path.join(__dirname, "..", "dataset", req.file.filename);
        // console.log(filePath);

        try{
            const jsonFile = fs.readFileSync(filePath, 'utf8');
            const jsonData = JSON.parse(jsonFile);
            // console.log("/upload의 : " ,jsonData);
            
            // jsonData.map(data => insertNews(data));
            const insertionPromises = jsonData.map(data => insertNews(data));
            await Promise.all(insertionPromises);
            

            res.status(200).json({ message: "파일 업로드 및 처리 성공", status: "ok" });
        }
        catch(err){
            console.error(err);
            res.status(500).json({message: "알 수 없는 오류"});
        }
        finally{
            await fs.unlink(filePath, (err) => {
                if(err){
                    console.error(err);
                }
            });
        }
    }
    else{
        res.status(415).json({message : "파일 형식 맞지 않음"});
    }
    
})

// 4. 라우터 내보내기 (export)
module.exports = router;