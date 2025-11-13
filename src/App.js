import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import PlantDashboard from './components/PlantDashboard'
import PlantDetail from './pages/PlantDetail'

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
          </>
        ) : (
          <>
            {/* Dashboard and plant details routes */}
            <Route path="/dashboard" element={<PlantDashboard username={username} onLogout={handleLogout} />} />
            <Route path="/plants/:id" element={<PlantDetail username={username} />} />
          </>
        )}
      </Routes>
  )
}

export default App
