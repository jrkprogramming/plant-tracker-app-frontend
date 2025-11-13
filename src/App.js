import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import PlantDashboard from './components/PlantDashboard'
import PlantDetail from './pages/PlantDetail'
import AddPlant from './pages/AddPlant' // make sure you create this page

function App() {
  const [username, setUsername] = useState('')

  // Restore username from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) setUsername(savedUser)
  }, [])

  const handleLogin = user => {
    setUsername(user)
    localStorage.setItem('currentUser', user) // persist login
  }

  const handleLogout = () => {
    setUsername('')
    localStorage.removeItem('currentUser') // clear on logout
  }

  return (
      <Routes>
        {/* Auth routes */}
        {!username ? (
          <>
            <Route path="/" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onRegister={handleLogin} />} />
            {/* Redirect any other route to login if not authenticated */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            {/* Dashboard and plant details routes */}
            <Route path="/dashboard" element={<PlantDashboard username={username} onLogout={handleLogout} />} />
            <Route path="/add-plant" element={<AddPlant username={username} />} />
            <Route path="/plants/:id" element={<PlantDetail username={username} />} />
            {/* Redirect root to dashboard if logged in */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            {/* Catch-all route redirects to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        )}
      </Routes>
  )
}

export default App
