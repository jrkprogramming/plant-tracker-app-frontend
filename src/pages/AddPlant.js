import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AddPlant = ({ username }) => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [species, setSpecies] = useState('')
  const [wateringFrequency, setWateringFrequency] = useState()
  const [soilType, setSoilType] = useState('')
  const [fertilizer, setFertilizer] = useState('')
  const [sunExposure, setSunExposure] = useState('')
  const [idealTemperature, setIdealTemperature] = useState('')
  const [notes, setNotes] = useState('')

  const handleAdd = async e => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:8080/api/plants', {
        name,
        species,
        lastWateredDate: new Date().toISOString().split('T')[0],
        wateringFrequencyDays: wateringFrequency,
        soilType,
        fertilizer,
        sunExposure,
        idealTemperature,
        notes,
        ownerUsername: username,
      })

      navigate('/') // Redirect back to dashboard
    } catch (err) {
      console.error('Error adding plant:', err)
      alert('Failed to add plant. Try again.')
    }
  }

  return (
    <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', margin: 'auto', marginTop: '20px' }}>
      <h2>Add New Plant</h2>
      <input placeholder="Plant Name" value={name} onChange={e => setName(e.target.value)} required />
      <input placeholder="Species" value={species} onChange={e => setSpecies(e.target.value)} required />
      <input type="number" min={1} placeholder="Watering Frequency (days)" value={wateringFrequency} onChange={e => setWateringFrequency(e.target.value)} required />
      <input placeholder="Soil Type" value={soilType} onChange={e => setSoilType(e.target.value)} />
      <input placeholder="Fertilizer" value={fertilizer} onChange={e => setFertilizer(e.target.value)} />
      <input placeholder="Sun Exposure" value={sunExposure} onChange={e => setSunExposure(e.target.value)} />
      <input placeholder="Ideal Temperature" value={idealTemperature} onChange={e => setIdealTemperature(e.target.value)} />
      <textarea placeholder="Notes" value={notes} onChange={e => setNotes(e.target.value)} />
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
