import React, { useRef, useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { ReactComponent as KrMap } from '../assets/kr.svg'
import { useNavigate } from 'react-router-dom'
import '../style/MainPage.css'

/**
 * MainPage 컴포넌트
 * - 대한민국 지도 SVG를 클릭하여 지역별 정치인/뉴스 정보를 보여주는 메인 페이지
 * - 좌측: 선택 지역의 정치인 카드 및 지역별 뉴스 리스트
 * - 우측: SVG 지도 (클릭 시 지역 선택)
 * - 지역명, 인물, 뉴스 등은 백엔드에서 fetch하여 동적으로 연동
 * - 지역별 매핑, 예외 처리, 상태관리, 스타일 일원화 등 UI/UX 개선
 */
const MainPage = () => {
  const svgRef = useRef(null)
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [people, setPeople] = useState([])
  const [news, setNews] = useState([])
  const navigate = useNavigate()

  // 전체 인물 데이터 fetch (백엔드 연동)
  const [allMembers, setAllMembers] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
    axios.get('http://localhost:8000/members')
      .then(res => setAllMembers(res.data))
      .catch(err => console.error('멤버 데이터 fetch 실패', err))
      .finally(() => setLoading(false))
  }, [])

  // 전체 뉴스 데이터 fetch (백엔드 연동)
  useEffect(() => {
    axios.get('http://localhost:8000/getNews')
      .then(res => setNews(res.data))
      .catch(err => console.error('뉴스 데이터 fetch 실패', err))
  }, [])

  // 지도 SVG path에 클릭 이벤트 등록 (지역 선택)
  useEffect(() => {
    if (svgRef.current) {
      const paths = svgRef.current.querySelectorAll('path')
      paths.forEach((path, index) => {
        const regionId = path.id ||
          path.getAttribute('data-name') ||
          path.className.baseVal ||
          `region-${index}`
        path.classList.add('region-path')
        const handleClick = (e) => {
          e.stopPropagation()
          handleRegionClick(regionId, path)
        }
        path.addEventListener('click', handleClick)
        path._listeners = { handleClick }
      })
      return () => {
        paths.forEach(path => {
          if (path._listeners) {
            path.removeEventListener('click', path._listeners.handleClick)
          }
        })
      }
    }
  }, [])

  // 최신 handleRegionAction을 참조하기 위한 ref
  const handleRegionActionRef = useRef();

  /**
   * handleRegionAction(regionId)
   * - 지역 ID를 받아 해당 지역의 정치인 리스트를 allMembers에서 필터링
   * - 지역명 매핑 및 예외 처리 포함
   */
  const handleRegionAction = useCallback((regionId) => {
    // 더 포괄적인 키 매핑 (SVG의 실제 ID와 매칭 - kr.svg 파일 기반)
    const keyMapping = {
      // 서울 - path id="KR11"
      'seoul': 'seoul', 'kr11': 'seoul', 'KR11': 'seoul', 'Seoul': 'seoul', '서울': 'seoul',

      // 부산 - path id="KR26"
      'busan': 'busan', 'kr26': 'busan', 'KR26': 'busan', 'Busan': 'busan', '부산': 'busan',

      // 대구 - path id="KR27"
      'daegu': 'daegu', 'kr27': 'daegu', 'KR27': 'daegu', 'Daegu': 'daegu', '대구': 'daegu',

      // 인천 - path id="KR28"
      'incheon': 'incheon', 'kr28': 'incheon', 'KR28': 'incheon', 'Incheon': 'incheon', '인천': 'incheon',

      // 광주 - path id="KR29"
      'gwangju': 'gwangju', 'kr29': 'gwangju', 'KR29': 'gwangju', 'Gwangju': 'gwangju', '광주': 'gwangju',

      // 대전 - path id="KR30"
      'daejeon': 'daejeon', 'kr30': 'daejeon', 'KR30': 'daejeon', 'Daejeon': 'daejeon', '대전': 'daejeon',

      // 울산 - path id="KR31"
      'ulsan': 'ulsan', 'kr31': 'ulsan', 'KR31': 'ulsan', 'Ulsan': 'ulsan', '울산': 'ulsan',

      // 세종 - path id="KR50"
      'sejong': 'sejong', 'kr50': 'sejong', 'KR50': 'sejong', 'Sejong': 'sejong', '세종': 'sejong',

      // 경기 - path id="KR41"
      'gyeonggi': 'gyeonggi', 'kr41': 'gyeonggi', 'KR41': 'gyeonggi', 'Gyeonggi': 'gyeonggi', '경기': 'gyeonggi',

      // 강원 - path id="KR42"
      'gangwon': 'gangwon', 'kr42': 'gangwon', 'KR42': 'gangwon', 'Gangwon': 'gangwon', '강원': 'gangwon',

      // 충북 - path id="KR43"
      'chungbuk': 'chungbuk', 'kr43': 'chungbuk', 'KR43': 'chungbuk', 'North Chungcheong': 'chungbuk', '충북': 'chungbuk',

      // 충남 - path id="KR44"
      'chungnam': 'chungnam', 'kr44': 'chungnam', 'KR44': 'chungnam', 'South Chungcheong': 'chungnam', '충남': 'chungnam',

      // 전북 - path id="KR45"
      'jeonbuk': 'jeonbuk', 'kr45': 'jeonbuk', 'KR45': 'jeonbuk', 'North Jeolla': 'jeonbuk', '전북': 'jeonbuk',

      // 전남 - path id="KR46"
      'jeonnam': 'jeonnam', 'kr46': 'jeonnam', 'KR46': 'jeonnam', 'South Jeolla': 'jeonnam', '전남': 'jeonnam',

      // 경북 - path id="KR47"
      'gyeongbuk': 'gyeongbuk', 'kr47': 'gyeongbuk', 'KR47': 'gyeongbuk', 'North Gyeongsang': 'gyeongbuk', '경북': 'gyeongbuk',

      // 경남 - path id="KR48"
      'gyeongnam': 'gyeongnam', 'kr48': 'gyeongnam', 'KR48': 'gyeongnam', 'South Gyeongsang': 'gyeongnam', '경남': 'gyeongnam',

      // 제주 - path id="KR49"
      'jeju': 'jeju', 'kr49': 'jeju', 'KR49': 'jeju', 'Jeju': 'jeju', '제주': 'jeju',
    }

    // 지역명 매핑
    const regionNames = {
      'seoul': '서울특별시',
      'busan': '부산광역시',
      'daegu': '대구광역시',
      'incheon': '인천광역시',
      'gwangju': '광주광역시',
      'daejeon': '대전광역시',
      'ulsan': '울산광역시',
      'sejong': '세종특별자치시',
      'gyeonggi': '경기도',
      'gangwon': '강원도',
      'chungbuk': '충청북도',
      'chungnam': '충청남도',
      'jeonbuk': '전라북도',
      'jeonnam': '전라남도',
      'gyeongbuk': '경상북도',
      'gyeongnam': '경상남도',
      'jeju': '제주특별자치도'
    }

    // 키 찾기 - 더 스마트한 매칭
    let mappedKey = keyMapping[regionId.toLowerCase()]

    // 직접 매핑이 안 되면 부분 문자열로 찾기
    if (!mappedKey) {
      const regionKeywords = ['seoul', 'busan', 'gyeonggi', 'daegu', 'incheon', 'gwangju',
        'daejeon', 'ulsan', 'sejong', 'gangwon', 'chungbuk', 'chungnam',
        'jeonbuk', 'jeonnam', 'gyeongbuk', 'gyeongnam', 'jeju']

      const lowerRegionId = regionId.toLowerCase()

      for (const keyword of regionKeywords) {
        if (lowerRegionId.includes(keyword)) {
          mappedKey = keyword
          // console.log(`🎯 부분 문자열로 찾음: ${lowerRegionId} → ${keyword}`)
          break
        }
      }
    }

    // 그래도 안 되면 기본값 사용
    if (!mappedKey) {
      mappedKey = regionId.toLowerCase()
      // console.log(`⚠️ 매핑 실패, 원본 사용: ${mappedKey}`)
    }

    // console.log('🎯 최종 매핑된 키:', mappedKey)
    // console.log('🎯 사용 가능한 키들:', Object.keys(regionPeople))

    const regionName = regionNames[mappedKey] || regionId
    // console.log(`${regionName} 선택됨!`)

    // 더미 regionPeople 대신, 백엔드에서 받아온 allMembers에서 지역(location) 매칭
    // 한글 location → 영문 mappedKey로 변환 매핑 테이블
    const locationToKey = {
      '서울특별시': 'seoul', '서울': 'seoul',
      '부산광역시': 'busan', '부산': 'busan',
      '대구광역시': 'daegu', '대구': 'daegu',
      '인천광역시': 'incheon', '인천': 'incheon',
      '광주광역시': 'gwangju', '광주': 'gwangju',
      '대전광역시': 'daejeon', '대전': 'daejeon',
      '울산광역시': 'ulsan', '울산': 'ulsan',
      '세종특별자치시': 'sejong', '세종': 'sejong',
      '경기도': 'gyeonggi', '경기': 'gyeonggi',
      '강원도': 'gangwon', '강원': 'gangwon',
      '충청북도': 'chungbuk', '충북': 'chungbuk',
      '충청남도': 'chungnam', '충남': 'chungnam',
      '전라북도': 'jeonbuk', '전북': 'jeonbuk',
      '전라남도': 'jeonnam', '전남': 'jeonnam',
      '경상북도': 'gyeongbuk', '경북': 'gyeongbuk',
      '경상남도': 'gyeongnam', '경남': 'gyeongnam',
      '제주특별자치도': 'jeju', '제주': 'jeju'
    };
    const regionPeopleData = Array.isArray(allMembers)
      ? allMembers.filter(person => {
          const rawLoc = person.location;
          const trimmedLoc = rawLoc?.trim();
          const key = locationToKey[trimmedLoc] || trimmedLoc?.toLowerCase().replace(/\s/g, '');
          const match = key === mappedKey;
          console.log('[매핑 디버그]', {
            personId: person.id,
            location: rawLoc,
            trimmedLoc,
            key,
            mappedKey,
            match
          });
          return match;
        })
      : [];
    console.log('[최종 필터 결과]', regionPeopleData);
    setPeople(regionPeopleData)
  }, [allMembers])

  // 지역명 한글→영문 매핑 테이블 (인물/뉴스 공통)
  const locationToKey = {
    '서울특별시': 'seoul', '서울': 'seoul',
    '부산광역시': 'busan', '부산': 'busan',
    '대구광역시': 'daegu', '대구': 'daegu',
    '인천광역시': 'incheon', '인천': 'incheon',
    '광주광역시': 'gwangju', '광주': 'gwangju',
    '대전광역시': 'daejeon', '대전': 'daejeon',
    '울산광역시': 'ulsan', '울산': 'ulsan',
    '세종특별자치시': 'sejong', '세종': 'sejong',
    '경기도': 'gyeonggi', '경기': 'gyeonggi',
    '강원도': 'gangwon', '강원': 'gangwon',
    '충청북도': 'chungbuk', '충북': 'chungbuk',
    '충청남도': 'chungnam', '충남': 'chungnam',
    '전라북도': 'jeonbuk', '전북': 'jeonbuk',
    '전라남도': 'jeonnam', '전남': 'jeonnam',
    '경상북도': 'gyeongbuk', '경북': 'gyeongbuk',
    '경상남도': 'gyeongnam', '경남': 'gyeongnam',
    '제주특별자치도': 'jeju', '제주': 'jeju'
  };

  /**
   * 지역별 뉴스 필터링
   * - 선택된 지역(regionKey)에 해당하는 뉴스만 추출
   */
  const regionKey = (() => {
    if (people.length > 0 && people[0].location) {
      const loc = people[0].location?.trim();
      return locationToKey[loc] || loc?.toLowerCase().replace(/\s/g, '');
    }
    // people이 없을 때는 selectedRegion(영문) 사용
    return selectedRegion ? selectedRegion.toLowerCase() : null;
  })();
  const regionNews = Array.isArray(news) && regionKey ?
    news.filter(item => {
      const rawLoc = item.location || item.region;
      const trimmedLoc = rawLoc?.trim();
      const key = locationToKey[trimmedLoc] || trimmedLoc?.toLowerCase().replace(/\s/g, '');
      return key === regionKey;
    }) : [];

  // 최신 handleRegionAction을 ref에 저장
  useEffect(() => {
    handleRegionActionRef.current = handleRegionAction;
  }, [handleRegionAction]);

  /**
   * handleRegionClick(regionId, pathElement)
   * - 지도에서 지역 클릭 시 선택/해제 및 스타일 처리
   * - 선택된 지역의 정치인/뉴스 정보 갱신
   */
  const handleRegionClick = useCallback((regionId, pathElement) => {
    // 이미 선택된 지역을 다시 클릭하면 선택 해제
    if (selectedRegion === regionId) {
      pathElement.classList.remove('selected')
      setSelectedRegion(null)
      setPeople([])
      return
    }

    // 모든 지역에서 selected 클래스 제거
    if (svgRef.current) {
      const allPaths = svgRef.current.querySelectorAll('path')
      allPaths.forEach(path => {
        path.classList.remove('selected')
      })
    }

    // 모든 지역에서 selected 클래스 제거
    pathElement.classList.add('selected')
    setSelectedRegion(regionId)

    // 항상 최신 handleRegionAction 사용
    handleRegionActionRef.current(regionId)
  }, []);

  // 한글 지역명 매핑 (지도/뉴스/표시용 공통)
  const regionNames = {
    'seoul': '서울특별시',
    'busan': '부산광역시',
    'daegu': '대구광역시',
    'incheon': '인천광역시',
    'gwangju': '광주광역시',
    'daejeon': '대전광역시',
    'ulsan': '울산광역시',
    'sejong': '세종특별자치시',
    'gyeonggi': '경기도',
    'gangwon': '강원도',
    'chungbuk': '충청북도',
    'chungnam': '충청남도',
    'jeonbuk': '전라북도',
    'jeonnam': '전라남도',
    'gyeongbuk': '경상북도',
    'gyeongnam': '경상남도',
    'jeju': '제주특별자치도'
  };

  /**
   * getRegionName(regionId)
   * - 지역 ID를 한글 지역명으로 변환
   */
  const getRegionName = (regionId) => {
    if (!regionId) return '';
    // regionId가 KR42 등 코드면 keyMapping으로 변환
    const keyMapping = {
      'kr11': 'seoul', 'kr26': 'busan', 'kr27': 'daegu', 'kr28': 'incheon', 'kr29': 'gwangju',
      'kr30': 'daejeon', 'kr31': 'ulsan', 'kr50': 'sejong', 'kr41': 'gyeonggi', 'kr42': 'gangwon',
      'kr43': 'chungbuk', 'kr44': 'chungnam', 'kr45': 'jeonbuk', 'kr46': 'jeonnam', 'kr47': 'gyeongbuk',
      'kr48': 'gyeongnam', 'kr49': 'jeju'
    };
    const lower = regionId.toLowerCase();
    const mapped = keyMapping[lower] || lower;
    return regionNames[mapped] || regionId;
  };

  return (
    <div className="mainpage-background">
      {/* 메인 2분할 레이아웃: 좌측(정치인/뉴스), 우측(지도) */}
      <div className="mainpage-2col">
        <div className="map-container">
          <div className="mainpage-people-col">
            {/* 로딩 상태: 스켈레톤 카드 */}
            {loading ? (
              <div className="people-loading">
                <div className="person-card skeleton" />
                <div className="person-card skeleton" />
                <div className="person-card skeleton" />
              </div>
            ) : null}
            {/* 지역 선택 시: 정치인/뉴스 정보 박스 */}
            {selectedRegion && (
              <div className="region-info-box fade-in">
                <button
                  className="region-info-close"
                  aria-label="닫기"
                  onClick={() => {
                    setSelectedRegion(null);
                    setPeople([]);
                  }}
                ><img src= "https://img.icons8.com/?size=100&id=9433&format=png&color=000000"/>
                </button>
                <p className="region-info-name">{getRegionName(selectedRegion)}</p>

                <p className='region-info-name'>정치인 정보</p>
                {/* 정치인 카드 리스트 */}
                <div className="region-people-list">
                  {people.length > 0 ? (
                    people.map(person => (
                      <div className="person-card" key={person.id}>
                        <img
                          className="person-img"
                          src={person.profile_image_url || 'https://via.placeholder.com/150x150?text=No+Image'}
                          alt={person.name}
                          onClick={() => navigate(`/people/${person.id}`, { state: {
                            id: person.id,
                            name: person.name,
                            job: person.job,
                            img: person.profile_image_url || '',
                            ...person
                          } })}
                        />
                        <button
                          className="person-name-btn"
                          onClick={() => navigate(`/people/${person.id}`, { state: {
                            id: person.id,
                            name: person.name,
                            job: person.job,
                            img: person.profile_image_url || '',
                            ...person
                          } })}
                        >
                          {person.name}
                        </button>
                        <p className="person-job">{person.affiliation || ''}</p>
                      </div>
                    ))
                  ) : (
                    <div className="no-people">
                      <h3>🗺️ 지역을 선택해주세요</h3>
                      <p>지도를 클릭하면 해당 지역의 정치인 정보를 볼 수 있습니다.</p>
                    </div>
                  )}
                </div>
                <small className="region-info-desc">
                  {people.length}명의 정치인이 표시되고 있습니다.
                </small>
                  <h4 className="region-news-title">지역 뉴스</h4>
                {/* 지역별 뉴스 출력 */}
                <div className="region-news-list">
                  {regionNews.length > 0 ? (
                    regionNews.map(newsItem => {
                      // 내용 필드 추출: description, summary, content, body 등 우선순위
                      const content = newsItem.description || newsItem.summary || newsItem.content || newsItem.body || '';
                      return (
                        <div key={newsItem.id} className="region-news-card">
                          <a href={newsItem.url} target="_blank" rel="noopener noreferrer" className="region-news-link">
                            <div className="region-news-title-txt">{newsItem.title}</div>
                            {content && (
                              <div className="region-news-content">{content}</div>
                            )}
                            <div className="region-news-meta">
                              <span className="region-news-source">{newsItem.source || newsItem.media}</span>
                              <span className="region-news-date">{newsItem.date || newsItem.pubDate}</span>
                            </div>
                          </a>
                        </div>
                      )
                    })
                  ) : (
                    <div className="region-news-none">해당 지역 뉴스가 없습니다.</div>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* 지도 SVG */}
          <div className="mainpage-map-col">
            <KrMap ref={svgRef} className="korea-map slide-up" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainPage