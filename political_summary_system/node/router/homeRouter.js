const express = require('express');
const router = express.Router();
const {insertMember} = require('../database/query');

// 파일 리더
const csvReader = require("../function/fileReader")



// test
router.get('/' , async (req, res)=>{
    
    // const csvData = csvReader.readCsv();
    const csvData = await csvReader.readFile();
    console.log("get : ", csvData);


    for(i=0;i<csvData.length;i++){
        insertMember(csvData[i].name,csvData[i].age,csvData[i].position,csvData[i].politics );
    }


    res.send("hello from server!");
})


// 회원가입 

// 로그인

module.exports = router;