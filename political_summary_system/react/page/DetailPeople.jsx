import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import '../style/Detail.css'
import axios from 'axios'

const dummyDetail = {
  id: 1,
  name: '이재명',
  job: '대통령',
  region: '서울',
  img: 'https://search.pstatic.net/common?type=b&size=3000&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2FprofileImg%2F5f6c9c3e-ec97-4a6f-8435-500d64bdb83d.jpg',
  desc: '대한민국의 정치인. 주요 경력 및 소개가 여기에 들어갑니다.'
}

const fetchDetail = async (id) => {
  try {
    const res = await axios.get(`http://localhost:8000/members/${id}`)
    if (res.data && res.data.id) return res.data
    return null
  } catch (err) {
    console.error(err)
    return null
  }
}

const DetailPeople = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  // location.state가 있으면 그걸 우선 사용, 없으면 fetchDetail로 백엔드에서 받아옴
  const [person, setPerson] = useState(location.state || null)

  useEffect(() => {
    if (!person) {
      const load = async () => {
        const data = await fetchDetail(id)
        if (data) setPerson(data)
        else setPerson(dummyDetail)
      }
      load()
    }
    // eslint-disable-next-line
  }, [id])

  if (!person) return null

  return (
    <div className="people-page-bg">
      <div className="people-main-bg">
        <button className="people-back-btn" onClick={() => navigate(-1)}>
          ← 목록으로
        </button>
        <div className="detail-people-container">
          <img className="people-img detail" src={person.img} alt={person.name} />
          <div className="detail-people-info">
            <div className="people-name">{person.name}</div>
            <div className="people-job">{person.job}</div>
            {/* 기타 모든 필드 동적 출력 */}
            {Object.entries(person).map(([key, value]) => {
              if (["img", "name", "job"].includes(key)) return null;
              return (
                <div key={key} className="person-detail-row">
                  <span className="person-detail-key">{key}:</span> <span className="person-detail-value">{String(value)}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailPeople