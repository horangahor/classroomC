import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import '../style/Detail.css'
import axios from 'axios'

/* DetailPeople.jsx - 인물 상세 컴포넌트: 프로필/공약/세부정보 렌더링 요약 */

/**
 * DetailPeople 컴포넌트
 * - 정치인 상세 정보 페이지
 * - 주요 필드(이름, 나이, 직책, 위치, 소속정당 등)만 보기 좋게 출력
 * - 학생증 느낌의 2분할 레이아웃, 정당별 border-color, 스타일 통일
 * - 인물 데이터는 백엔드에서 fetch하여 동적으로 연동
 */
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
  // location.state가 있으면 우선 사용, 없으면 fetchDetail로 백엔드에서 받아옴
  const [person, setPerson] = useState(location.state || null)

  useEffect(() => {
    if (!person) {
      const load = async () => {
        const data = await fetchDetail(id)
        if (data) setPerson(data)
        else setPerson(null)
      }
      load()
    }
  }, [id])

  if (!person) return null

  // 주요 필드만 선별 (이름, 나이, 직책, 위치, 소속정당)
  const mainFields = [
    { label: '이름', key: 'name' },
    { label: '나이', key: 'age' },
    { label: '직책', key: person.job ? 'job' : (person.position ? 'position' : null) },
    { label: '위치', key: person.region ? 'region' : 'location' },
    { label: '소속정당', key: 'affiliation' },
    { label: '공약', key: 'pledge'}
  ].filter(f => f.key);

  // 기타 정보(공약 등)
  const extraEntries = Object.entries(person)
    .filter(([key, value]) =>
      !['img', 'profile_image_url', 'profileImageUrl', 'profileImgUrl'].includes(key)
      && key === 'pledge' && value && String(value).trim() !== ''
    )

  return (
    <div className="people-page-bg">
      <div className="people-main-bg">
        <button className="people-back-btn" onClick={() => navigate(-1)}>
          ← 목록으로
        </button>
        <div className={`detail-people-container detailpeople-affiliation-${person.affiliation || ''}`} style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '36px', justifyContent: 'flex-start'}}>
          <img className="people-img detail" src={person.img} alt={person.name} style={{marginTop: 0}} />
          <div className="detail-people-info" style={{flex: 1}}>
            {mainFields.map(({ label, key }) =>
              person[key] ? (
                <div key={key} className={`detailpeople-main detailpeople-${key}`}>
                  <span className="detailpeople-label">{label}</span>
                  <span className="detailpeople-value">{person[key]}</span>
                </div>
              ) : null
            )}
            {/* 기타 정보(공약 등) 출력 */}
            {/* {extraEntries.map(([key, value]) => (
              <div key={key} className="detailpeople-extra">
                <span className="detailpeople-label">{key === 'pledge' ? '공약' : key}</span>
                <span className="detailpeople-value">
                  {Array.isArray(value)
                    ? (
                      <ul>
                        {value.map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                    )
                    : value
                  }
                </span>
              </div>
            ))} */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailPeople