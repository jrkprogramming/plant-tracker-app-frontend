import React, { useState, useEffect } from 'react'

const EditPlant = ({ plant, onUpdate, onCancel }) => {
  const [name, setName] = useState('')
  const [species, setSpecies] = useState('')
  const [lastWateredDate, setLastWateredDate] = useState('')
  const [wateringFrequencyDays, setWateringFrequencyDays] = useState('')
  const [soilType, setSoilType] = useState('')
  const [fertilizer, setFertilizer] = useState('')
  const [sunExposure, setSunExposure] = useState('')
  const [idealTemperature, setIdealTemperature] = useState('')
  const [notes, setNotes] = useState('')

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
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Species" value={species} onChange={e => setSpecies(e.target.value)} />
      <input type="date" placeholder="Last Watered Date" value={lastWateredDate} onChange={e => setLastWateredDate(e.target.value)} />
      <input type="number" placeholder="Watering Frequency (days)" value={wateringFrequencyDays} onChange={e => setWateringFrequencyDays(e.target.value)} />
      <input placeholder="Soil Type" value={soilType} onChange={e => setSoilType(e.target.value)} />
      <input placeholder="Fertilizer" value={fertilizer} onChange={e => setFertilizer(e.target.value)} />
      <input placeholder="Sun Exposure" value={sunExposure} onChange={e => setSunExposure(e.target.value)} />
      <input placeholder="Ideal Temperature" value={idealTemperature} onChange={e => setIdealTemperature(e.target.value)} />
      <textarea placeholder="Notes" value={notes} onChange={e => setNotes(e.target.value)} />

      <div style={{ display: 'flex', gap: '10px' }}>
        <button type="submit">Update Plant</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default EditPlant
