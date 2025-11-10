import React, { useEffect, useState } from 'react'
import axios from 'axios'
import AddPlant from './AddPlants'
import PlantList from './PlantList'

const PlantDashboard = ({ username, onLogout }) => {
  const [plants, setPlants] = useState([])

  const fetchPlants = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/plants?username=${username}`)
      setPlants(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const waterPlant = async plant => {
    try {
      await axios.put(`http://localhost:8080/api/plants/${plant.id}?username=${username}`, {
        ...plant,
        lastWateredDate: new Date().toISOString().split('T')[0],
      })
      fetchPlants()
    } catch (err) {
      console.error(err)
    }
  }

  const deletePlant = async id => {
    try {
      await axios.delete(`http://localhost:8080/api/plants/${id}?username=${username}`)
      fetchPlants()
    } catch (err) {
      console.error(err)
    }
  }

	const updatePlant = async (id, updatedData) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/plants/${id}?username=${username}`, updatedData)
      const updatedPlant = response.data

      // Update local state to reflect the changes immediately
      setPlants(plants.map(p => (p._id === id ? updatedPlant : p)))
			window.location.reload()
    } catch (err) {
      console.error('Update failed', err)
    }
  }

  useEffect(() => {
    fetchPlants()
  }, [])

  return (
    <div>
      <h2>{username}'s Plants 🌱</h2>
      <button onClick={onLogout}>Logout</button>
      <AddPlant username={username} onPlantAdded={fetchPlants} />
      <PlantList plants={plants} onWater={waterPlant} onDelete={deletePlant} onUpdate={updatePlant} />
    </div>
  )
}

export default PlantDashboard
