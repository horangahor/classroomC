/**
 * News.jsx - 뉴스 리스트/카드 페이지
 * 지역별 뉴스, 뉴스 카드, 링크 등 UI 담당
 */

import React, { useEffect, useState, useRef } from 'react';
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
    // reduce how many page numbers appear around the current page for a more compact pagination
    const PAGINATION_DELTA = 1; // change this to 0/1/2 to adjust visible neighbors
    const [loading, setLoading] = useState(true);
    const gotoInputRef = useRef();
    // controlled input shown in place of the current page number
    const [gotoPageInput, setGotoPageInput] = useState(String(1));

    useEffect(() => {
        setLoading(true);
        getNews(1).then(data => {
            console.log('[getNews 결과]', data); // 데이터 구조 확인용
            setNewsData(data);
            setLoading(false);
        });
    }, []);

    // keep the visible input in sync with currentPage
    useEffect(() => {
        setGotoPageInput(String(currentPage));
    }, [currentPage]);

    // 현재 페이지에서 보여줄 뉴스 계산
    const indexOfLastNews = currentPage * newsPerPage;
    const indexOfFirstNews = indexOfLastNews - newsPerPage;
    const currentNews = newsData.slice(indexOfFirstNews, indexOfLastNews);
    const totalPages = Math.ceil(newsData.length / newsPerPage);

    // 페이지 버튼 클릭
    const handleClick = (pageNum) => {
        setCurrentPage(pageNum);
        // update the controlled input shown at current page location
        setGotoPageInput(String(pageNum));
        if (gotoInputRef.current) gotoInputRef.current.value = '';
    };

    // 정당 공식 홈페이지 이동
    const handlePartyClick = (url) => {
        window.open(url, '_blank');
    };

    // 뉴스 카드 클릭
    const handleNewsClick = (url) => {
        console.log('[뉴스 카드 클릭] url:', url);
        window.open(url, '_blank');
    };

    // 더미 메타 정보 생성
    const getMeta = (idx) => {
        const date = `2025-08-${String((idx % 28) + 1).padStart(2, '0')}`;
        const source = ['연합뉴스', 'KBS', 'MBC', 'SBS', 'JTBC', '한겨레', '조선일보'][idx % 7];
        const category = ['정치', '국회', '선거', '정책', '사회'][idx % 5];
        return { date, source, category };
    };

    // 페이지네이션 축약 로직
    function getPageList(current, total) {
        const delta = PAGINATION_DELTA; // 현재페이지 양옆 몇 개 보여줄지 (configurable above)
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

    // 새 페이지네이션: 중앙 입력창 고정을 위해 좌/중앙/우 리스트를 미리 계산
    const pageList = getPageList(currentPage, totalPages);
    const currentIndexInList = pageList.findIndex(p => p === currentPage);
    const leftList = currentIndexInList > -1 ? pageList.slice(0, currentIndexInList) : pageList;
    const rightList = currentIndexInList > -1 ? pageList.slice(currentIndexInList + 1) : [];

    return (
        <div className="news-page">
            <div className="bg-con news-main-bg">
                {/* 뉴스 카드/페이지네이션 영역 */}
                <div className="news-layout">
                    <div className="news-main-content">
                        {/* 로딩/빈 상태 안내 */}
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
                                    return (
                                        <div
                                            className="news-card"
                                            key={idx}
                                            onClick={() => handleNewsClick(news.link || news.url)}
                                        >
                                            {/* 카드 레이아웃: 상단 헤더(타이틀 좌측, 날짜 우측) + 본문(요약) */}
                                            <div className="news-content">
                                                <div className="news-card-header">
                                                    <h4 className="news-title">{news.title}</h4>
                                                    <span className="news-meta-date">{meta.date}</span>
                                                </div>
                                                <div className="news-card-body">
                                                    <p className="news-summary">{news.summary}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                        {/* 페이지네이션 */}
                        {totalPages > 1 && !loading && (
                            <div className="pagination">
                                <button
                                    onClick={() => handleClick(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    aria-label="이전 페이지"
                                >
                                    &#60;
                                </button>

                                {/* 왼쪽 페이지 그룹 (현재 페이지 이전 항목) */}
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

                                {/* 중앙 고정 영역: 현재 페이지 입력창 */}
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

                                {/* 오른쪽 페이지 그룹 (현재 페이지 이후 항목) */}
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
                        {/* 정당 홈페이지 바로가기 영역 복구 */}
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
