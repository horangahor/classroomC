const express = require("express");
const cors = require("cors"); // CORS 정책 관련 HTTP 헤더를 자동으로 설정
const session = require('express-session') // 세션을 사용하기 위한 모듈
const app = express();

const homeRouter = require("./router/homeRouter.js");
const adminRouter = require("./router/adminRouter.js");

app.use(express.urlencoded({extended : true}))
app.use(session({
    secret : 'mySecretKey', // 비밀키, 추후 변경 필요
    resave : false,         // 변경사항이 없으면 세션을 다시 저장하지 않음
    saveUninitialized : false, // false로 설정되면 초기화 되지 않은 세션에 대해서는 저장하지 않음
    cookie : { // 쿠키에 대한 설정
    maxAge : 1000 * 60 * 10 // 단위는 ms 즉 10분
    }
}))


app.use(express.json());

app.use(cors(
    {origin: 'http://localhost:5173' , credentials : true}
));

app.use('/', homeRouter);
app.use('/admin', adminRouter);

app.listen(8000);