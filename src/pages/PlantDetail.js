import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import EditPlant from '../components/EditPlant'

const PlantDetails = ({ username }) => {
  const { id: plantId } = useParams()
  const navigate = useNavigate()
  const [plant, setPlant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newLogText, setNewLogText] = useState('')
  const [newCommentText, setNewCommentText] = useState({})
  const [editing, setEditing] = useState(false)

  // Fetch plant details
  const fetchPlant = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`http://localhost:8080/api/plants/${plantId}?username=${username}`)
      setPlant(res.data)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching plant:', err)
      setPlant(null)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlant()
  }, [plantId])

  // Update plant
  const updatePlant = async (id, updatedData) => {
    try {
      await axios.put(`http://localhost:8080/api/plants/${id}?username=${username}`, updatedData)
      setEditing(false)
      fetchPlant()
    } catch (err) {
      console.error('Error updating plant:', err)
      alert('Failed to update plant.')
    }
  }

  // Water plant (update lastWateredDate to today)
  const waterPlant = async () => {
    if (!plant) return
    try {
      const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
      await axios.put(`http://localhost:8080/api/plants/${plantId}?username=${username}`, {
        ...plant,
        lastWateredDate: today,
      })
      fetchPlant()
    } catch (err) {
      console.error('Error watering plant:', err)
      alert('Failed to water plant.')
    }
  }

  // Add log
  const addLog = async () => {
    if (!newLogText.trim()) return
    try {
      await axios.post(`http://localhost:8080/api/plants/${plantId}/logs?username=${username}`, {
        note: newLogText,
      })
      setNewLogText('')
      fetchPlant()
    } catch (err) {
      console.error('Add log error:', err)
    }
  }

  // Add comment
  const addComment = async logIndex => {
    const text = newCommentText[logIndex]
    if (!text || !text.trim()) return
    try {
      await axios.post(`http://localhost:8080/api/plants/${plantId}/logs/${logIndex}/comments?username=${username}`, {
        comment: text,
        username,
      })
      setNewCommentText(prev => ({ ...prev, [logIndex]: '' }))
      fetchPlant()
    } catch (err) {
      console.error('Add comment error:', err)
    }
  }

  // Delete log
  const deleteLog = async logIndex => {
    try {
      await axios.delete(`http://localhost:8080/api/plants/${plantId}/logs/${logIndex}?username=${username}`)
      fetchPlant()
    } catch (err) {
      console.error('Delete log error:', err)
    }
  }

  if (loading) return <p>Loading...</p>
  if (!plant) return <p>Plant not found</p>

  // Determine if watering is overdue
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
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <button onClick={() => navigate(-1)}>← Back</button>

      {!editing ? (
        <>
          <h2>
            {plant.name} ({plant.species})
          </h2>
          <button onClick={() => setEditing(true)} style={{ marginRight: '10px' }}>
            Edit Plant
          </button>
          <button onClick={waterPlant} style={{ color: 'blue' }}>
            Water Plant {overdue && '⚠️'}
          </button>

          <p>
            <b>Last Watered:</b> {plant.lastWateredDate || 'N/A'}
          </p>
          <p>
            <b>Next Water:</b> {nextWaterDate}
          </p>
          <p>
            <b>Watering Frequency:</b> {plant.wateringFrequencyDays} days
          </p>
          {plant.soilType && (
            <p>
              <b>Soil Type:</b> {plant.soilType}
            </p>
          )}
          {plant.fertilizer && (
            <p>
              <b>Fertilizer:</b> {plant.fertilizer}
            </p>
          )}
          {plant.sunExposure && (
            <p>
              <b>Sun Exposure:</b> {plant.sunExposure}
            </p>
          )}
          {plant.idealTemperature && (
            <p>
              <b>Ideal Temp:</b> {plant.idealTemperature}
            </p>
          )}
          {plant.notes && (
            <p>
              <b>Notes:</b> {plant.notes}
            </p>
          )}
        </>
      ) : (
        <EditPlant plant={plant} onUpdate={updatePlant} onCancel={() => setEditing(false)} />
      )}

      <hr />
      <h3>Logs</h3>
      {plant.logs && plant.logs.length > 0 ? (
        <ul>
          {plant.logs.map((log, index) => (
            <li key={index} style={{ marginBottom: '15px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
              <p>{log.note || 'No note'}</p>
              <p>
                <i>{new Date(log.timestamp).toLocaleString()}</i>
              </p>

              {log.comments && log.comments.length > 0 && (
                <ul>
                  {log.comments.map((c, i) => (
                    <li key={i}>
                      {c.username}: {c.comment || 'No comment'} <i>({new Date(c.timestamp).toLocaleString()})</i>
                    </li>
                  ))}
                </ul>
              )}

              <input type="text" placeholder="Add comment" value={newCommentText[index] || ''} onChange={e => setNewCommentText(prev => ({ ...prev, [index]: e.target.value }))} />
              <button onClick={() => addComment(index)}>Add Comment</button>
              <button onClick={() => deleteLog(index)} style={{ marginLeft: '10px', color: 'red' }}>
                Delete Log
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No logs yet.</p>
      )}

      <hr />
      <h4>Add New Log</h4>
      <textarea placeholder="Log note" value={newLogText} onChange={e => setNewLogText(e.target.value)} />
      <button onClick={addLog}>Add Log</button>
    </div>
  )
}

export default PlantDetails
