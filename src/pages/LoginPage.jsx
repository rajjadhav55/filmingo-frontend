import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../api/authAPI.js'
import { useAuth } from '../context/AuthContext.jsx'
import './LoginPage.css'

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '', otp: '' })
  const [step, setStep] = useState('credentials') // 'credentials' | 'otp'
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.email) {
      setError('Email is required.')
      return
    }

    if (!form.password) {
      setError('Password is required.')
      return
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    try {
      setLoading(true)
      // First verify password exists and is correct
      await authAPI.loginWithPassword({
        email: form.email,
        password: form.password,
      })
      // If password is correct, send OTP
      await authAPI.sendOtp(form.email)
      setStep('otp')
    } catch (err) {
      setError(err?.response?.data?.message || err?.response?.data?.error || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyAndLogin = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.otp) {
      setError('OTP is required.')
      return
    }

    try {
      setLoading(true)
      await authAPI.verifyOtp({ email: form.email, otp: form.otp })
      // Login already done in first step, just verify OTP and proceed
      login({ email: form.email })
      navigate('/')
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          'OTP verification failed.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-container">
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

        {/* Login Form */}
        <form
          className="login-form"
          onSubmit={step === 'credentials' ? handleSendOtp : handleVerifyAndLogin}
        >
          <h2 className="login-title">Sign In</h2>

          {error && <div className="error-message">⚠️ {error}</div>}

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
            disabled={step === 'otp'}
          />

          <div className="password-label-row">
            <label className="form-label" htmlFor="password-input">
              Password
            </label>
          </div>
          <div className="password-input-wrapper">
            <input
              className="form-input"
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password-input"
              value={form.password}
              onChange={handleChange}
              disabled={step === 'otp'}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {step === 'otp' && (
            <>
              <label className="form-label" htmlFor="otp-input">
                OTP
              </label>
              <input
                className="form-input"
                type="text"
                name="otp"
                id="otp-input"
                value={form.otp}
                onChange={handleChange}
              />
            </>
          )}

          <button className="submit-button" type="submit" disabled={loading}>
            {loading
              ? 'Please wait...'
              : step === 'credentials'
                ? 'Verify & Send OTP'
                : 'Verify OTP & Login'}
          </button>

          <p className="register-link">
            New here? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
