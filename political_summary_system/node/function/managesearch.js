import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SearchComponent() {
    const [inputValue, setInputValue] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [searchData, setSearchData] = useState({
        loading: false,
        error: null,
        results: [],
        total: 0,
    });
    const limit = 10; // 페이지 당 게시물 수

    useEffect(() => {
        // searchTerm이 비어있으면 API를 호출하지 않음
        if (!searchTerm) return;

        const fetchResults = async () => {
            // 로딩 시작 상태로 업데이트
            setSearchData(prev => ({ ...prev, loading: true, error: null }));
            
            try {
                const params = { query: searchTerm, page, limit };
                const response = await axios.get('http://localhost:8000/api/search', { params });
                // 성공 시 데이터 업데이트
                setSearchData({
                    loading: false,
                    error: null,
                    results: response.data.results,
                    total: response.data.total,
                });
            } catch (err) {
                // 에러 발생 시 상태 업데이트
                setSearchData(prev => ({ 
                    ...prev, 
                    loading: false, 
                    error: '데이터를 불러오는 중 오류가 발생했습니다.' 
                }));
            }
        };

        fetchResults();
    }, [searchTerm, page]); // searchTerm 또는 page가 변경될 때마다 실행

    // 검색 버튼 클릭 핸들러
    const handleSearch = () => {
        setPage(1); // 새 검색은 1페이지부터
        setSearchTerm(inputValue);
    };

    // 렌더링 로직
    const { loading, error, results, total } = searchData;
    const totalPages = Math.ceil(total / limit);

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>게시물 검색</h1>
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="검색어를 입력하세요"
                    style={{ padding: '8px', marginRight: '8px', width: '300px' }}
                />
                <button onClick={handleSearch} style={{ padding: '8px 12px' }}>검색</button>
            </div>

            {loading && <p>검색 중...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            {/* 검색을 시작했고, 로딩/에러가 아닐 때만 결과 표시 */}
            {searchTerm && !loading && !error && (
                <div>
                    {results.length > 0 ? (
                        <>
                            <p>총 {total}개의 검색 결과</p>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {results.map((post) => (
                                    <li key={post.PostId} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                                        <h3>{post.Title}</h3>
                                        <p>작성자: {post.Author}</p>
                                    </li>
                                ))}
                            </ul>
                            {/* 페이지네이션 */}
                            <div style={{ marginTop: '20px' }}>
                                <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>이전</button>
                                <span style={{ margin: '0 10px' }}> {page} / {totalPages} </span>
                                <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>다음</button>
                            </div>
                        </>
                    ) : (
                        <p>검색 결과가 없습니다.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchComponent;
