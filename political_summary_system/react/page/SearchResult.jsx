
// ===================== SearchResult.jsx =====================
// 검색 결과 페이지 - API 연동 기반 프론트 구현
// - Header, 검색어 표시, 결과 리스트, 로딩/에러 처리, 간단 페이징
// - AbortController로 이전 요청 취소하여 race condition 방지
// ==========================================================
import React, { useEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';
import Header from '../components/Header.jsx';
import '../style/colors.css';
import '../style/SearchResult.css';

const SearchResult = () => {
    const location = useLocation();
    const paramsIn = new URLSearchParams(location.search);
    const query = paramsIn.get('query') || '';
    const initialPage = parseInt(paramsIn.get('page') || '1', 10);
    const limit = parseInt(paramsIn.get('limit') || '20', 10);

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(initialPage);

    // 페이지가 URL과 다를 경우 초기화
    useEffect(() => {
        setPage(initialPage);
    }, [initialPage]);

    useEffect(() => {
        if (!query) {
            setResults([]);
            setTotal(0);
            setError(null);
            setLoading(false);
            return;
        }

        const controller = new AbortController();
        const signal = controller.signal;

        const fetchResults = async () => {
            setLoading(true);
            setError(null);
            try {
                const qs = new URLSearchParams({ query, page, limit });
                const res = await fetch(`http://localhost:8000/api/search?${qs.toString()}`, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' },
                    signal,
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                setResults(data.results || []);
                setTotal(typeof data.total === 'number' ? data.total : (data.results ? data.results.length : 0));
            } catch (err) {
                if (err.name === 'AbortError') return; // 정상적인 취소
                console.error('search error', err);
                setError(err.message || '검색 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchResults();

        return () => controller.abort();
    }, [query, page, limit]);

    const handlePrev = () => { if (page > 1) setPage(p => p - 1); };
    const handleNext = () => { if (page * limit < total) setPage(p => p + 1); };

    return (
        <div className="search-result-container">
            <Header />
            <main className="search-result-main">
                <h2 className="search-result-title">"{query}" 검색 결과</h2>

                {!query ? (
                    <div className="result-info">검색어를 입력해 주세요.</div>
                ) : loading ? (
                    <div className="result-info">로딩 중...</div>
                ) : error ? (
                    <div className="result-info">에러: {error}</div>
                ) : results.length === 0 ? (
                    <div className="result-info">검색 결과가 없습니다.</div>
                ) : (
                    <>
                        <div className="result-meta">총 {total}개 · 페이지 {page}</div>
                        <ul className="result-list">
                            {results.map(item => (
                                <li key={item.news_identifier} className="result-card">
                                    <div className="result-title">{item.title || item.name || item.id}</div>
                                    <div className="result-summary">{item.snippet || item.summary || item.bio_snippet || ''}</div>
                                </li>
                            ))}
                        </ul>

                        <div className="pagination-controls">
                            <button onClick={handlePrev} disabled={page <= 1}>이전</button>
                            <span className="page-indicator">{page}</span>
                            <button onClick={handleNext} disabled={page * limit >= total}>다음</button>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default SearchResult;

/* ===================== 유지보수/협업 주석 =====================
   - API: GET /api/search?query=...&page=...&limit=...
   - 응답 권장 스키마: { total, page, limit, results: [...] }
   - AbortController로 이전 요청 취소
   - 필요시 페이지 변경 시 URL 동기화(nav)를 추가하세요
============================================================== */
