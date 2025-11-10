import React, { useState, useEffect } from 'react'

const EditPlant = ({ plant, onUpdate }) => {
  const [name, setName] = useState('')
  const [species, setSpecies] = useState('')
  const [lastWateredDate, setLastWateredDate] = useState('')
  const [wateringFrequencyDays, setWateringFrequencyDays] = useState('')
  const [soilType, setSoilType] = useState('')
  const [fertilizer, setFertilizer] = useState('')
  const [sunExposure, setSunExposure] = useState('')
  const [idealTemperature, setIdealTemperature] = useState('')
  const [notes, setNotes] = useState('')

  // Initialize form fields when plant prop changes
  useEffect(() => {
    if (plant) {
      setName(plant.name || '')
      setSpecies(plant.species || '')
      setLastWateredDate(plant.lastWateredDate || '')
      setWateringFrequencyDays(plant.wateringFrequencyDays || '')
      setSoilType(plant.soilType || '')
      setFertilizer(plant.fertilizer || '')
      setSunExposure(plant.sunExposure || '')
      setIdealTemperature(plant.idealTemperature || '')
      setNotes(plant.notes || '')
    }
  }, [plant])

  const handleSubmit = e => {
    e.preventDefault()
    const id = plant._id || plant.id
    if (!id) {
      console.error('Cannot update plant: id is undefined')
      return
    }
    onUpdate(id, {
      name,
      species,
      lastWateredDate,
      wateringFrequencyDays,
      soilType,
      fertilizer,
      sunExposure,
      idealTemperature,
      notes,
    })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
      <div>
        <label>Name:</label>
        <input value={name} onChange={e => setName(e.target.value)} />
      </div>

      <div>
        <label>Species:</label>
        <input value={species} onChange={e => setSpecies(e.target.value)} />
      </div>

      <div>
        <label>Last Watered Date:</label>
        <input type="date" value={lastWateredDate} onChange={e => setLastWateredDate(e.target.value)} />
      </div>

      <div>
        <label>Watering Frequency (days):</label>
        <input type="number" value={wateringFrequencyDays} onChange={e => setWateringFrequencyDays(e.target.value)} />
      </div>

      <div>
        <label>Soil Type:</label>
        <input value={soilType} onChange={e => setSoilType(e.target.value)} />
      </div>

      <div>
        <label>Fertilizer:</label>
        <input value={fertilizer} onChange={e => setFertilizer(e.target.value)} />
      </div>

      <div>
        <label>Sun Exposure:</label>
        <input value={sunExposure} onChange={e => setSunExposure(e.target.value)} />
      </div>

      <div>
        <label>Ideal Temperature:</label>
        <input value={idealTemperature} onChange={e => setIdealTemperature(e.target.value)} />
      </div>

      <div>
        <label>Notes:</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} />
      </div>

      <button type="submit">Update Plant</button>
    </form>
  )
}

export default EditPlant
