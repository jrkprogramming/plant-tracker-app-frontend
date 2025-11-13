import React, { useEffect, useState } from 'react'
import axios from 'axios'
import AddPlant from './AddPlant'
import PlantList from './PlantList'

const PlantDashboard = ({ username, onLogout }) => {
  const [plants, setPlants] = useState([])

  // Fetch all plants for this user
  const fetchPlants = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/plants?username=${username}`)
      setPlants(res.data)
    } catch (err) {
      console.error('Fetch plants error:', err)
    }
  }

  useEffect(() => {
    fetchPlants()
  }, [])

  // Water a plant (update lastWateredDate)
  const waterPlant = async plant => {
    try {
      await axios.put(`http://localhost:8080/api/plants/${plant._id || plant.id}?username=${username}`, {
        ...plant,
        lastWateredDate: new Date().toISOString().split('T')[0],
      })
      fetchPlants()
    } catch (err) {
      console.error('Water plant error:', err)
    }
  }

  // Delete a plant
  const deletePlant = async id => {
    try {
      await axios.delete(`http://localhost:8080/api/plants/${id}?username=${username}`)
      fetchPlants()
    } catch (err) {
      console.error('Delete plant error:', err)
    }
  }

  // Update plant info
  const updatePlant = async (id, updatedData) => {
    try {
      const res = await axios.put(`http://localhost:8080/api/plants/${id}?username=${username}`, updatedData)
      const updatedPlant = res.data
      setPlants(plants.map(p => (p._id === id ? updatedPlant : p)))
      window.location.reload()
    } catch (err) {
      console.error('Update plant error:', err)
    }
  }

  // Add a log (photo + note)
  const addPlantLog = async (plantId, log) => {
    try {
      await axios.post(`http://localhost:8080/api/plants/${plantId}/logs?username=${username}`, log)
      fetchPlants()
    } catch (err) {
      console.error('Add log error:', err)
    }
  }

  // Add a comment to a log
  const addPlantComment = async (plantId, logIndex, comment) => {
    try {
      await axios.post(`http://localhost:8080/api/plants/${plantId}/logs/${logIndex}/comments?username=${username}`, comment)
      fetchPlants()
    } catch (err) {
      console.error('Add comment error:', err)
    }
  }

  // Delete a log
  const deletePlantLog = async (plantId, logIndex) => {
    try {
      await axios.delete(`http://localhost:8080/api/plants/${plantId}/logs/${logIndex}?username=${username}`)
      fetchPlants()
    } catch (err) {
      console.error('Delete log error:', err)
    }
  }

  return (
    <div>
      <h2>{username}'s Plants 🌱</h2>
      <button onClick={onLogout}>Logout</button>

      <AddPlant username={username} onPlantAdded={fetchPlants} />

      <PlantList plants={plants} onWater={waterPlant} onDelete={deletePlant} onUpdate={updatePlant} onAddLog={addPlantLog} onAddComment={addPlantComment} onDeleteLog={deletePlantLog} />
    </div>
  )
}

export default PlantDashboard
