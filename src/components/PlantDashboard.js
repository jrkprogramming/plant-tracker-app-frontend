import React, { useEffect, useState } from 'react'
import axios from 'axios'
import AddPlant from './AddPlant'
import PlantList from './PlantList'
import { useNavigate } from 'react-router-dom'

const PlantDashboard = ({ username, onLogout }) => {
  const [plants, setPlants] = useState([])
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
          overdue = nextWater < new Date() // If next water date is in the past
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

  return (
    <div>
      <h2>{username}'s Plants 🌱</h2>
      <button onClick={onLogout}>Logout</button>
      <AddPlant username={username} onPlantAdded={fetchPlants} />
      <PlantList plants={plants} username={username} onView={id => navigate(`/plants/${id}`)} onRefresh={fetchPlants} />
    </div>
  )
}

export default PlantDashboard
