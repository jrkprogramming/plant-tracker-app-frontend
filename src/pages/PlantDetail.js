import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import EditPlant from '../components/EditPlant'

const PlantDetail = ({ username }) => {
  const { id: plantId } = useParams()
  const navigate = useNavigate()
  const [plant, setPlant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newLogText, setNewLogText] = useState('')
  const [newCommentText, setNewCommentText] = useState({})
  const [editing, setEditing] = useState(false)

  // Controls showing comments
  const [openComments, setOpenComments] = useState({})

  const normalizePlant = plantData => ({
    ...plantData,
    isPublic: typeof plantData.isPublic === 'boolean' ? plantData.isPublic : Boolean(plantData.public),
  })

  // Fetch plant details
  const fetchPlant = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`http://localhost:8080/api/plants/${plantId}?username=${username}`)
      setPlant(normalizePlant(res.data))
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

  // Delete plant
  const deletePlant = async () => {
    if (!window.confirm('Are you sure you want to delete this plant?')) return

    try {
      await axios.delete(`http://localhost:8080/api/plants/${plantId}?username=${username}`)
      navigate('/dashboard')
    } catch (err) {
      console.error('Error deleting plant:', err)
      alert('Failed to delete plant.')
    }
  }

  // Water plant
  const waterPlant = async () => {
    if (!plant) return

    try {
      const today = new Date().toISOString().split('T')[0]

      const payload = {
        name: plant.name,
        species: plant.species,
        lastWateredDate: today,
        wateringFrequencyDays: plant.wateringFrequencyDays,
        soilType: plant.soilType,
        fertilizer: plant.fertilizer,
        sunExposure: plant.sunExposure,
        idealTemperature: plant.idealTemperature,
        notes: plant.notes,
        public: plant.isPublic,
      }

      await axios.put(`http://localhost:8080/api/plants/${plantId}?username=${username}`, payload)
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
      await axios.post(`http://localhost:8080/api/plants/${plantId}/logs?username=${username}`, { note: newLogText })
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
      await axios.post(`http://localhost:8080/api/plants/${plantId}/logs/${logIndex}/comments?username=${username}`, { comment: text, username })

      // Reset input
      setNewCommentText(prev => {
        const copy = { ...prev }
        delete copy[logIndex]
        return copy
      })

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

  // Determine next watering date
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

          {/* ACTION BUTTONS */}
          <div style={{ marginBottom: '15px' }}>
            <button onClick={() => setEditing(true)} style={{ marginRight: '10px' }}>
              Edit Plant
            </button>

            <button onClick={waterPlant} style={{ marginRight: '10px', color: 'blue' }}>
              Water Plant {overdue && '⚠️'}
            </button>

            <button
              onClick={deletePlant}
              style={{
                background: 'red',
                color: 'white',
                padding: '6px 10px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Delete Plant
            </button>
          </div>

          <p>
            <b>Last Watered:</b> {plant.lastWateredDate}
          </p>
          <p>
            <b>Next Water:</b> {nextWaterDate}
          </p>
          <p>
            <b>Watering Frequency:</b> {plant.wateringFrequencyDays} days
          </p>

          <p>
            <b>Soil Type:</b> {plant.soilType || 'N/A'}
          </p>
          <p>
            <b>Fertilizer:</b> {plant.fertilizer || 'N/A'}
          </p>
          <p>
            <b>Sun Exposure:</b> {plant.sunExposure || 'N/A'}
          </p>
          <p>
            <b>Ideal Temp:</b> {plant.idealTemperature || 'N/A'}
          </p>

          <p>
            <b>Public:</b> {plant.isPublic ? 'True' : 'False'}
          </p>

          <p>
            <b>Notes:</b> {plant.notes || 'N/A'}
          </p>
        </>
      ) : (
        <EditPlant plant={plant} onUpdate={updatePlant} onCancel={() => setEditing(false)} />
      )}

      <hr />
      <h3>Logs</h3>

      {plant.logs && plant.logs.length > 0 ? (
        <ul>
          {[...plant.logs]
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map((log, index) => {
              const realIndex = plant.logs.indexOf(log)

              return (
                <li
                  key={realIndex}
                  style={{
                    marginBottom: '15px',
                    border: '1px solid #ccc',
                    padding: '10px',
                    borderRadius: '5px',
                  }}
                >
                  <p>{log.note}</p>
                  <p>
                    <i>{new Date(log.timestamp).toLocaleString()}</i>
                  </p>

                  {/* SHOW/HIDE COMMENTS */}
                  <button
                    onClick={() =>
                      setOpenComments(prev => ({
                        ...prev,
                        [realIndex]: !prev[realIndex],
                      }))
                    }
                    style={{ marginBottom: '10px' }}
                  >
                    {openComments[realIndex] ? 'Hide Comments' : 'Show Comments'}
                  </button>

                  {/* COMMENTS */}
                  {openComments[realIndex] && (
                    <>
                      {log.comments && log.comments.length > 0 ? (
                        <ul>
                          {log.comments.map((c, i) => (
                            <li key={i}>
                              <b>{c.username}</b>: {c.comment} <i>({new Date(c.timestamp).toLocaleString()})</i>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No comments yet.</p>
                      )}
                    </>
                  )}

                  <hr />

                  {/* ADD COMMENT BUTTON → SHOW INPUT */}
                  {!newCommentText.hasOwnProperty(realIndex) ? (
                    <button
                      onClick={() =>
                        setNewCommentText(prev => ({
                          ...prev,
                          [realIndex]: '',
                        }))
                      }
                    >
                      Add Comment
                    </button>
                  ) : (
                    <>
                      <input
                        type="text"
                        placeholder="Write your comment..."
                        value={newCommentText[realIndex]}
                        onChange={e =>
                          setNewCommentText(prev => ({
                            ...prev,
                            [realIndex]: e.target.value,
                          }))
                        }
                        style={{ marginTop: '10px', width: '100%' }}
                      />

                      <button onClick={() => addComment(realIndex)}>Submit</button>

                      <button
                        onClick={() => {
                          const copy = { ...newCommentText }
                          delete copy[realIndex]
                          setNewCommentText(copy)
                        }}
                        style={{ marginLeft: '10px', color: 'red' }}
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {/* DELETE LOG */}
                  <button onClick={() => deleteLog(realIndex)} style={{ marginLeft: '10px', color: 'red' }}>
                    Delete Log
                  </button>
                </li>
              )
            })}
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

export default PlantDetail
