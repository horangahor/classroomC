import React, { useEffect, useState } from 'react';
import '../style/News.css';
import '../style/Favorites.css';
import { getNews } from '../auth/newsreq';

/* Favorites.jsx - 즐겨찾기 페이지: News 카드 스타일을 재사용하여 즐겨찾기 목록을 렌더링합니다. */

const Favorites = () => {
    const [newsData, setNewsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        setLoading(true);
        getNews(1).then(data => {
            setNewsData(data || []);
            setLoading(false);
        }).catch(() => { setLoading(false); });
    }, []);

    useEffect(() => {
        const stored = localStorage.getItem('favorites');
        if (stored) {
            try {
                setFavorites(JSON.parse(stored));
            } catch (e) {
                setFavorites([]);
            }
        }
    }, []);

    const toggleFavorite = (newsId) => {
        setFavorites(prev => {
            const updated = prev.includes(newsId) ? prev.filter(id => id !== newsId) : [...prev, newsId];
            localStorage.setItem('favorites', JSON.stringify(updated));
            return updated;
        });
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
