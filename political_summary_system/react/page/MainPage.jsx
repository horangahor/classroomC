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

  // 인물 더미 데이터
  const dummyPeople = [
    { id: 1, name: '이재명', job: '대통령', img: 'https://search.pstatic.net/common?type=b&size=3000&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2FprofileImg%2F5f6c9c3e-ec97-4a6f-8435-500d64bdb83d.jpg' },
    { id: 2, name: '오세훈', job: '서울시장', img: 'https://search.pstatic.net/common?type=b&size=3000&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2FprofileImg%2F741375bb-aeb9-4c71-8f84-3bc72273e4dc.jpg' },
  ]

  useEffect(() => {
    setPeople(dummyPeople)
  }, [])

  useEffect(() => {
    if (svgRef.current) {
      // SVG 내부의 모든 path 요소 찾기
      const paths = svgRef.current.querySelectorAll('path')
      
      paths.forEach((path, index) => {
        // 각 path의 식별자 확인
        const regionId = path.id || 
                        path.getAttribute('data-name') || 
                        path.className.baseVal || 
                        `region-${index}`

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
    console.log('클릭된 지역:', regionId)

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

    const regionName = regionNames[regionId.toLowerCase()] || regionId
    
    console.log(`${regionName} 선택됨!`)
    
    // 예시: 지역별 다른 동작
    switch(regionId.toLowerCase()) {
      case 'seoul':
        console.log('서울특별시의 정치인 정보를 불러옵니다!')
        break
      case 'busan':
        console.log('부산광역시의 정치인 정보를 불러옵니다!')
        break
      case 'gyeonggi':
        console.log('경기도의 정치인 정보를 불러옵니다!')
        break
      default:
        console.log(`${regionName}의 정치인 정보를 불러옵니다!`)
    }
  }

  return (
    <div className="mainpage-background">
      <h1 className="mainpage-title">지도로 확인하는 지역 정치 이슈</h1>
      <div className="mainpage-container">
        {/* 좌측 콘텐츠 영역 */}
        <div className="left-content">
          <div className="people-container">
            {people.map(person => (
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
            ))}
          </div>

          {selectedRegion && (
            <div className="region-info-box fade-in">
              <h3 className="region-info-title">선택된 지역</h3>
              <p className="region-info-name">{selectedRegion}</p>
              <small className="region-info-desc">클릭한 지역의 정보가 여기에 표시됩니다.</small>
            </div>
          )}
        </div>

        {/* 우측 지도 영역 */}
        <div className="right-content">
          <div className="map-container">
            <KrMap
              ref={svgRef}
              className="korea-map slide-up"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainPage