import React from 'react'
import { useParams } from 'react-router-dom'
import '../style/Detail.css'

const dummyPeople = [
  { id: 1, name: '이재명', content: '인공지능 대전환(AX)을 통해 AI 3강으로 도약' // 인물의 공약이나 활동 내용 content
    ,job: '대통령', img: 'https://search.pstatic.net/common?type=b&size=216&expire=1&refresh=true&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2FprofileImg%2F5f6c9c3e-ec97-4a6f-8435-500d64bdb83d.jpg'},
  { id: 2, name: '오세훈', content: '역대 최연소 민선 서울특별시장,역대 최고 득표율 서울특별시장',job: '서울시장', img: 'https://search.pstatic.net/common?type=b&size=216&expire=1&refresh=true&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2FprofileImg%2F741375bb-aeb9-4c71-8f84-3bc72273e4dc.jpg'},
]

const DetailPeople = () => {
  const { id } = useParams()
  const person = dummyPeople.find(p => p.id === Number(id))

    if (!person) {
    return <div>인물 정보를 찾을 수 없습니다.</div>
  }

  return (
    <div className="detail-container">
      <img
        className="detail-img"
        src={person.img}
        alt={person.name}
      />
      <div className="detail-info">
        <h2 className="detail-title">{person.name}</h2>
        <p className="detail-job">{person.job}</p>
        <div className="detail-content">{person.content}</div>
      </div>
    </div>
  )
}

export default DetailPeople