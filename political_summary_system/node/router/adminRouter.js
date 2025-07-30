const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const {insertMember, } = require('../database/query');
const router = express.Router();


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
    
    console.log(req.filename);
    const filePath = path.join(__dirname, "..", "dataset", req.file.filename);
    try{
        const csvData = await csvReader.readFile(filePath);
        console.log("get : ", csvData);


        const insertionPromises = csvData.map(data => insertMember(data.name, data.age, data.position, data.politics));
        await Promise.all(insertionPromises);

        // for(i=0;i<csvData.length;i++){
        //     await insertMember(csvData[i].name,csvData[i].age,csvData[i].position,csvData[i].politics );
        // }
    }
    catch(err){
        console.error(err);
    }
    finally{
        fs.unlink(filePath, (err) => {
            if(err){
                error(err);
            }
        });
        res.status(200).json({ message: "파일 업로드 및 처리 성공", status: "ok" });
    }
})

module.exports = router;