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

// 로그인

module.exports = router;