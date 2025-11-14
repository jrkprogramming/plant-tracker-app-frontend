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
  const [isPublic, setIsPublic] = useState(true)
  const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '4px' }

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

      // Prefer the backend's "public" field, fall back to "isPublic" if present
      if (typeof plant.public === 'boolean') {
        setIsPublic(plant.public)
      } else if (typeof plant.isPublic === 'boolean') {
        setIsPublic(plant.isPublic)
      } else {
        // default if neither is present
        setIsPublic(true)
      }
    }
  }, [plant])

  const handleSubmit = e => {
    e.preventDefault()

    const id = plant._id || plant.id
    if (!id) {
      console.error('Missing ID on update')
      return
    }

    // Backend expects `public`
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
      public: isPublic,
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginTop: '10px',
        border: '1px solid #ddd',
        padding: '10px',
        borderRadius: '8px',
      }}
    >
      <label style={fieldStyle}>
        Name
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label style={fieldStyle}>
        Species
        <input value={species} onChange={e => setSpecies(e.target.value)} />
      </label>
      <label style={fieldStyle}>
        Last Watered Date
        <input type="date" value={lastWateredDate} onChange={e => setLastWateredDate(e.target.value)} />
      </label>
      <label style={fieldStyle}>
        Watering Frequency (days)
        <input type="number" value={wateringFrequencyDays} onChange={e => setWateringFrequencyDays(e.target.value)} />
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

      <button type="submit">Update Plant</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  )
}

export default EditPlant
