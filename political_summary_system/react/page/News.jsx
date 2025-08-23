import React, { useEffect, useState, useRef } from 'react';
import '../style/News.css';
import { getNews } from '../auth/newsreq';

// 정당 홈페이지 바로가기 목록
const partyList = [
    { name: '더불어민주당', url: 'https://theminjoo.kr/main/' },
    { name: '국민의힘', url: 'https://www.peoplepowerparty.kr/' },
    { name: '개혁신당', url: 'https://rallypoint.kr/main' },
    { name: '진보당', url: 'https://jinboparty.com/main/' },
    { name: '조국혁신당', url: 'https://rebuildingkoreaparty.kr/' },
    { name: '기본소득당', url: 'https://www.basicincomeparty.kr/' },
    { name: '사회민주당', url: 'https://www.samindang.kr/' }
];

// 뉴스 페이지 컴포넌트
const News = () => {
    const [newsData, setNewsData] = useState([]); // 뉴스 데이터 상태
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
    const newsPerPage = 9; // 페이지당 뉴스 개수
    const PAGINATION_DELTA = 1; // 페이지네이션에서 현재 페이지 양옆에 표시할 페이지 수
    const [loading, setLoading] = useState(true); // 로딩 상태
    const gotoInputRef = useRef(); // 페이지 입력창 참조
    const [gotoPageInput, setGotoPageInput] = useState(String(1)); // 페이지 입력창 상태
    const [favorites, setFavorites] = useState([]); // 즐겨찾기 상태 추가

    // 컴포넌트 마운트 시 뉴스 데이터 가져오기
    useEffect(() => {
        setLoading(true);
        getNews(1).then(data => {
            setNewsData(data);
            setLoading(false);
        });
    }, []);

    // 현재 페이지 변경 시 입력창 상태 업데이트
    useEffect(() => {
        setGotoPageInput(String(currentPage));
    }, [currentPage]);

    // 현재 페이지에 표시할 뉴스 계산
    const indexOfLastNews = currentPage * newsPerPage;
    const indexOfFirstNews = indexOfLastNews - newsPerPage;
    const currentNews = newsData.slice(indexOfFirstNews, indexOfLastNews);
    const totalPages = Math.ceil(newsData.length / newsPerPage);

    // 페이지 버튼 클릭 핸들러
    const handleClick = (pageNum) => {
        setCurrentPage(pageNum);
        setGotoPageInput(String(pageNum));
        if (gotoInputRef.current) gotoInputRef.current.value = '';
    };

    // 정당 홈페이지 이동 핸들러
    const handlePartyClick = (url) => {
        window.open(url, '_blank');
    };

    // 뉴스 카드 클릭 핸들러
    const handleNewsClick = (url) => {
        window.open(url, '_blank');
    };

    // 뉴스 메타 정보 생성
    const getMeta = (idx) => {
        const date = `2025-08-${String((idx % 28) + 1).padStart(2, '0')}`;
        const source = ['연합뉴스', 'KBS', 'MBC', 'SBS', 'JTBC', '한겨레', '조선일보'][idx % 7];
        const category = ['정치', '국회', '선거', '정책', '사회'][idx % 5];
        return { date, source, category };
    };

    // 페이지네이션 표시 범위 계산
    function getPageList(current, total) {
        const delta = PAGINATION_DELTA;
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
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l > 2) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }
        return rangeWithDots;
    }

    // 페이지네이션 데이터 분리
    const pageList = getPageList(currentPage, totalPages);
    const currentIndexInList = pageList.findIndex(p => p === currentPage);
    const leftList = currentIndexInList > -1 ? pageList.slice(0, currentIndexInList) : pageList;
    const rightList = currentIndexInList > -1 ? pageList.slice(currentIndexInList + 1) : [];

    const toggleFavorite = (newsId) => {
        setFavorites((prevFavorites) => {
            if (prevFavorites.includes(newsId)) {
                return prevFavorites.filter((id) => id !== newsId);
            } else {
                return [...prevFavorites, newsId];
            }
        });
    };

    return (
        <div className="news-page">
            <div className="bg-con news-main-bg">
                <div className="news-layout">
                    <div className="news-main-content">
                        {loading ? (
                            <div className="loading-container">
                                <div className="loading-spinner" />
                            </div>
                        ) : currentNews.length === 0 ? (
                            <div className="no-news">
                                <h3>정치 뉴스가 없습니다</h3>
                                <p>잠시 후 다시 시도해 주세요.</p>
                            </div>
                        ) : (
                            <div className="news-grid">
                                {currentNews.map((news, idx) => {
                                    const meta = getMeta(idx + indexOfFirstNews);
                                    const isFavorite = favorites.includes(news.id);
                                    return (
                                        <div
                                            className="news-card"
                                            key={idx}
                                            onClick={() => handleNewsClick(news.link || news.url)}
                                        >
                                            <div className="news-content">
                                                <div className="news-card-header">
                                                    <h4 className="news-title">{news.title}</h4>
                                                    <span className="news-meta-date">{meta.date}</span>
                                                    <button
                                                        className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // 부모 클릭 이벤트 방지
                                                            toggleFavorite(news.id);
                                                        }}
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
                        {totalPages > 1 && !loading && (
                            <div className="pagination">
                                <button
                                    onClick={() => handleClick(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    aria-label="이전 페이지"
                                >
                                    &#60;
                                </button>
                                <div className="pagination-left">
                                    {leftList.map((page, idx) => (
                                        page === '...' ? (
                                            <span key={'l-'+idx} className="pagination-ellipsis">...</span>
                                        ) : (
                                            <button key={'l-'+page} onClick={() => handleClick(page)}>
                                                {page}
                                            </button>
                                        )
                                    ))}
                                </div>
                                <div className="pagination-center">
                                    <input
                                        type="number"
                                        className="pagination-goto-input pagination-current-input"
                                        min={1}
                                        max={totalPages}
                                        value={gotoPageInput}
                                        ref={gotoInputRef}
                                        onChange={(e) => {
                                            const raw = e.target.value;
                                            setGotoPageInput(raw);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                const val = Number(e.target.value);
                                                if (!isNaN(val) && val >= 1 && val <= totalPages) {
                                                    handleClick(val);
                                                } else {
                                                    setGotoPageInput(String(currentPage));
                                                }
                                            }
                                        }}
                                        onBlur={() => setGotoPageInput(String(currentPage))}
                                        onFocus={(e) => e.target.select()}
                                        aria-label="현재 페이지 입력"
                                    />
                                </div>
                                <div className="pagination-right">
                                    {rightList.map((page, idx) => (
                                        page === '...' ? (
                                            <span key={'r-'+idx} className="pagination-ellipsis">...</span>
                                        ) : (
                                            <button key={'r-'+page} onClick={() => handleClick(page)}>
                                                {page}
                                            </button>
                                        )
                                    ))}
                                </div>
                                <button
                                    onClick={() => handleClick(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    aria-label="다음 페이지"
                                >
                                    &#62;
                                </button>
                            </div>
                        )}
                        <div className="party-bottombar">
                            <div className="party-bottombar-title">정당 공식 홈페이지 바로가기</div>
                            <hr className='party-bottombar-divider' />
                            <div className="party-simple-list party-row-list">
                                {partyList.map((party, idx) => (
                                    <button
                                        key={idx}
                                        className="party-simple-btn"
                                        onClick={() => handlePartyClick(party.url)}
                                        title={party.name}
                                    >
                                        {party.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default News;
