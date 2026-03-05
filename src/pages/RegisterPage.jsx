import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../api/authAPI.js'
import './RegisterPage.css'

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactNo: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('All fields except mobile are required.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    try {
      setLoading(true)
      await authAPI.register({
        name: form.name,
        email: form.email,
        password: form.password,
        contactNo: form.contactNo,
      })
      alert('Registration successful! Please login.')
      navigate('/login')
    } catch (err) {
      console.error('Registration error:', err)
      
      // Extract error message from various possible response formats
      let errorMessage = ''
      
      // Check for errors array (multiple validation errors)
      if (err?.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        errorMessage = err.response.data.errors.join(' ')
      } else {
        errorMessage = 
          err?.response?.data?.error || 
          err?.response?.data?.message ||
          err?.response?.data?.detail ||
          (err?.response?.data?.username && `Username: ${err.response.data.username[0]}`) ||
          (err?.response?.data?.email && `Email: ${err.response.data.email[0]}`) ||
          (err?.response?.data?.password && `Password: ${err.response.data.password[0]}`) ||
          err?.message ||
          'Registration failed. Please try again.'
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-wrapper">
      <div className="register-container">
        {/* Movie Clapper Animation */}
        <div className="clapper-animation">
          <div className="clapper">
            <div className="clapper-container">
              <div className="clapper-body">
                <div className="top">
                  <div className="stick stick1">
                    <div className="rect" />
                    <div className="rect" />
                    <div className="rect" />
                    <div className="rect" />
                    <div className="rect" />
                    <div className="rect" />
                  </div>
                  <div className="stick stick2">
                    <div className="rect" />
                    <div className="rect" />
                    <div className="rect" />
                    <div className="rect" />
                    <div className="rect" />
                    <div className="rect" />
                  </div>
                </div>
                <div className="bottom" />
              </div>
              <div className="circle" />
              <div className="play">
                <svg viewBox="0 0 70 77.73502691896255">
                  <path
                    d="M 60 38.86751345948127 L 10.000000000000021 67.73502691896255 L 10 10 L 60 38.86751345948127 Z"
                    fill="#dc2626"
                    strokeLinejoin="round"
                    strokeWidth="10"
                    stroke="#dc2626"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Register Form */}
        <form className="register-form" onSubmit={handleSubmit}>
          <h2 className="register-title">Create Account</h2>

          {error && <div className="error-message">⚠️ {error}</div>}

          <label className="form-label" htmlFor="name-input">
            Name
          </label>
          <input
            className="form-input"
            type="text"
            name="name"
            id="name-input"
            value={form.name}
            onChange={handleChange}
          />

          <label className="form-label" htmlFor="email-input">
            Email
          </label>
          <input
            className="form-input"
            type="email"
            name="email"
            id="email-input"
            value={form.email}
            onChange={handleChange}
          />

          <label className="form-label" htmlFor="password-input">
            Password
          </label>
          <div className="password-input-wrapper">
            <input
              className="form-input"
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password-input"
              value={form.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <label className="form-label" htmlFor="confirm-password-input">
            Confirm Password
          </label>
          <input
            className="form-input"
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            id="confirm-password-input"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          <label className="form-label" htmlFor="contact-input">
            Mobile (optional)
          </label>
          <input
            className="form-input"
            type="text"
            name="contactNo"
            id="contact-input"
            value={form.contactNo}
            onChange={handleChange}
          />

          <button className="submit-button" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Register'}
          </button>

          <p className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
