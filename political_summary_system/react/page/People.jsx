import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../style/People.css'

const dummyPeople = [
  { id: 1, name: '이재명', job: '대통령', img: 'https://i.namu.wiki/i/gw4e7BU5tD3vqOwhH52Pj7P82VX0Gfcm8Vi6jTjnVw8-Y9bpg_nzjUMr8_NObnsEh9EhfFx6MmaA3G46R3aRNshi-M90KnFiByBHk6zBEtBdrILw-RrTRNFU2o637OATYPRg3-rvFSSSqKaiaIvwCw.webp' },
  { id: 2, name: '오세훈', job: '서울시장', img: 'https://i.namu.wiki/i/z8-mvsdlLFGa98K6LLs4EnZt3FyDAHDA88U0sIuc8z0XGfBalz4b1WTkgF-W8n_yPfxYRuLkDHRu1cyxXtI4rUt7HwftIZ0iRNx6VEEvDJiJJ-mwckL4ejSgHwJsTjTK6ezXCw_-SZLzc5FBzdDqHw.webp'},
]

const People = () => {
  const [people, setPeople] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    setPeople(dummyPeople)
  }, [])

  return (
    <div>
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
    </div>
  )
}

export default People