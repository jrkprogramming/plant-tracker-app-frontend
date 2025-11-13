import React, { useState, useEffect } from 'react'

const EditPlant = ({ plant, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    lastWateredDate: '',
    wateringFrequencyDays: '',
    soilType: '',
    fertilizer: '',
    sunExposure: '',
    idealTemperature: '',
    notes: '',
  })

  useEffect(() => {
    if (plant) {
      setFormData({
        name: plant.name || '',
        species: plant.species || '',
        lastWateredDate: plant.lastWateredDate || '',
        wateringFrequencyDays: plant.wateringFrequencyDays || '',
        soilType: plant.soilType || '',
        fertilizer: plant.fertilizer || '',
        sunExposure: plant.sunExposure || '',
        idealTemperature: plant.idealTemperature || '',
        notes: plant.notes || '',
      })
    }
  }, [plant])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    const id = plant?.id || plant?._id
    if (!id) {
      console.error('Cannot update plant: id is undefined')
      return
    }
    onUpdate(id, formData)
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
        backgroundColor: '#f9f9f9',
      }}
    >
      {[
        { label: 'Name', name: 'name' },
        { label: 'Species', name: 'species' },
        { label: 'Last Watered Date', name: 'lastWateredDate', type: 'date' },
        { label: 'Watering Frequency (days)', name: 'wateringFrequencyDays', type: 'number' },
        { label: 'Soil Type', name: 'soilType' },
        { label: 'Fertilizer', name: 'fertilizer' },
        { label: 'Sun Exposure', name: 'sunExposure' },
        { label: 'Ideal Temperature', name: 'idealTemperature' },
      ].map(field => (
        <div key={field.name}>
          <label>
            {field.label}:
            <input type={field.type || 'text'} name={field.name} value={formData[field.name]} onChange={handleChange} style={{ width: '100%' }} />
          </label>
        </div>
      ))}

      <label>
        Notes:
        <textarea name="notes" value={formData.notes} onChange={handleChange} style={{ width: '100%' }} />
      </label>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button type="submit">💾 Update Plant</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default EditPlant
