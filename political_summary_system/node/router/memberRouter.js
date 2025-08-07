const express = require("express");
const router = express.Router();
const { getMemberInfo } = require("../function/manageMember");

router.get("/members", getMemberInfo);

module.exports = router;