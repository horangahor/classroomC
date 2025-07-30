import React from 'react'
import { useParams } from 'react-router-dom'
import '../style/Detail.css'

const dummyPeople = [
  { id: 1, name: '이재명', job: '대통령', img: 'https://i.namu.wiki/i/gw4e7BU5tD3vqOwhH52Pj7P82VX0Gfcm8Vi6jTjnVw8-Y9bpg_nzjUMr8_NObnsEh9EhfFx6MmaA3G46R3aRNshi-M90KnFiByBHk6zBEtBdrILw-RrTRNFU2o637OATYPRg3-rvFSSSqKaiaIvwCw.webp' },
  { id: 2, name: '오세훈', job: '서울시장', img: 'https://i.namu.wiki/i/z8-mvsdlLFGa98K6LLs4EnZt3FyDAHDA88U0sIuc8z0XGfBalz4b1WTkgF-W8n_yPfxYRuLkDHRu1cyxXtI4rUt7HwftIZ0iRNx6VEEvDJiJJ-mwckL4ejSgHwJsTjTK6ezXCw_-SZLzc5FBzdDqHw.webp'},
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