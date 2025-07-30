import React, { useState } from 'react';
import '../style/News.css'; // 스타일 파일 불러오기

// 예시 뉴스 데이터 (나중엔 서버에서 받아올 수 있음)
const newsData = [
    {
        title: '정치 뉴스 제목 1',
        summary: '요약된 뉴스 내용입니다.',
        imageUrl: 'https://via.placeholder.com/150',
        link: 'https://www.google.com/'
    },
    {
        title: '정치 뉴스 제목 2',
        summary: '요약된 뉴스 내용입니다.',
        imageUrl: 'https://via.placeholder.com/150',
        link: 'https://www.google.com/'
    },
    
    // ... 더 많은 뉴스들이 여기에 들어감
];

const News = () => {
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 관리
    const newsPerPage = 6; // 한 페이지에 보여줄 뉴스 개수

    // 현재 페이지에서 보여줄 뉴스의 시작과 끝 인덱스 계산
    const indexOfLastNews = currentPage * newsPerPage;
    const indexOfFirstNews = indexOfLastNews - newsPerPage;
    const currentNews = newsData.slice(indexOfFirstNews, indexOfLastNews); // 현재 페이지 뉴스 배열

    const totalPages = Math.ceil(newsData.length / newsPerPage); // 전체 페이지 수 계산

    // 페이지 버튼 클릭 시 페이지 번호 변경
    const handleClick = (pageNum) => setCurrentPage(pageNum);

    // 정당별 버튼 클릭 시 해당 정당 공식 홈페이지 새 탭으로 열기
    const handlePartyClick = (url) => {
        window.open(url, '_blank');
    };

    return (
        <div className='news-container'>
            <h2 className='news-container h2'>주요 정치 이슈 정리</h2>
            <div className="news-grid-wrapper">
                {/* 뉴스 카드 리스트 */}
                <div className="news-grid">
                    {currentNews.map((news, idx) => (
                        <div className="news-card" key={idx}>
                            <img src={news.imageUrl} alt="썸네일" />
                            <h4>{news.title}</h4>
                            <p>{news.summary}</p>

                            {/* 더보기 클릭 시 기사 원문 링크로 이동 */}
                            <button onClick={() => window.open(news.link, '_blank')}>
                                더보기
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            {/* 페이지네이션 */}
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => handleClick(i + 1)}
                        style={{ fontWeight: currentPage === i + 1 ? 'bold' : 'normal' }}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            {/* 정당 버튼: 클릭하면 해당 정당 공식 홈페이지로 이동 */}
            <div className="party-buttons">
                <button onClick={() => handlePartyClick('https://theminjoo.kr/main/')}>
                    더불어민주당
                </button>
                <button onClick={() => handlePartyClick('https://www.peoplepowerparty.kr/')}>
                    국민의힘
                </button>
                <button onClick={() => handlePartyClick('https://rallypoint.kr/main')}>
                    개혁신당
                </button>
                <button onClick={() => handlePartyClick('https://jinboparty.com/main/')}>
                    진보당
                </button>
                 <button onClick={() => handlePartyClick('https://rebuildingkoreaparty.kr/')}>
                    조국혁신당
                </button>
                 <button onClick={() => handlePartyClick('https://www.basicincomeparty.kr/')}>
                    기본소득당
                </button>
                 <button onClick={() => handlePartyClick('https://www.samindang.kr/')}>
                    사회민주당
                </button>
            </div>
        </div>
    );
};

export default News;
