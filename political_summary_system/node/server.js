const express = require("express");
const cors = require("cors"); // CORS 정책 관련 HTTP 헤더를 자동으로 설정
const app = express();

const homeRouter = require("./router/homeRouter.js");
const adminRouter = require("./router/adminRouter.js");

app.use(express.urlencoded({extended : true}))

app.use(express.json());

app.use(cors());

app.use('/', homeRouter);
app.use('/admin', adminRouter);

app.listen(8000);