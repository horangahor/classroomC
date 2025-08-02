import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../style/People.css'

const dummyPeople = [
  { id: 1, name: '이재명', job: '대통령', img: 'https://search.pstatic.net/common?type=b&size=3000&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2FprofileImg%2F5f6c9c3e-ec97-4a6f-8435-500d64bdb83d.jpg' },
  { id: 2, name: '오세훈', job: '서울시장', img: 'https://search.pstatic.net/common?type=b&size=3000&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2FprofileImg%2F741375bb-aeb9-4c71-8f84-3bc72273e4dc.jpg'},
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