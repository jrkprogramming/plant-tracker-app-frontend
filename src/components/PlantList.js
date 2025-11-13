import React, { useState } from 'react'
import EditPlant from './EditPlant'

const PlantList = ({ plants, onWater, onDelete, onUpdate, onAddLog, onAddComment, onDeleteLog }) => {
  const [editingPlantId, setEditingPlantId] = useState(null)
  const [newLogNote, setNewLogNote] = useState('')
  const [newComment, setNewComment] = useState('')

  if (!plants.length) return <p>No plants yet. Add one!</p>

  const isOverdue = (lastWateredDate, wateringFrequencyDays) => {
    if (!lastWateredDate || !wateringFrequencyDays) return false
    const last = new Date(lastWateredDate)
    const nextDue = new Date(last)
    nextDue.setDate(last.getDate() + wateringFrequencyDays)
    return new Date() > nextDue
  }

  const daysUntilNextWatering = (lastWateredDate, wateringFrequencyDays) => {
    if (!lastWateredDate || !wateringFrequencyDays) return null
    const last = new Date(lastWateredDate)
    const nextDue = new Date(last)
    nextDue.setDate(last.getDate() + wateringFrequencyDays)
    const diff = Math.ceil((nextDue - new Date()) / (1000 * 60 * 60 * 24))
    return diff
  }

  return (
    <ul style={{ listStyleType: 'none', padding: 0 }}>
      {plants.map(plant => {
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
            <div>
              <b>{plant.name}</b> ({plant.species})
            </div>
            <div>
              Last Watered: {plant.lastWateredDate || 'N/A'} | Next Water Date:{' '}
              {plant.lastWateredDate ? new Date(new Date(plant.lastWateredDate).getTime() + plant.wateringFrequencyDays * 24 * 60 * 60 * 1000).toLocaleDateString() : 'N/A'}
            </div>
            <div>Watering Frequency: {plant.wateringFrequencyDays} days</div>

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
              <button onClick={() => onDelete(plant._id)}>Delete</button>
              <button onClick={() => setEditingPlantId(plant._id)}>Edit</button>
            </div>

            {editingPlantId === plant._id && (
              <EditPlant
                plant={plant}
                onUpdate={(id, data) => {
                  onUpdate(id, data)
                  setEditingPlantId(null)
                }}
              />
            )}

            {/* Logs */}
            <div style={{ marginTop: '10px' }}>
              <h4>Logs:</h4>
              {plant.logs &&
                plant.logs.map((log, index) => (
                  <div key={index} style={{ borderTop: '1px solid #ccc', marginTop: '5px', paddingTop: '5px' }}>
                    <img src={log.photoUrl} alt="log" width={100} />
                    <div>{log.note}</div>
                    <div>{new Date(log.timestamp).toLocaleString()}</div>

                    {/* Comments */}
                    {log.comments &&
                      log.comments.map((c, i) => (
                        <div key={i} style={{ marginLeft: '10px', fontStyle: 'italic' }}>
                          {c.username}: {c.comment}
                        </div>
                      ))}

                    {/* Add comment */}
                    <input placeholder="Add comment" value={newComment} onChange={e => setNewComment(e.target.value)} />
                    <button
                      onClick={() => {
                        onAddComment(plant.id, index, { username: 'Me', comment: newComment })
                        setNewComment('')
                      }}
                    >
                      Add Comment
                    </button>

                    <button onClick={() => onDeleteLog(plant.id, index)}>Delete Log</button>
                  </div>
                ))}

              {/* Add log */}
              <input placeholder="New log note" value={newLogNote} onChange={e => setNewLogNote(e.target.value)} />
              <button
                onClick={() => {
                  onAddLog(plant.id, { note: newLogNote, photoUrl: '' })
                  setNewLogNote('')
                }}
              >
                Add Log
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default PlantList
