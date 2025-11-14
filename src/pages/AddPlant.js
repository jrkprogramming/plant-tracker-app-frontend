import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AddPlant = ({ username }) => {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [species, setSpecies] = useState('')
  const [lastWateredDate, setLastWateredDate] = useState(new Date().toISOString().split('T')[0])
  const [wateringFrequency, setWateringFrequency] = useState('')
  const [soilType, setSoilType] = useState('')
  const [fertilizer, setFertilizer] = useState('')
  const [sunExposure, setSunExposure] = useState('')
  const [idealTemperature, setIdealTemperature] = useState('')
  const [notes, setNotes] = useState('')
  const [isPublic, setIsPublic] = useState(true) // NEW
  const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '4px' }

  const handleAdd = async e => {
    e.preventDefault()

    try {
      await axios.post('http://localhost:8080/api/plants', {
        name,
        species,
        lastWateredDate,
        wateringFrequencyDays: wateringFrequency,
        soilType,
        fertilizer,
        sunExposure,
        idealTemperature,
        notes,
        ownerUsername: username,
        public: isPublic, // IMPORTANT
      })

      navigate('/') // back to dashboard
    } catch (err) {
      console.error('Error adding plant:', err)
      alert('Failed to add plant. Try again.')
    }
  }

  return (
    <form
      onSubmit={handleAdd}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '400px',
        margin: 'auto',
        marginTop: '20px',
      }}
    >
      <h2>Add New Plant</h2>

      <label style={fieldStyle}>
        Plant Name
        <input value={name} onChange={e => setName(e.target.value)} required />
      </label>

      <label style={fieldStyle}>
        Species
        <input value={species} onChange={e => setSpecies(e.target.value)} required />
      </label>

      <label style={fieldStyle}>
        Last Watered Date
        <input type="date" value={lastWateredDate} onChange={e => setLastWateredDate(e.target.value)} required />
      </label>

      <label style={fieldStyle}>
        Watering Frequency (days)
        <input type="number" min={1} value={wateringFrequency} onChange={e => setWateringFrequency(e.target.value)} required />
      </label>

      <label style={fieldStyle}>
        Soil Type
        <input value={soilType} onChange={e => setSoilType(e.target.value)} />
      </label>

      <label style={fieldStyle}>
        Fertilizer
        <input value={fertilizer} onChange={e => setFertilizer(e.target.value)} />
      </label>

      <label style={fieldStyle}>
        Sun Exposure
        <input value={sunExposure} onChange={e => setSunExposure(e.target.value)} />
      </label>

      <label style={fieldStyle}>
        Ideal Temperature
        <input value={idealTemperature} onChange={e => setIdealTemperature(e.target.value)} />
      </label>

      <label style={fieldStyle}>
        Notes
        <textarea value={notes} onChange={e => setNotes(e.target.value)} />
      </label>

      <label style={fieldStyle}>
        Public
        <select value={isPublic.toString()} onChange={e => setIsPublic(e.target.value === 'true')}>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </label>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button type="submit">Add Plant</button>
        <button type="button" onClick={() => navigate('/')}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default AddPlant
