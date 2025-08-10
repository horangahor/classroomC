import React, { useRef, useEffect, useState } from 'react'
import { ReactComponent as KrMap } from '../assets/kr.svg'
import { useNavigate } from 'react-router-dom'
import '../style/MainPage.css'
import '../style/People.css'

const MainPage = () => {
  const svgRef = useRef(null)
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [people, setPeople] = useState([])
  const navigate = useNavigate()

  // 지역별 인물 데이터
  const regionPeople = {
    seoul: [
      { id: 1, name: '오세훈', job: '서울시장', img: 'https://via.placeholder.com/150x150/4A90E2/FFFFFF?text=오세훈' },
      { id: 2, name: '김철수', job: '서울시의원', img: 'https://via.placeholder.com/150x150/50C878/FFFFFF?text=김철수' },
    ],
    busan: [
      { id: 3, name: '박형준', job: '부산시장', img: 'https://via.placeholder.com/150x150/FF6B6B/FFFFFF?text=박형준' },
      { id: 4, name: '이영희', job: '부산시의원', img: 'https://via.placeholder.com/150x150/FFD93D/000000?text=이영희' },
    ],
    gyeonggi: [
      { id: 5, name: '김동연', job: '경기도지사', img: 'https://via.placeholder.com/150x150/6BCF7F/FFFFFF?text=김동연' },
      { id: 6, name: '박민수', job: '경기도의원', img: 'https://via.placeholder.com/150x150/4ECDC4/FFFFFF?text=박민수' },
    ],
    daegu: [
      { id: 7, name: '홍준표', job: '대구시장', img: 'https://via.placeholder.com/150x150/96CEB4/FFFFFF?text=홍준표' },
    ],
    incheon: [
      { id: 8, name: '유정복', job: '인천시장', img: 'https://via.placeholder.com/150x150/FECA57/000000?text=유정복' },
    ],
    gwangju: [
      { id: 9, name: '강기정', job: '광주시장', img: 'https://via.placeholder.com/150x150/FF9FF3/000000?text=강기정' },
    ],
    daejeon: [
      { id: 10, name: '이장우', job: '대전시장', img: 'https://via.placeholder.com/150x150/54A0FF/FFFFFF?text=이장우' },
    ],
    ulsan: [
      { id: 11, name: '김두겸', job: '울산시장', img: 'https://via.placeholder.com/150x150/5F27CD/FFFFFF?text=김두겸' },
    ],
    sejong: [
      { id: 12, name: '최민호', job: '세종시장', img: 'https://via.placeholder.com/150x150/00D2D3/FFFFFF?text=최민호' },
    ],
    gangwon: [
      { id: 13, name: '김진태', job: '강원도지사', img: 'https://via.placeholder.com/150x150/FF6348/FFFFFF?text=김진태' },
    ],
    chungbuk: [
      { id: 14, name: '김영환', job: '충북도지사', img: 'https://via.placeholder.com/150x150/2ED573/FFFFFF?text=김영환' },
    ],
    chungnam: [
      { id: 15, name: '김태흠', job: '충남도지사', img: 'https://via.placeholder.com/150x150/FFA502/FFFFFF?text=김태흠' },
    ],
    jeonbuk: [
      { id: 16, name: '김관영', job: '전북도지사',img: 'https://via.placeholder.com/150x150/3742FA/FFFFFF?text=김관영' },
    ],
    jeonnam: [
      { id: 17, name: '김영록', job: '전남도지사', img: 'https://via.placeholder.com/150x150/2F3542/FFFFFF?text=김영록' },
    ],
    gyeongbuk: [
      { id: 18, name: '이철우', job: '경북도지사', img: 'https://via.placeholder.com/150x150/F97F51/FFFFFF?text=이철우' },
    ],
    gyeongnam: [
      { id: 19, name: '박완수', job: '경남도지사', img: 'https://via.placeholder.com/150x150/1DD1A1/FFFFFF?text=박완수' },
    ],
    jeju: [
      { id: 20, name: '오영훈', job: '제주도지사', img: 'https://via.placeholder.com/150x150/F8B500/000000?text=오영훈' },
    ]
  }

  useEffect(() => {
    if (svgRef.current) {
      // SVG 내부의 모든 path 요소 찾기
      const paths = svgRef.current.querySelectorAll('path')

      // console.log(`총 ${paths.length}개의 지역을 찾았습니다.`)

      paths.forEach((path, index) => {
        // 각 path의 식별자 확인
        const regionId = path.id ||
          path.getAttribute('data-name') ||
          path.className.baseVal ||
          `region-${index}`

        // console.log(`지역 ${index}:`, {
        //   id: path.id,
        //   className: path.className.baseVal,
        //   dataName: path.getAttribute('data-name'),
        //   tagName: path.tagName,
        //   allAttributes: Array.from(path.attributes).map(attr => `${attr.name}="${attr.value}"`).join(', ')
        // })

        // CSS 클래스 적용
        path.classList.add('region-path')

        // 클릭 이벤트 핸들러
        const handleClick = (e) => {
          e.stopPropagation()
          handleRegionClick(regionId, path)
        }

        // 이벤트 리스너 추가
        path.addEventListener('click', handleClick)

        // cleanup을 위해 path에 리스너 저장
        path._listeners = { handleClick }
      })

      // cleanup 함수
      return () => {
        paths.forEach(path => {
          if (path._listeners) {
            path.removeEventListener('click', path._listeners.handleClick)
          }
        })
      }
    }
  }, [selectedRegion])

  // 지역 클릭 처리 함수
  const handleRegionClick = (regionId, pathElement) => {
    // console.log('클릭된 지역:', regionId)

    // 이미 선택된 지역을 다시 클릭하면 선택 해제
    if (selectedRegion === regionId) {
      pathElement.classList.remove('selected')
      setSelectedRegion(null)
      setPeople([])
      // console.log('지역 선택 해제됨')
      return
    }

    // 모든 지역에서 selected 클래스 제거
    if (svgRef.current) {
      const allPaths = svgRef.current.querySelectorAll('path')
      allPaths.forEach(path => {
        path.classList.remove('selected')
      })
    }

    // 선택된 지역에 selected 클래스 추가
    pathElement.classList.add('selected')
    setSelectedRegion(regionId)

    // 지역별 처리 로직
    handleRegionAction(regionId)
  }

  // 지역별 액션 처리
  const handleRegionAction = (regionId) => {
    // console.log('🔍 디버깅 시작!')
    // console.log('원본 regionId:', regionId)
    // console.log('소문자 변환:', regionId.toLowerCase())

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

    // 인물 데이터 찾기
    const regionPeopleData = regionPeople[mappedKey] || []
    // console.log('🎯 찾은 인물 데이터:', regionPeopleData)
    // console.log('🎯 인물 수:', regionPeopleData.length)

    setPeople(regionPeopleData)
    // console.log(`${regionName}의 정치인 ${regionPeopleData.length}명을 불러왔습니다!`)
  }

  return (
    <div className="mainpage-background">
      {/* 히어로 영역 */}
      <div className="mainpage-hero">
        <h1 className="mainpage-title">대한민국 정치 정보 한눈에</h1>
        {/* <p className="mainpage-subtitle">지도를 클릭하면 지역별 정치인과 최신 뉴스를 볼 수 있습니다.</p> */}
      </div>
      {/* 2분할 레이아웃 - 지도 테두리 안에 좌우 컬럼 */}
      <div className="mainpage-2col">
        <div className="map-container">
          {/* 좌측: 정치인 정보 */}
          <div className="mainpage-people-col">
            <h3 className="mainpage-section-title">정치인 정보</h3>
            <div className="people-container">
              {people.length > 0 ? (
                people.map(person => (
                  <div className="person-card" key={person.id}>
                    <img
                      className="person-img"
                      src={person.img}
                      alt={person.name}
                      onClick={() => navigate(`/people/${person.id}`)}
                    />
                    <button
                      className="person-name-btn"
                      onClick={() => navigate(`/people/${person.id}`)}
                    >
                      {person.name}
                    </button>
                    <p className="person-job">{person.job}</p>
                  </div>
                ))
              ) : (
                <div className="no-people">
                  <h3>🗺️ 지역을 선택해주세요</h3>
                  <p>지도를 클릭하면 해당 지역의 정치인 정보를 볼 수 있습니다.</p>
                </div>
              )}
            </div>
            {selectedRegion && (
              <div className="region-info-box fade-in">
                <h3 className="region-info-title">선택된 지역</h3>
                <p className="region-info-name">{selectedRegion}</p>
                <small className="region-info-desc">
                  {people.length}명의 정치인이 표시되고 있습니다.
                </small>
              </div>
            )}
          </div>
          {/* 우측: 지도 */}
          <div className="mainpage-map-col">
            <div className="map-header">
              <h3 className="map-title">대한민국 지도</h3>
              <p className="map-description">지역을 선택하세요</p>
            </div>
            <KrMap ref={svgRef} className="korea-map slide-up" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainPage