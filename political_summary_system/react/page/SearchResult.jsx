/* SearchResult.jsx - 검색결과 페이지 컴포넌트: 렌더링 구조와 props 설명 주석만 유지 */

import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header.jsx';
import '../style/colors.css';
import '../style/SearchResult.css';

const sampleData = [
    { id: 1, title: '정치 뉴스 샘플', summary: '정치 관련 뉴스 요약입니다.' },
    { id: 2, title: '정치인 정보 샘플', summary: '정치인 관련 정보입니다.' },
    { id: 3, title: '경제 뉴스 샘플', summary: '경제 관련 뉴스 요약입니다.' },
];

function getResults(query) {
    if (!query) return [];
    // 샘플: 제목/요약에 검색어 포함된 데이터 반환
    return sampleData.filter(
        item => item.title.includes(query) || item.summary.includes(query)
    );
}

const SearchResult = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const query = params.get('query') || '';
    const results = getResults(query);

    return (
        <div className="search-result-container">
            <Header />
            <main className="search-result-main">
                <h2 className="search-result-title">
                    "{query}" 검색 결과
                </h2>
                {query === '' ? (
                    <div className="result-info">
                        검색어를 입력해 주세요.
                    </div>
                ) : results.length === 0 ? (
                    <div className="result-info">
                        검색 결과가 없습니다.
                    </div>
                ) : (
                    <ul className="result-list">
                        {results.map(item => (
                            <li key={item.id} className="result-card">
                                <div className="result-title">{item.title}</div>
                                <div className="result-summary">{item.summary}</div>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </div>
    );
};

export default SearchResult;

/* ===================== 유지보수/협업 주석 =====================
   - 검색어 표시, 결과 리스트, 안내 메시지, 반응형
   - colors.css 변수만 사용, 직접 색상 사용 금지
   - 샘플 데이터/검색 로직, 추후 API 연동/확장 가능
============================================================== */
