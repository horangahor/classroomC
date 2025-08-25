import React, { useEffect, useState } from 'react';
import '../style/Favorites.css';

/* Favorites.jsx - 즐겨찾기 페이지: News 카드 스타일을 재사용하여 즐겨찾기 목록을 렌더링합니다. */

const Favorites = () => {
    const [newsData, setNewsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);

    // DB 기반 즐겨찾기 로드 (News의 페이징 로직 재사용)
    useEffect(() => {
        const loadFavoritesFromDB = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/users/me/favorites', { credentials: 'include' });

                // 상태 확인 및 Content-Type 방어 처리
                if (!res.ok) {
                    const text = await res.text().catch(() => '');
                    console.error('Favorites fetch failed', res.status, text);
                    if (res.status === 401) {
                        // 인증 만료/미인증: 안전하게 빈 목록 처리
                        setFavorites([]);
                        setNewsData([]);
                        setLoading(false);
                        return;
                    }
                    throw new Error(`Favorites fetch failed (${res.status})`);
                }

                const contentType = (res.headers.get('content-type') || '').toLowerCase();
                let data;
                if (contentType.includes('application/json')) {
                    data = await res.json();
                } else {
                    const text = await res.text().catch(() => '');
                    console.error('Favorites: expected JSON but got:', text.slice(0, 100));
                    // HTML 로그인 페이지가 반환되는 경우가 많으므로 안전하게 빈 목록 처리
                    if (text.toLowerCase().includes('<!doctype') || text.toLowerCase().includes('<html')) {
                        setFavorites([]);
                        setNewsData([]);
                        setLoading(false);
                        return;
                    }
                    throw new Error('서버가 JSON이 아닌 응답을 반환했습니다');
                }

                // 서버가 뉴스 객체 배열을 반환한 경우엔 바로 사용
                let favIds = [];
                if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && data[0].news_identifier) {
                    const favNews = data;
                    favIds = favNews.map(d => d.news_identifier);
                    setFavorites(favIds);
                    setNewsData(favNews);
                    setLoading(false);
                    return;
                }

                // 서버가 ID 배열을 반환한다고 가정하고, existing News 페이징 로직으로 상세 뉴스 수집
                favIds = Array.isArray(data) ? data : [];
                setFavorites(favIds);

                if (!favIds || favIds.length === 0) {
                    setNewsData([]);
                    setLoading(false);
                    return;
                }

                try {
                    // ID 배열이 있을 때 병렬(청크)로 상세를 조회
                    const fetchDetailsChunked = async (ids, chunkSize = 8) => {
                        const results = [];
                        for (let i = 0; i < ids.length; i += chunkSize) {
                            const chunk = ids.slice(i, i + chunkSize);
                            const fetched = await Promise.all(chunk.map(id =>
                                fetch(`/api/news/${encodeURIComponent(id)}`, { credentials: 'include' })
                                    .then(r => r.ok ? r.json() : null)
                                    .catch(() => null)
                            ));
                            results.push(...fetched.filter(Boolean));
                        }
                        return results;
                    };

                    const favNews = await fetchDetailsChunked(favIds, 8);
                    setNewsData(favNews);
                } catch (e) {
                    console.error('즐겨찾기 상세 불러오기 실패', e);
                    setNewsData([]);
                }
            } catch (err) {
                console.error('즐겨찾기 로드 실패', err);
                setFavorites([]);
                setNewsData([]);
            } finally {
                setLoading(false);
            }
        };

        loadFavoritesFromDB();
    }, []);

    // 즐겨찾기 토글: 낙관적 UI 적용 후 DB에 동기화 (POST / DELETE)
    const toggleFavorite = async (newsId) => {
        const isFav = favorites.includes(newsId);

        // 낙관적 업데이트
        if (isFav) {
            setFavorites(prev => prev.filter(id => id !== newsId));
            setNewsData(prevNews => prevNews.filter(n => n.news_identifier !== newsId));
        } else {
            setFavorites(prev => [...prev, newsId]);
            // 가능한 경우 서버에서 상세를 받아와 UI에 추가
            try {
                const res = await fetch(`/api/news/${encodeURIComponent(newsId)}`, { credentials: 'include' });
                if (res.ok) {
                    const detail = await res.json();
                    setNewsData(prev => [detail, ...prev]);
                }
            } catch (e) {
                console.warn('즐겨찾기 추가시 뉴스 상세 로드 실패', e);
            }
        }

        // DB 동기화
        try {
            const url = '/api/users/me/favorites';
            await fetch(url, {
                method: isFav ? 'DELETE' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ newsId })
            });
        } catch (e) {
            console.error('즐겨찾기 업데이트 실패, UI를 되돌립니다', e);
            // 실패 시 간단 복원 (re-fetch 권장)
            try {
                const res = await fetch('/api/users/me/favorites', { credentials: 'include' });
                if (res.ok) {
                    const re = await res.json();
                    const reIds = Array.isArray(re) && re.length > 0 && typeof re[0] === 'object' && re[0].news_identifier ? re.map(d=>d.news_identifier) : re;
                    setFavorites(reIds || []);
                }
            } catch (e2) {
                console.warn('복원 시도 실패', e2);
            }
        }
    };

    const handleNewsClick = (url) => {
        window.open(url, '_blank');
    };

    const getMeta = (idx) => {
        const date = `2025-08-${String((idx % 28) + 1).padStart(2, '0')}`;
        const source = ['연합뉴스', 'KBS', 'MBC', 'SBS', 'JTBC', '한겨레', '조선일보'][idx % 7];
        const category = ['정치', '국회', '선거', '정책', '사회'][idx % 5];
        return { date, source, category };
    };

    const favoriteNews = newsData.filter(n => favorites.includes(n.news_identifier));

    return (
        <div className="news-page favorites-page">
            <div className="bg-con news-main-bg">
                <div className="news-layout">
                    <div className="news-main-content">
                        <h1 className="news-h1">즐겨찾기</h1>

                        {loading ? (
                            <div className="loading-container"><div className="loading-spinner" /></div>
                        ) : favoriteNews.length === 0 ? (
                            <div className="no-news">
                                <h3>즐겨찾기가 없습니다</h3>
                                <p>뉴스 목록에서 별표(☆)를 눌러 즐겨찾기에 추가하세요.</p>
                            </div>
                        ) : (
                            <div className="news-grid">
                                {favoriteNews.map((news, idx) => {
                                    const meta = getMeta(idx);
                                    const isFavorite = favorites.includes(news.news_identifier);
                                    return (
                                        <div
                                            className="news-card"
                                            key={news.news_identifier}
                                            onClick={() => handleNewsClick(news.url)}
                                        >
                                            <div className="news-content">
                                                <div className="news-card-header">
                                                    <h4 className="news-title">{news.title}</h4>
                                                    <span className="news-meta-date">{meta.date}</span>
                                                    <button
                                                        className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                                                        onClick={(e) => { e.stopPropagation(); toggleFavorite(news.news_identifier); }}
                                                        aria-label="즐겨찾기"
                                                    >
                                                        {isFavorite ? '★' : '☆'}
                                                    </button>
                                                </div>

                                                <div className="news-card-body">
                                                    <p className="news-summary">{news.summary}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Favorites;
