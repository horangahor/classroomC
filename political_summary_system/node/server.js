<<<<<<< HEAD
const express = require("express");
const cors = require("cors"); // CORS 정책 관련 HTTP 헤더를 자동으로 설정
const session = require('express-session') // 세션을 사용하기 위한 모듈
const app = express();
const MemoryStore = require('express-session').MemoryStore;

const homeRouter = require("./router/homeRouter.js");
const adminRouter = require("./router/adminRouter.js");

const sessionStore = new MemoryStore();


app.use(express.urlencoded({extended : true}))
app.use(session({
    secret : 'mySecretKey', // 비밀키, 추후 변경 필요
    resave : false,         // 변경사항이 없으면 세션을 다시 저장하지 않음
    saveUninitialized : false, // false로 설정되면 초기화 되지 않은 세션에 대해서는 저장하지 않음
    store : sessionStore,
    cookie : { // 쿠키에 대한 설정
    maxAge : 1000 * 60 * 10 // 단위는 ms 즉 10분
    }
}))


app.use(express.json());

app.use(cors(
    {origin: 'http://localhost:5173' , 
    credentials : true}
));


homeRouter.get('/sessions', (req, res)=>{
    const allSessions = sessionStore.sessions;

    console.log("세션 리스트 가져오기의 (/sessions) : " + allSessions);
    res.send("hi");
})


app.use('/', homeRouter);
app.use('/admin', adminRouter);

=======
const express = require("express");
const cors = require("cors"); // CORS 정책 관련 HTTP 헤더를 자동으로 설정
const app = express();

// 인물 정보 관련 라우터와 데이터 로딩 함수 추가
const homeRouter = require("./router/homeRouter.js");
const adminRouter = require("./router/adminRouter.js");

const memberRouter = require("./router/memberRouter.js")
const { loadMembers } = require("./database/memberQuery.js")

app.use(express.urlencoded({extended : true}))

app.use(express.json());

app.use(cors());

app.use('/', homeRouter);
app.use('/admin', adminRouter);

// 인물 정보 라우터 연결
app.use("/api/members", memberRouter);

>>>>>>> 1e8e7ab (임시)
app.listen(8000);