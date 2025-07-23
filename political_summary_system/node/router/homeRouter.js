const express = require('express');
const router = express.Router();
const conn = require("../database/db");

// test
router.get('/' , (req, res)=>{
    console.log("hi");
    res.send("hello from server!");
})


// 회원가입 

// 로그인

module.exports = router;