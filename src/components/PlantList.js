import React, { useState } from 'react'
import EditPlant from './EditPlant'

const PlantList = ({ plants, onWater, onDelete, onUpdate }) => {
  const [editingPlantId, setEditingPlantId] = useState(null)

  if (!plants.length) return <p>No plants yet. Add one!</p>

  // Helper function: check if plant is overdue
  const isOverdue = (lastWateredDate, wateringFrequencyDays) => {
    if (!lastWateredDate || !wateringFrequencyDays) return false
    const last = new Date(lastWateredDate)
    const nextDue = new Date(last)
    nextDue.setDate(last.getDate() + wateringFrequencyDays)
    return new Date() > nextDue
  }

  // Helper function: days until next watering
  const daysUntilNextWatering = (lastWateredDate, wateringFrequencyDays) => {
    if (!lastWateredDate || !wateringFrequencyDays) return null
    const last = new Date(lastWateredDate)
    const nextDue = new Date(last)
    nextDue.setDate(last.getDate() + wateringFrequencyDays)
    const diff = Math.ceil((nextDue - new Date()) / (1000 * 60 * 60 * 24))
    return diff
  }

  // Sort overdue plants first
  const sortedPlants = [...plants].sort((a, b) => {
    const aOverdue = isOverdue(a.lastWateredDate, a.wateringFrequencyDays)
    const bOverdue = isOverdue(b.lastWateredDate, b.wateringFrequencyDays)
    return bOverdue - aOverdue
  })

  return (
    <ul style={{ listStyleType: 'none', padding: 0 }}>
      {sortedPlants.map(plant => {
        const overdue = isOverdue(plant.lastWateredDate, plant.wateringFrequencyDays)
        const daysLeft = daysUntilNextWatering(plant.lastWateredDate, plant.wateringFrequencyDays)

        return (
          <li
            key={plant._id}
            style={{
              marginBottom: '15px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '10px',
              backgroundColor: overdue ? '#ffe6e6' : '#e6ffe6',
            }}
          >
            <div style={{ marginBottom: '8px' }}>
              <b>{plant.name}</b> ({plant.species})
            </div>

            <div>
              Last Watered: {plant.lastWateredDate || 'N/A'} | Next Water Date:{' '}
              {plant.lastWateredDate ? new Date(new Date(plant.lastWateredDate).getTime() + plant.wateringFrequencyDays * 24 * 60 * 60 * 1000).toLocaleDateString() : 'N/A'}
            </div>

            <div>Watering Frequency: {plant.wateringFrequencyDays} days</div>

            {/* New optional info fields */}
            <div style={{ marginTop: '8px', fontSize: '0.9em' }}>
              {plant.soilType && (
                <div>
                  <b>Soil Type:</b> {plant.soilType}
                </div>
              )}
              {plant.fertilizer && (
                <div>
                  <b>Fertilizer:</b> {plant.fertilizer}
                </div>
              )}
              {plant.sunExposure && (
                <div>
                  <b>Sun Exposure:</b> {plant.sunExposure}
                </div>
              )}
              {plant.idealTemperature && (
                <div>
                  <b>Ideal Temp:</b> {plant.idealTemperature}
                </div>
              )}
              {plant.notes && (
                <div>
                  <b>Notes:</b> {plant.notes}
                </div>
              )}
            </div>

            <div style={{ marginTop: '6px', fontWeight: 'bold' }}>
              {overdue ? (
                <span style={{ color: 'red' }}>💧 Needs Watering!</span>
              ) : (
                <span style={{ color: 'green' }}>
                  ✅ Next watering in {daysLeft} day{daysLeft !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            <div style={{ marginTop: '10px' }}>
              <button onClick={() => onWater(plant)}>Water</button>
              <button onClick={() => onDelete(plant.id)}>Delete</button>
              <button onClick={() => setEditingPlantId(plant._id)}>Edit</button>
            </div>

            {editingPlantId === plant._id && (
              <EditPlant
                plant={plant}
                onUpdate={(id, updatedData) => {
                  onUpdate(id, updatedData)
                  setEditingPlantId(null)
                }}
                onCancel={() => setEditingPlantId(null)}
              />
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default PlantList
