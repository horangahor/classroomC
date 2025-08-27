// ===================== SearchResult.jsx =====================
// 검색 결과 페이지 - API 연동 기반 프론트 구현
// - Header, 검색어 표시, 결과 리스트, 로딩/에러 처리, 간단 페이징
// - AbortController로 이전 요청 취소하여 race condition 방지
// ==========================================================
import React, { useEffect, useState, useContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header.jsx';
import '../style/colors.css';
import '../style/SearchResult.css';
import { FavoritesContext } from '../contexts/FavoritesContext';
import { getSession } from '../auth/auth';
import axios from 'axios';

const SearchResult = () => {
    const location = useLocation();
    const paramsIn = new URLSearchParams(location.search);
    const query = paramsIn.get('query') || '';
    const initialPage = parseInt(paramsIn.get('page') || '1', 10);
    const limit = 9; // News와 동일하게 9개씩

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(initialPage);
    const [gotoPageInput, setGotoPageInput] = useState(String(initialPage));
    const gotoInputRef = useRef();
    const { favorites, setFavorites } = useContext(FavoritesContext);

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

    // 페이지네이션 계산
    const totalPages = Math.max(1, Math.ceil(total / limit));
    function getPageList(current, total) {
        const delta = 1;
        const range = [];
        const rangeWithDots = [];
        let l;
        for (let i = 1; i <= total; i++) {
            if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
                range.push(i);
            }
        }
        for (let i of range) {
            if (l) {
                if (i - l === 2) { rangeWithDots.push(l + 1); }
                else if (i - l > 2) { rangeWithDots.push('...'); }
            }
            rangeWithDots.push(i); l = i;
        }
        return rangeWithDots;
    }
    const pageList = getPageList(page, totalPages);
    const currentIndexInList = pageList.findIndex(p => p === page);
    const leftList = currentIndexInList > -1 ? pageList.slice(0, currentIndexInList) : pageList;
    const rightList = currentIndexInList > -1 ? pageList.slice(currentIndexInList + 1) : [];

    // 즐겨찾기 토글 함수 (News와 동일)
    const toggleFavorite = async (newsId) => {
        const user = await getSession();
        axios
            .post('http://localhost:8000/favor', {
                uid: user.id,
                nid: newsId
            }, { withCredentials: true })
            .then(async (res) => {
                setFavorites(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    // 카드 렌더링
    return (
        <div className="news-page search-result-page">
            <Header />
            <div className="bg-con news-main-bg">
                <div className="news-layout">
                    <div className="news-main-content">
                        <h2 className="news-h1 search-result-title">"{query}" 검색 결과</h2>
                        {!query ? (
                            <div className="no-news result-info">검색어를 입력해 주세요.</div>
                        ) : loading ? (
                            <div className="no-news result-info">로딩 중...</div>
                        ) : error ? (
                            <div className="no-news result-info">에러: {error}</div>
                        ) : results.length === 0 ? (
                            <div className="no-news result-info">검색 결과가 없습니다.</div>
                        ) : (
                            <div className="news-grid">
                                {results.map(news => {
                                    const isFavorite = favorites.includes(news.news_identifier);
                                    return (
                                        <div className="news-card" key={news.news_identifier || news.id}>
                                            <a href={news.url} target="_blank" rel="noopener noreferrer" className="news-link">
                                                <button
                                                    className={`favorite-btn${isFavorite ? ' active' : ''}`}
                                                    onClick={e => { e.preventDefault(); e.stopPropagation(); toggleFavorite(news.news_identifier); }}
                                                    aria-label="즐겨찾기"
                                                    style={{position:'absolute',top:16,right:16}}
                                                >{isFavorite ? '★' : '☆'}</button>
                                                <div className="news-content">
                                                    <h4 className="news-title">{news.title}</h4>
                                                    <div className="news-card-body">
                                                        <p className="news-summary">{news.summary || news.description}</p>
                                                    </div>
                                                    <span className="news-meta-date">{news.date || news.pubDate}</span>
                                                </div>
                                            </a>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        {/* 페이지네이션 */}
                        {totalPages > 1 && (
                            <div className="pagination">
                                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} aria-label="이전 페이지">&#60;</button>
                                <div className="pagination-left">
                                    {leftList.map((p, idx) => p === '...'
                                        ? <span key={'l-'+idx} className="pagination-ellipsis">...</span>
                                        : <button key={'l-'+p} onClick={() => setPage(p)}>{p}</button>
                                    )}
                                </div>
                                <div className="pagination-center">
                                    <button className="pagination-current-btn" disabled>{page}</button>
                                </div>
                                <div className="pagination-right">
                                    {rightList.map((p, idx) => p === '...'
                                        ? <span key={'r-'+idx} className="pagination-ellipsis">...</span>
                                        : <button key={'r-'+p} onClick={() => setPage(p)}>{p}</button>
                                    )}
                                </div>
                                <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} aria-label="다음 페이지">&#62;</button>
                            </div>
                        )}
                        {/* 페이지네이션 하단에 별도 페이지 이동 input 추가 (News와 동일) */}
                        {totalPages > 1 && (
                            <form
                                className="pagination-goto-form-bottom"
                                onSubmit={e => {
                                    e.preventDefault();
                                    const val = Number(gotoPageInput);
                                    if (!isNaN(val) && val >= 1 && val <= totalPages) {
                                        setPage(val);
                                    }
                                }}
                            >
                                <div className="pagination-goto-input-container">
                                    <input
                                        type="number"
                                        className="pagination-goto-input-bottom"
                                        min={1}
                                        max={totalPages}
                                        onChange={e => setGotoPageInput(e.target.value)}
                                        ref={gotoInputRef}
                                        placeholder="이동할 페이지 입력"
                                    />
                                    <button type="submit" className="pagination-goto-btn">이동</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
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
