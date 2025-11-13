import React from 'react'

const PlantList = ({ plants, onView }) => {
  if (!plants.length) return <p>No plants yet. Add one!</p>

  return (
    <ul style={{ listStyleType: 'none', padding: 0 }}>
      {plants.map(plant => (
        <li
          key={plant._id}
          style={{
            marginBottom: '15px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '10px',
          }}
        >
          <div>
            <b>{plant.name}</b> ({plant.species})
          </div>

          <div>Last Watered: {plant.lastWateredDate || 'N/A'}</div>

          <button onClick={() => onView(plant.id)}>View Details</button>
        </li>
      ))}
    </ul>
  )
}

export default PlantList
