// 1. 모듈 및 라이브러리 기능 불러오기
const express = require("express");
const cors = require("cors"); // CORS 정책 관련 HTTP 헤더를 자동으로 설정
const session = require('express-session') // 세션을 사용하기 위한 모듈
const app = express();



// 세션은 서버의 램에 저장
const MemoryStore = require('express-session').MemoryStore;

// 2. 라우터 가져오기 (페이지 주소 그룹 불러오기)
const homeRouter = require("./router/homeRouter.js");
const adminRouter = require("./router/adminRouter.js");
const memberRouter = require("./router/memberRouter.js");
const searchRouter = require("./router/searchRouter.js");

// 3. 세션 저장소(Store) 인스턴스 생성
const sessionStore = new MemoryStore();

// 4. 미들웨어가 라우터에 도달하기전에 거쳐가는 처리 단계들
app.use(express.urlencoded({extended : true}))

// 세션 관리 (미들웨어 설정)
app.use(session({
    secret : 'mySecretKey', // 비밀키, 추후 변경 필요
    resave : false,         // 변경사항이 없으면 세션을 다시 저장하지 않음
    saveUninitialized : false, // false로 설정되면 초기화 되지 않은 세션에 대해서는 저장하지 않음
    store : sessionStore,
    cookie : { // 쿠키에 대한 설정
    maxAge : 1000 * 60 * 100 // 단위는 ms 즉 10분
    },
    rolling : true
}))

// API 요청 등에서 JSON 형태로 오는 데이터를 req.body 객체에서 사용할 수 있게 해줌
app.use(express.json());

// CORS 미들웨어를 앱에 적용
app.use(cors(
    {origin: 'http://localhost:5173' , 
    credentials : true}
));

// 5. 특정 라우트(주소) 로직 직접 정의 (디버기용)
homeRouter.get('/sessions', (req, res)=>{
    const allSessions = sessionStore.sessions; // MemoryStore에 저장된 모든 세션 정보를 가져옵니다.

    console.log("세션 리스트 가져오기 요청 받음 ");
    console.log(allSessions);

    res.send("hi");
})

// 6. 라우터(주소) 등록
app.use('/', homeRouter);
app.use('/admin', adminRouter);
app.use('/', memberRouter);
app.use('/api', searchRouter);

// 7. 서버 실행
app.listen(8000, () => {
    console.log("서버가 http://localhost:8000 에서 실행 중 입니다.");
});

// const keyword = req.query.keyword;
// console.log("서버가 받은 검색어:", keyword);