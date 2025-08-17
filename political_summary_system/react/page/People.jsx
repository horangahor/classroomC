import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../style/People.css'
import axios from 'axios'

/**
 * People.jsx - 정치인 리스트/카드 페이지
 * 정치인 목록, 카드, 상세 이동 등 UI 담당
 */

/**
 * People 컴포넌트
 * - 전체 정치인 목록을 직책별로 그룹핑하여 카드 형태로 출력
 * - 각 카드 클릭 시 상세 페이지로 이동
 * - 인물 데이터는 백엔드에서 fetch하여 동적으로 연동
 * - 직책별 그룹핑, 예외 처리, 스타일 일원화 등 UI/UX 개선
 */

const fetchMember = async () => {
  try {
    const res = await axios.get('http://localhost:8000/members')
    if (Array.isArray(res.data) && res.data.length > 0) {
      return res.data.map(person => ({
        ...person,
        img: person.img || person.profile_image_url || '',
        name: person.name || person.person_name || person.real_name || '-',
        job: person.job || person.position || person.title || '-',
      }))
    }
    return null
  } catch (err) {
    console.error(err)
    return null
  }
}

// 직책별 카테고리 그룹핑 함수
const groupByJobCategory = (peopleList) => {
  const categories = {
    대통령: [],
    도지사: [],
    시장: [],
    기타: []
  }
  peopleList.forEach(person => {
    if (person.job?.includes('대통령')) categories.대통령.push(person)
    else if (person.job?.includes('도지사')) categories.도지사.push(person)
    else if (person.job?.includes('시장')) categories.시장.push(person)
    else categories.기타.push(person)
  })
  return categories
}

const People = () => {
  const [people, setPeople] = useState([])
  const navigate = useNavigate()

  // 인물 데이터 fetch (백엔드 연동)
  useEffect(() => {
    const load = async () => {
      const data = await fetchMember()
      if (data && Array.isArray(data)) {
        setPeople(data)
      } else {
        setPeople([])
      }
    }
    load()
  }, [])

  const jobCategories = groupByJobCategory(people)

  return (
    <div className="people-page-bg">
      <div className="people-main-bg">
        <h1 className="people-title">정치인 인물 정보</h1>
        {Object.entries(jobCategories).map(([category, list]) => (
          list.length > 0 && (
            <div key={category} className="people-category-group">
              <h2 className="people-category-title">{category}</h2>
              <div className="people-list">
                {list.map(person => (
                  <div
                    className="people-card"
                    key={person.id}
                    onClick={() => navigate(`/people/${person.id}`, { state: person })}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="people-img-wrap">
                      <img
                        className="people-img"
                        src={person.img}
                        alt={person.name}
                      />
                    </div>
                    <div className="people-info">
                      <div className="people-name">{person.name ? person.name : '-'}</div>
                      <div className="people-job">{person.job ? person.job : '-'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  )
}

export default People