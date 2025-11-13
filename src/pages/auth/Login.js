import React, { useState } from 'react'
import axios from 'axios'

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async e => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:8080/api/users/login', {
        username,
        password,
      })

      const loggedInUser = res.data.username

      localStorage.setItem('currentUser', loggedInUser)

      onLogin(loggedInUser)
    } catch (err) {
      setError('Invalid username or password')
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

export default Login
