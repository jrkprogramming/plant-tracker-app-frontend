import React, { useState } from 'react'
import axios from 'axios'

const AddPlant = ({ username, onPlantAdded }) => {
  const [name, setName] = useState('')
  const [species, setSpecies] = useState('')
  const [wateringFrequency, setWateringFrequency] = useState(7)
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
      // Reset form
      setName('')
      setSpecies('')
      setWateringFrequency(7)
      setSoilType('')
      setFertilizer('')
      setSunExposure('')
      setIdealTemperature('')
      setNotes('')
      onPlantAdded()
    } catch (err) {
      console.error('Error adding plant:', err)
    }
  }

  return (
    <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
      <input placeholder="Plant Name" value={name} onChange={e => setName(e.target.value)} required />
      <input placeholder="Species" value={species} onChange={e => setSpecies(e.target.value)} required />
      <input type="number" min={1} placeholder="Watering Frequency (days)" value={wateringFrequency} onChange={e => setWateringFrequency(e.target.value)} required />
      <input placeholder="Soil Type" value={soilType} onChange={e => setSoilType(e.target.value)} />
      <input placeholder="Fertilizer" value={fertilizer} onChange={e => setFertilizer(e.target.value)} />
      <input placeholder="Sun Exposure" value={sunExposure} onChange={e => setSunExposure(e.target.value)} />
      <input placeholder="Ideal Temperature" value={idealTemperature} onChange={e => setIdealTemperature(e.target.value)} />
      <textarea placeholder="Notes" value={notes} onChange={e => setNotes(e.target.value)} />

      <button type="submit">Add Plant</button>
    </form>
  )
}

export default AddPlant
