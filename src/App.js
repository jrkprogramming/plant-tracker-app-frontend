import React, { useState, useEffect } from 'react'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import PlantDashboard from './components/PlantDashboard'

function App() {
  const [username, setUsername] = useState('')
  const [showRegister, setShowRegister] = useState(false)

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

  if (!username) {
    return showRegister ? (
      <div>
        <Register
          onRegister={user => {
            setUsername(user)
            localStorage.setItem('currentUser', user)
          }}
        />
        <p>
          Already have an account? <button onClick={() => setShowRegister(false)}>Login</button>
        </p>
      </div>
    ) : (
      <div>
        <Login onLogin={handleLogin} />
        <p>
          Don't have an account? <button onClick={() => setShowRegister(true)}>Register</button>
        </p>
      </div>
    )
  }

  return <PlantDashboard username={username} onLogout={handleLogout} />
}

export default App
