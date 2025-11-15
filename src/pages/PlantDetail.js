import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import EditPlant from '../components/EditPlant'

const PlantDetail = ({ username }) => {
  const { id: plantId } = useParams()
  const navigate = useNavigate()
  const [plant, setPlant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newLogText, setNewLogText] = useState('')
  const [newLogPhoto, setNewLogPhoto] = useState(null)
  const [newCommentText, setNewCommentText] = useState({})
  const [editing, setEditing] = useState(false)
  const [openComments, setOpenComments] = useState({})
  const [addingLog, setAddingLog] = useState(false)
  const logPhotoInputRef = useRef(null)

  const normalizePlant = plantData => ({
    ...plantData,
    isPublic: typeof plantData.isPublic === 'boolean' ? plantData.isPublic : Boolean(plantData.public),
  })

  const fetchPlant = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`http://localhost:8080/api/plants/${plantId}?username=${username}`)
      setPlant(normalizePlant(res.data))
    } catch (err) {
      console.error('Error fetching plant:', err)
      setPlant(null)
    } finally {
      setLoading(false)
    }
  }

  // Uploads the optional log photo to the backend, preferring log-specific endpoint with fallback.
  const uploadLogPhoto = async file => {
    const tryUpload = async url => {
      const formData = new FormData()
      formData.append('file', file)
      const res = await axios.post(url, formData)
      return res.data
    }

    try {
      return await tryUpload(`http://localhost:8080/api/plants/${plantId}/logs/upload?username=${encodeURIComponent(username)}`)
    } catch (err) {
      const status = err?.response?.status
      if (status !== 404 && status !== 405) throw err
      console.warn('Log upload endpoint unavailable, falling back to generic upload route.', status)
      return await tryUpload(`http://localhost:8080/api/plants/${plantId}/upload`)
    }
  }

  useEffect(() => {
    fetchPlant()
  }, [plantId])

  const isOwner = plant && username === plant.ownerUsername

  const updatePlant = async (id, updatedData) => {
    try {
      await axios.put(`http://localhost:8080/api/plants/${id}?username=${username}`, updatedData)
      setEditing(false)
      fetchPlant()
    } catch {
      alert('Failed to update plant')
    }
  }

  const deletePlant = async () => {
    if (!window.confirm('Are you sure?')) return

    try {
      await axios.delete(`http://localhost:8080/api/plants/${plantId}?username=${username}`)
      navigate('/dashboard')
    } catch {
      alert('Delete failed')
    }
  }

  const waterPlant = async () => {
    if (!plant) return

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
  }

  const addLog = async () => {
    if (!newLogText.trim()) {
      alert('Please add a note for this log.')
      return
    }
    setAddingLog(true)

    try {
      let photoUrl = ''
      if (newLogPhoto) {
        photoUrl = await uploadLogPhoto(newLogPhoto)
      }

      const payload = { note: newLogText }
      if (photoUrl) payload.photoUrl = photoUrl

      await axios.post(`http://localhost:8080/api/plants/${plantId}/logs?username=${username}`, payload)
      setNewLogText('')
      setNewLogPhoto(null)
      if (logPhotoInputRef.current) logPhotoInputRef.current.value = ''
      fetchPlant()
    } catch (err) {
      console.error('Error adding log:', err)
      alert('Failed to add log. Try again.')
    } finally {
      setAddingLog(false)
    }
  }

  const addComment = async logIndex => {
    const text = newCommentText[logIndex]
    if (!text || !text.trim()) return

    await axios.post(`http://localhost:8080/api/plants/${plantId}/logs/${logIndex}/comments?username=${username}`, { comment: text, username })

    const copy = { ...newCommentText }
    delete copy[logIndex]
    setNewCommentText(copy)

    fetchPlant()
  }

  const deleteLog = async logIndex => {
    await axios.delete(`http://localhost:8080/api/plants/${plantId}/logs/${logIndex}?username=${username}`)
    fetchPlant()
  }

  if (loading) return <p>Loading...</p>
  if (!plant) return <p>Plant not found</p>

  // Water schedule
  let nextWaterDate = 'N/A'
  let overdue = false
  if (plant.lastWateredDate && plant.wateringFrequencyDays) {
    const lastWater = new Date(plant.lastWateredDate)
    const next = new Date(lastWater)
    next.setDate(lastWater.getDate() + plant.wateringFrequencyDays)
    nextWaterDate = next.toLocaleDateString()
    overdue = new Date() > next
  }

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <button onClick={() => navigate(-1)}>← Back</button>

      {/* READ ONLY MODE BANNER */}
      {!isOwner && (
        <div style={{ background: '#eef', padding: '10px', margin: '10px 0', borderRadius: 6 }}>
          Viewing public plant — <b>read-only mode</b>
        </div>
      )}

      {!editing ? (
        <>
          <h2>
            {plant.name} ({plant.species})
          </h2>

          {/* OWNER-ONLY BUTTONS */}
          {isOwner && (
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
                  borderRadius: '6px',
                }}
              >
                Delete Plant
              </button>
            </div>
          )}

          <p>
            <b>Last Watered:</b> {plant.lastWateredDate}
          </p>
          <p>
            <b>Next Water:</b> {nextWaterDate}
          </p>
          <p>
            <b>Frequency:</b> {plant.wateringFrequencyDays} days
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

          {isOwner && (
            <p>
              <b>Public:</b> {plant.isPublic ? 'True' : 'False'}
            </p>
          )}

          <p>
            <b>Notes:</b> {plant.notes || 'N/A'}
          </p>
        </>
      ) : (
        <EditPlant plant={plant} onUpdate={updatePlant} onCancel={() => setEditing(false)} />
      )}

      {/* ADD LOG — OWNER ONLY */}
      {isOwner && (
        <>
          <h4>Add New Log</h4>
          <textarea value={newLogText} onChange={e => setNewLogText(e.target.value)} />
          <input
            type="file"
            accept="image/*"
            ref={logPhotoInputRef}
            onChange={e => setNewLogPhoto(e.target.files?.[0] || null)}
            style={{ marginTop: 8 }}
          />
          {newLogPhoto && <small>Selected: {newLogPhoto.name}</small>}
          <button onClick={addLog} disabled={addingLog} style={{ marginTop: 8 }}>
            {addingLog ? 'Saving...' : 'Add Log'}
          </button>
        </>
      )}

      <hr />
      <h3>Logs</h3>

      {plant.logs?.length ? (
        <ul>
          {[...plant.logs]
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map((log, idx) => {
              const realIndex = plant.logs.indexOf(log)
              const commentCount = log.comments?.length || 0

              return (
                <li key={realIndex} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 15 }}>
                  <p>{log.note}</p>
                  {log.photoUrl && (
                    <img
                      src={log.photoUrl}
                      alt="Plant log attachment"
                      style={{ width: '100%', maxHeight: 250, objectFit: 'cover', borderRadius: 8, margin: '10px 0' }}
                    />
                  )}
                  <p>
                    <i>{new Date(log.timestamp).toLocaleString()}</i>
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      onClick={() =>
                        setOpenComments(prev => ({
                          ...prev,
                          [realIndex]: !prev[realIndex],
                        }))
                      }
                    >
                      {openComments[realIndex] ? 'Hide Comments' : 'Show Comments'}
                    </button>
                    <span>({commentCount})</span>
                  </div>

                  {openComments[realIndex] && (
                    <>
                      {log.comments?.length ? (
                        <ul>
                          {log.comments.map((c, i) => (
                            <li key={i}>
                              <b>{c.username}</b>: {c.comment} ({new Date(c.timestamp).toLocaleString()})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No comments</p>
                      )}
                    </>
                  )}

                  <hr />

                  {/* ADD COMMENT — OWNER ONLY */}
                  {isOwner && (
                    <>
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
                            style={{ width: '100%', marginTop: 8 }}
                            value={newCommentText[realIndex]}
                            onChange={e =>
                              setNewCommentText(prev => ({
                                ...prev,
                                [realIndex]: e.target.value,
                              }))
                            }
                          />
                          <button onClick={() => addComment(realIndex)}>Submit</button>
                          <button
                            onClick={() => {
                              const copy = { ...newCommentText }
                              delete copy[realIndex]
                              setNewCommentText(copy)
                            }}
                            style={{ color: 'red', marginLeft: 10 }}
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      <button onClick={() => deleteLog(realIndex)} style={{ color: 'red', marginLeft: 10 }}>
                        Delete Log
                      </button>
                    </>
                  )}
                </li>
              )
            })}
        </ul>
      ) : (
        <p>No logs yet.</p>
      )}
    </div>
  )
}

export default PlantDetail
