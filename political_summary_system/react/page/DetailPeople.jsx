import React from 'react'
import { useParams } from 'react-router-dom'
import '../style/Detail.css'

const dummyPeople = [
  { id: 1, name: '이재명', job: '대통령', img: 'https://search.pstatic.net/common?type=b&size=3000&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2FprofileImg%2F5f6c9c3e-ec97-4a6f-8435-500d64bdb83d.jpg' },
  { id: 2, name: '오세훈', job: '서울시장', img: 'https://search.pstatic.net/common?type=b&size=3000&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2FprofileImg%2F741375bb-aeb9-4c71-8f84-3bc72273e4dc.jpg'},
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
      </div>
    </div>
  )
}

export default DetailPeople