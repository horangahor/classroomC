// 프론트 서버의 /upload를 통해 접근


const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const {insertMember, } = require('../database/memberQuery');
const router = express.Router();
const {insertNews} = require('../database/newsQuery');


// 파일 리더
const csvReader = require("../function/fileReader")


const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null , 'dataset/');
    },
    filename : (req , file, cb) => {
        cb(null, Date.now() +path.extname(file.originalname));
    }
})

const upload = multer({
    storage
});


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

module.exports = router;