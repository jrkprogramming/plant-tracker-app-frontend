import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import PlantList from './PlantList'

const PlantDashboard = ({ username, onLogout }) => {
  const [plants, setPlants] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const fetchPlants = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/plants?username=${username}`)
      const plantsWithOverdue = res.data.map(plant => {
        let overdue = false
        if (plant.lastWateredDate && plant.wateringFrequencyDays) {
          const lastWatered = new Date(plant.lastWateredDate)
          const nextWater = new Date(lastWatered)
          nextWater.setDate(lastWatered.getDate() + plant.wateringFrequencyDays)
          overdue = nextWater < new Date()
        }
        return { ...plant, overdue }
      })
      setPlants(plantsWithOverdue)
    } catch (err) {
      console.error('Error fetching plants:', err)
    }
  }

  useEffect(() => {
    fetchPlants()
  }, [])

  // Filter plants by search
  const filteredPlants = plants.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.species.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div>
      <h2>{username}'s Plants 🌱</h2>

      <button onClick={onLogout}>Logout</button>
      <button onClick={() => navigate('/add-plant')} style={{ marginLeft: '10px' }}>
        ➕ Add Plant
      </button>
      <button onClick={() => navigate('/community')} style={{ marginLeft: '10px' }}>
        🌍 Community
      </button>

      {/* 🔍 Search bar */}
      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Search plants..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            padding: '8px',
            width: '250px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
      </div>

      <PlantList plants={filteredPlants} username={username} onView={id => navigate(`/plants/${id}`)} onRefresh={fetchPlants} />
    </div>
  )
}

export default PlantDashboard
