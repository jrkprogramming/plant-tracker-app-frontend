import React from 'react'
import axios from 'axios'

const PlantList = ({ plants, username, onView, onRefresh }) => {
  if (!plants.length) return <p>No plants yet. Add one!</p>

  // Water a single plant
  const waterPlant = async plant => {
    try {
      const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

      // Make a full copy of the plant with updated lastWateredDate
      const updatedPlant = {
        ...plant,
        lastWateredDate: today,
        logs: plant.logs || [], // preserve logs
      }

      const plantId = plant.id || plant._id
      await axios.put(`http://localhost:8080/api/plants/${plantId}?username=${username}`, updatedPlant)
      onRefresh()
    } catch (err) {
      console.error('Error watering plant:', err)
      alert('Failed to water plant. Try again.')
    }
  }

  return (
    <ul style={{ listStyleType: 'none', padding: 0 }}>
      {plants.map(plant => {
        const plantId = plant.id || plant._id

        // Calculate next water date
        let nextWaterDate = 'N/A'
        let overdue = false
        if (plant.lastWateredDate && plant.wateringFrequencyDays) {
          const lastWatered = new Date(plant.lastWateredDate)
          const nextWater = new Date(lastWatered)
          nextWater.setDate(lastWatered.getDate() + plant.wateringFrequencyDays)
          nextWaterDate = nextWater.toLocaleDateString()
          overdue = new Date() > nextWater
        }

        return (
          <li
            key={plantId}
            style={{
              marginBottom: '15px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '10px',
              backgroundColor: overdue ? '#ffe6e6' : 'white', // light red if overdue
            }}
          >
            <div>
              <b>{plant.name}</b> ({plant.species}) {overdue && <span style={{ color: 'red', fontWeight: 'bold' }}>⚠️ Needs Watering!</span>}
            </div>

            <div>Last Watered: {plant.lastWateredDate || 'N/A'}</div>
            <div>Next Water: {nextWaterDate}</div>

            <button onClick={() => onView(plantId)} style={{ marginRight: '10px' }}>
              View Details
            </button>
            <button onClick={() => waterPlant(plant)} style={{ color: 'blue' }}>
              Water
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default PlantList
