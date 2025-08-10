import React, { useEffect, useState } from 'react';
import '../style/News.css';
import { getNews } from '../auth/newsreq';

// 예시 뉴스 데이터

// getNews와 page 번호 아래 useState currentPage를 인수로 주면 해당페이지 1 ~ 9 , 10 ~ 18 이런식으로 불러옴
// const newsList = getNews(1);
// console.log(newsList);



// const newsData = [
//     {
//         title: '정치 뉴스 제목 1',
//         summary: '요약된 뉴스 내용입니다.',
//         imageUrl: 'https://via.placeholder.com/150',
//         link: 'https://www.google.com/'
//     },
//     {
//         title: '정치 뉴스 제목 2',
//         summary: '요약된 뉴스 내용입니다.',
//         imageUrl: 'https://via.placeholder.com/150',
//         link: 'https://www.google.com/'
//     },
//     {
//         title: '정치 뉴스 제목 3',
//         summary: '요약된 뉴스 내용입니다. 더 긴 요약 내용으로 테스트해보겠습니다.',
//         imageUrl: 'https://via.placeholder.com/150',
//         link: 'https://www.google.com/'
//     },
//     {
//         title: '정치 뉴스 제목 4',
//         summary: '요약된 뉴스 내용입니다.',
//         imageUrl: 'https://via.placeholder.com/150',
//         link: 'https://www.google.com/'
//     },
//     {
//         title: '정치 뉴스 제목 5',
//         summary: '요약된 뉴스 내용입니다.',
//         imageUrl: 'https://via.placeholder.com/150',
//         link: 'https://www.google.com/'
//     },
//     {
//         title: '정치 뉴스 제목 6',
//         summary: '요약된 뉴스 내용입니다.',
//         imageUrl: 'https://via.placeholder.com/150',
//         link: 'https://www.google.com/'
//     },
//     {
//         title: '정치 뉴스 제목 7',
//         summary: '요약된 뉴스 내용입니다.',
//         imageUrl: 'https://via.placeholder.com/150',
//         link: 'https://www.google.com/'
//     },
//     {
//         title: '정치 뉴스 제목 8',
//         summary: '요약된 뉴스 내용입니다.',
//         imageUrl: 'https://via.placeholder.com/150',
//         link: 'https://www.google.com/'
//     },
//     {
//         title: '정치 뉴스 제목 9',
//         summary: '요약된 뉴스 내용입니다.',
//         imageUrl: 'https://via.placeholder.com/150',
//         link: 'https://www.google.com/'
//     },
//     {
//         title: '정치 뉴스 제목 10',
//         summary: '요약된 뉴스 내용입니다.',
//         imageUrl: 'https://via.placeholder.com/150',
//         link: 'https://www.google.com/'
//     },
//     {
//         title: '정치 뉴스 제목 11',
//         summary: '요약된 뉴스 내용입니다.',
//         imageUrl: 'https://via.placeholder.com/150',
//         link: 'https://www.google.com/'
//     },
//     {
//         title: '정치 뉴스 제목 12',
//         summary: '요약된 뉴스 내용입니다.',
//         imageUrl: 'https://via.placeholder.com/150',
//         link: 'https://www.google.com/'
//     }
// ];


// 정당 정보 (간단하게)
const partyList = [
    { name: '더불어민주당', url: 'https://theminjoo.kr/main/' },
    { name: '국민의힘', url: 'https://www.peoplepowerparty.kr/' },
    { name: '개혁신당', url: 'https://rallypoint.kr/main' },
    { name: '진보당', url: 'https://jinboparty.com/main/' },
    { name: '조국혁신당', url: 'https://rebuildingkoreaparty.kr/' },
    { name: '기본소득당', url: 'https://www.basicincomeparty.kr/' },
    { name: '사회민주당', url: 'https://www.samindang.kr/' }
];

const News = () => {
    const [newsData, setNewsData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const newsPerPage = 9;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getNews(1).then(data => {
            setNewsData(data);
            setLoading(false);
        });
    }, []);

    // 현재 페이지에서 보여줄 뉴스 계산
    const indexOfLastNews = currentPage * newsPerPage;
    const indexOfFirstNews = indexOfLastNews - newsPerPage;
    const currentNews = newsData.slice(indexOfFirstNews, indexOfLastNews);
    const totalPages = Math.ceil(newsData.length / newsPerPage);

    // 페이지 버튼 클릭
    const handleClick = (pageNum) => setCurrentPage(pageNum);

    // 정당 공식 홈페이지 이동
    const handlePartyClick = (url) => {
        window.open(url, '_blank');
    };

    // 뉴스 카드 클릭
    const handleNewsClick = (url) => {
        window.open(url, '_blank');
    };

    // 더미 메타 정보 생성
    const getMeta = (idx) => {
        const date = `2025-08-${String((idx%28)+1).padStart(2,'0')}`;
        const source = ['연합뉴스','KBS','MBC','SBS','JTBC','한겨레','조선일보'][idx%7];
        const category = ['정치','국회','선거','정책','사회'][idx%5];
        return { date, source, category };
    };

    // 페이지네이션 축약 로직
    function getPageList(current, total) {
        const delta = 2; // 현재페이지 양옆 몇 개 보여줄지
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

    return (
        <div className="news-page">
            <h1 className='news-h1'>주요 정치 이슈 정리</h1>
            <div className="news-layout">
                {/* 메인 콘텐츠 영역 - 뉴스 카드들 */}
                <div className="news-main-content">
                    {/* 로딩/빈 상태 안내 */}
                    {loading ? (
                        <div className="loading-container" style={{minHeight:200}}>
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
                            const meta = getMeta(idx+indexOfFirstNews);
                            return (
                                <div 
                                    className="news-card" 
                                    key={idx}
                                    onClick={() => handleNewsClick(news.link)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {/* 좌측: 제목/요약/메타 */}
                                    <div className="news-content">
                                        <div className="news-meta">
                                            <span className="news-meta-date">{meta.date}</span>
                                            <span className="news-meta-source">{meta.source}</span>
                                            <span className="news-meta-category">{meta.category}</span>
                                        </div>
                                        <h4 className="news-title">{news.title}</h4>
                                        <p className="news-summary">{news.summary}</p>
                                    </div>
                                    {/* 우측: 이미지 */}
                                    <div className="news-image">
                                        <img src={news.imageUrl} alt="뉴스 썸네일" />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    )}
                    {/* 페이지네이션 */}
                    {totalPages > 1 && !loading && (
                        <div className="pagination">
                            {currentPage > 1 && (
                                <button
                                    onClick={() => handleClick(currentPage - 1)}
                                    aria-label="이전 페이지"
                                >
                                    &#60;
                                </button>
                            )}
                            {getPageList(currentPage, totalPages).map((page, idx) =>
                                page === '...' ? (
                                    <span key={idx} className="pagination-ellipsis">...</span>
                                ) : (
                                    <button
                                        key={idx}
                                        onClick={() => handleClick(page)}
                                        className={currentPage === page ? 'active' : ''}
                                    >
                                        {page}
                                    </button>
                                )
                            )}
                            {currentPage < totalPages && (
                                <button
                                    onClick={() => handleClick(currentPage + 1)}
                                    aria-label="다음 페이지"
                                >
                                    &#62;
                                </button>
                            )}
                        </div>
                    )}
                </div>
                {/* 우측 사이드바 - 정당 목록(아이콘 없이 텍스트만) */}
                <div className="party-sidebar">
                    <h3 className="sidebar-title">정당 목록</h3>
                    <div className="party-simple-list">
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
    );
};

export default News;
