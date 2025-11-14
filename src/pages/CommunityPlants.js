import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const CommunityPlants = () => {
  const [plants, setPlants] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const res = await axios.get('http://localhost:8080/api/plants/public-plants')
        setPlants(res.data)
      } catch (err) {
        console.error('Failed to fetch public plants:', err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  if (loading) return <p>Loading community plants...</p>
  if (!plants.length) return <p>No public plants yet. Encourage users to share!</p>

  return (
    <div style={{ maxWidth: 900, margin: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <button onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
        <button onClick={() => navigate('/add-plant')}>➕ Add Plant</button>
      </div>
      <h2>Community Plants 🌍</h2>
      <p>Browse public plant entries shared by other users.</p>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {plants.map(p => {
          const plantId = p.id || p._id
          return (
            <li key={plantId} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8, marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{p.name}</strong> <small>({p.species})</small>
                  <div style={{ fontSize: 13, color: '#555' }}>Owner: {p.ownerUsername}</div>
                </div>
                <div>
                  <button onClick={() => navigate(`/plants/${plantId}`)}>View</button>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default CommunityPlants
