import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../style/People.css'
import axios from 'axios'

const dummyPeople = [
  { id: 1, name: '이재명', job: '대통령', img: 'https://search.pstatic.net/common?type=b&size=3000&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2FprofileImg%2F5f6c9c3e-ec97-4a6f-8435-500d64bdb83d.jpg' },
  { id: 2, name: '오세훈', job: '서울시장', img: 'https://search.pstatic.net/common?type=b&size=3000&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2FprofileImg%2F741375bb-aeb9-4c71-8f84-3bc72273e4dc.jpg' },
  { id: 2, name: '오세훈', job: '서울시장', img: 'https://search.pstatic.net/common?type=b&size=3000&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2FprofileImg%2F741375bb-aeb9-4c71-8f84-3bc72273e4dc.jpg' },
  { id: 2, name: '오세훈', job: '서울시장', img: 'https://search.pstatic.net/common?type=b&size=3000&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2FprofileImg%2F741375bb-aeb9-4c71-8f84-3bc72273e4dc.jpg' },
  { id: 2, name: '오세훈', job: '서울시장', img: 'https://search.pstatic.net/common?type=b&size=3000&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2FprofileImg%2F741375bb-aeb9-4c71-8f84-3bc72273e4dc.jpg' },
  { id: 2, name: '오세훈', job: '서울시장', img: 'https://search.pstatic.net/common?type=b&size=3000&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2FprofileImg%2F741375bb-aeb9-4c71-8f84-3bc72273e4dc.jpg' },
  
]

const fetchMember = async () => {
  try {
    const res = await axios.get('http://localhost:8000/members')
    // 서버에서 배열로 내려온다고 가정
    if (Array.isArray(res.data) && res.data.length > 0) {
      // 백엔드 profile_image_url → 프론트 img로 매핑
      return res.data.map(person => ({
        ...person,
        img: person.img || person.profile_image_url || '',
      }))
    }
    return null
  } catch (err) {
    console.error(err)
    return null
  }
}

const People = () => {
  const [people, setPeople] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    // 서버에서 데이터 받아오고, 없으면 더미 사용
    const load = async () => {
      const data = await fetchMember()
      console.log('[fetchMember 결과]', data)
      if (data && Array.isArray(data)) {
        // img 필드와 profile_image_url 필드 모두 콘솔로 확인
        data.forEach((person, idx) => {
          console.log(`[person ${idx}] img:`, person.img, 'profile_image_url:', person.profile_image_url)
        })
        setPeople(data)
      } else {
        setPeople(dummyPeople)
      }
    }
    load()
  }, [])

  return (
    <div className="people-page-bg">
      <div className="people-main-bg">
        <h1 className="people-title">정치인 인물 정보</h1>
        <div className="people-list">
          {people.map(person => (
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
                  style={{ objectFit: 'cover', background: '#f1f5f9' }}
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
    </div>
  )
}

export default People