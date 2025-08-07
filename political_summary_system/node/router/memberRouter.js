const express = require("express");
const router = express.Router();
const { getMemberInfo } = require("../function/manageMember");

router.get("/member/:id", getMemberInfo);

module.exports = router;