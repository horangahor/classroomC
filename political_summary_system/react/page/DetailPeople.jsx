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
  desc: '대한민국의 정치인. 주요 경력 및 소개가 여기에 들어갑니다.',
  age: 60,
  location: '서울특별시',
  email: 'lee@korea.kr',
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

  // 주요 필드만 선별 (순서: 이름, 나이, 직책, 위치, 소속정당)
  const mainFields = [
    { label: '이름', key: 'name' },
    { label: '나이', key: 'age' },
    { label: '직책', key: person.job ? 'job' : 'position' },
    { label: '위치', key: person.region ? 'region' : 'location' },
    { label: '소속정당', key: 'affiliation' }
  ]
  // 기타 정보(공약만 남김, 이미지 관련 키 모두 제외)
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
          <div className="detail-people-info" style={{flex: 1}}>
            {mainFields.map(({ label, key }) =>
              person[key] ? (
                <div key={key} className={`detailpeople-main detailpeople-${key}`}>
                  <span className="detailpeople-label">{label}</span>
                  <span className="detailpeople-value">{person[key]}</span>
                </div>
              ) : null
            )}
            {/* mainFields에 없는 나머지 정보도 모두 아래에 세로로 출력 (id 등 불필요한 필드는 제외) */}
            {Object.entries(person)
              .filter(([key, value]) =>
                !mainFields.some(f => f.key === key) &&
                !['img', 'profile_image_url', 'profileImageUrl', 'profileImgUrl', 'id'].includes(key) &&
                key !== 'pledge' &&
                value && String(value).trim() !== ''
              )
              .map(([key, value]) => (
                <div key={key} className={`detailpeople-extra-row detailpeople-${key}`}>
                  <span className="detailpeople-label">{key}</span>
                  <span className="detailpeople-value">{String(value)}</span>
                </div>
              ))}
            {/* 공약(pledge)만 별도 박스에 출력 */}
            {person.pledge && String(person.pledge).trim() !== '' && (
              <div className="detailpeople-extra">
                <div className="detailpeople-extra-title">공약</div>
                <div className="detailpeople-extra-list">
                  <span className="person-detail-value detailpeople-pledge">{String(person.pledge)}</span>
                </div>
              </div>
            )}
          </div>
          <img className="people-img detail" src={person.img} alt={person.name} style={{marginTop: 0}} />
        </div>
      </div>
    </div>
  )
}

export default DetailPeople