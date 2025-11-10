import React, { useState } from 'react'
import axios from 'axios'

const Register = ({ onRegister }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleRegister = async e => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:8080/api/users/register', {
        username,
        password,
      })
      onRegister(username)
    } catch (err) {
      setError('Username already exists')
    }
  }

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Register</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

export default Register
