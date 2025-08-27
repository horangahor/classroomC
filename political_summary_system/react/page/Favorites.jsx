import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import '../style/Favorites.css';
import { getSession } from '../auth/auth';
import { FavoritesContext } from '../contexts/FavoritesContext';

const Favorites = () => {
    const [favoriteNews, setFavoriteNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { favorites, setFavorites } = useContext(FavoritesContext);

    const fetchFavoriteNews = async () => {
        setLoading(true);
        setError(null);
        try {
            const userRes = await axios.get('http://localhost:8000/favorites', { withCredentials: true });
            if (userRes.data && userRes.data.errorCode) {
                throw new Error(userRes.data.message || '즐겨찾기 조회 실패');
            }
            if (Array.isArray(userRes.data)) {
                setFavoriteNews(userRes.data);
                setFavorites(userRes.data.map(n => n.news_identifier));
            } else if (userRes.data && userRes.data.success && userRes.data.data) {
                setFavoriteNews(userRes.data.data);
                setFavorites(userRes.data.data.map(n => n.news_identifier));
            } else {
                setFavoriteNews([]);
                setFavorites([]);
            }
        } catch (e) {
            setError('즐겨찾기 뉴스 불러오기 실패');
            setFavoriteNews([]);
            setFavorites([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavoriteNews();
    }, []);

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
                // 즐겨찾기 변경 후 목록 새로고침
                fetchFavoriteNews();
            })
            .catch((err) => {
                console.error(err);
            });
    };

    // 페이지네이션 관련 상태 및 계산
    const newsPerPage = 9;
    const [currentPage, setCurrentPage] = useState(1);
    const [gotoPageInput, setGotoPageInput] = useState('1');
    const gotoInputRef = React.useRef();
    const totalPages = Math.max(1, Math.ceil(favoriteNews.length / newsPerPage));
    const indexOfLastNews = currentPage * newsPerPage;
    const indexOfFirstNews = indexOfLastNews - newsPerPage;
    const currentNews = favoriteNews.slice(indexOfFirstNews, indexOfLastNews);

    // 페이지네이션 표시 범위 계산 (News와 동일)
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
    const pageList = getPageList(currentPage, totalPages);
    const currentIndexInList = pageList.findIndex(p => p === currentPage);
    const leftList = currentIndexInList > -1 ? pageList.slice(0, currentIndexInList) : pageList;
    const rightList = currentIndexInList > -1 ? pageList.slice(currentIndexInList + 1) : [];

    // 페이지 이동 핸들러
    const handleClick = (pageNum) => {
        setCurrentPage(pageNum);
        setGotoPageInput(String(pageNum));
        if (gotoInputRef.current) gotoInputRef.current.value = '';
    };

    return (
        <div className="news-page favorites-page">
            <div className="bg-con news-main-bg">
                <div className="news-layout">
                    <div className="news-main-content">
                        <h2 className="news-h1 favorites-title">내 즐겨찾기 뉴스</h2>
                        {loading ? (
                            <div className="no-news favorites-none">로딩 중...</div>
                        ) : error ? (
                            <div className="no-news favorites-none">{error}</div>
                        ) : favoriteNews.length === 0 ? (
                            <div className="no-news favorites-none">즐겨찾기한 뉴스가 없습니다.</div>
                        ) : (
                            <>
                            <div className="news-grid">
                                {currentNews.map(news => (
                                    <div className="news-card" key={news.news_identifier}>
                                        <a href={news.url} target="_blank" rel="noopener noreferrer" className="news-link">
                                            <button
                                                className={`favorite-btn${favorites.includes(news.news_identifier) ? ' active' : ''}`}
                                                aria-label="즐겨찾기"
                                                style={{position:'absolute',top:16,right:16}}
                                                onClick={e => { e.preventDefault(); e.stopPropagation(); toggleFavorite(news.news_identifier); }}
                                            >★</button>
                                            <div className="news-content">
                                                <h4 className="news-title">{news.title}</h4>
                                                <div className="news-card-body">
                                                    <p className="news-summary">{news.summary}</p>
                                                </div>
                                                <span className="news-meta-date">{news.date}</span>
                                            </div>
                                        </a>
                                    </div>
                                ))}
                            </div>
                            {/* 페이지네이션 */}
                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button onClick={() => handleClick(Math.max(1, currentPage - 1))} disabled={currentPage === 1} aria-label="이전 페이지">&#60;</button>
                                    <div className="pagination-left">
                                        {leftList.map((page, idx) => (
                                            page === '...'
                                                ? <span key={'l-'+idx} className="pagination-ellipsis">...</span>
                                                : <button key={'l-'+page} onClick={() => handleClick(page)}>{page}</button>
                                        ))}
                                    </div>
                                    <div className="pagination-center">
                                        <button className="pagination-current-btn" disabled>{currentPage}</button>
                                    </div>
                                    <div className="pagination-right">
                                        {rightList.map((page, idx) => (
                                            page === '...'
                                                ? <span key={'r-'+idx} className="pagination-ellipsis">...</span>
                                                : <button key={'r-'+page} onClick={() => handleClick(page)}>{page}</button>
                                        ))}
                                    </div>
                                    <button onClick={() => handleClick(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} aria-label="다음 페이지">&#62;</button>
                                </div>
                            )}
                            {/* 페이지네이션 하단에 별도 페이지 이동 input 추가 */}
                            {totalPages > 1 && (
                                <form
                                    className="pagination-goto-form-bottom"
                                    onSubmit={e => {
                                        e.preventDefault();
                                        const val = Number(gotoPageInput);
                                        if (!isNaN(val) && val >= 1 && val <= totalPages) {
                                            handleClick(val);
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
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Favorites;
