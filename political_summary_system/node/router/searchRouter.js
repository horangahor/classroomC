const express = require('express');
const router = express.Router();

// 컨트롤러 파일은 현재 위치에서 한 단계 위(../)로 올라가 controllers 폴더 안에 있습니다.
const { getSearchResults } = require('../function/searchController');

// '/search' 경로로 GET 요청이 오면 getSearchResults 함수를 실행합니다.
router.get('/search', getSearchResults);

module.exports = router;
