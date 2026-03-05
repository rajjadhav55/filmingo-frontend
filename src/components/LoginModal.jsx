import React, { useState } from 'react'
import { authAPI } from '../api/authAPI.js'
import { useAuth } from '../context/AuthContext.jsx'

const LoginModal = () => {
  const { showLoginModal, closeLoginModal, handleModalLoginSuccess } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'register' | 'otp'
  const [form, setForm] = useState({ email: '', password: '', name: '', otp: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  if (!showLoginModal) return null

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const resetForm = () => {
    setForm({ email: '', password: '', name: '', otp: '' })
    setError('')
    setLoading(false)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) {
      setError('Email and password are required.')
      return
    }
    try {
      setLoading(true)
      await authAPI.loginWithPassword({ email: form.email, password: form.password })
      await authAPI.sendOtp(form.email)
      setMode('otp')
    } catch (err) {
      setError(err?.response?.data?.detail || err?.response?.data?.error || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.otp) {
      setError('OTP is required.')
      return
    }
    try {
      setLoading(true)
      await authAPI.verifyOtp({ email: form.email, otp: form.otp })
      handleModalLoginSuccess({ email: form.email })
      resetForm()
      setMode('login')
    } catch (err) {
      setError(err?.response?.data?.error || 'OTP verification failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.password) {
      setError('All fields are required.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    try {
      setLoading(true)
      await authAPI.register({ name: form.name, email: form.email, password: form.password })
      // Auto-login after registration
      await authAPI.loginWithPassword({ email: form.email, password: form.password })
      await authAPI.sendOtp(form.email)
      setMode('otp')
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    resetForm()
    setMode('login')
    closeLoginModal()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md mx-4 rounded-2xl bg-[#1a1a20] border border-white/10 shadow-2xl overflow-hidden"
        style={{ animation: 'modalSlideUp 0.3s ease-out' }}
      >
        <style>{`
          @keyframes modalSlideUp {
            from { transform: translateY(40px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}</style>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-2">
          <div className="text-2xl font-bold text-white">
            <span className="text-brand-red">Film</span>ingo
          </div>
          <p className="text-white/40 text-sm mt-1">
            {mode === 'login' && 'Sign in to continue your booking'}
            {mode === 'register' && 'Create an account to get started'}
            {mode === 'otp' && `Enter the OTP sent to ${form.email}`}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={mode === 'login' ? handleLogin : mode === 'register' ? handleRegister : handleVerifyOtp}
          className="px-8 pb-8 pt-4"
        >
          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-sm text-red-400">
              {error}
            </div>
          )}

          {mode === 'register' && (
            <div className="mb-4">
              <label className="block text-xs text-white/50 uppercase tracking-wider mb-1.5 font-semibold">Name</label>
              <input
                type="text" name="name" value={form.name} onChange={handleChange}
                className="w-full rounded-lg bg-[#0f0f13] border border-white/10 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-brand-red/50 focus:outline-none focus:ring-1 focus:ring-brand-red/30 transition"
                placeholder="Your full name"
              />
            </div>
          )}

          {mode !== 'otp' && (
            <>
              <div className="mb-4">
                <label className="block text-xs text-white/50 uppercase tracking-wider mb-1.5 font-semibold">Email</label>
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  className="w-full rounded-lg bg-[#0f0f13] border border-white/10 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-brand-red/50 focus:outline-none focus:ring-1 focus:ring-brand-red/30 transition"
                  placeholder="you@example.com"
                />
              </div>

              <div className="mb-6">
                <label className="block text-xs text-white/50 uppercase tracking-wider mb-1.5 font-semibold">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                    className="w-full rounded-lg bg-[#0f0f13] border border-white/10 px-4 py-3 pr-16 text-sm text-white placeholder-white/30 focus:border-brand-red/50 focus:outline-none focus:ring-1 focus:ring-brand-red/30 transition"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white/70 transition"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            </>
          )}

          {mode === 'otp' && (
            <div className="mb-6">
              <label className="block text-xs text-white/50 uppercase tracking-wider mb-1.5 font-semibold">OTP Code</label>
              <input
                type="text" name="otp" value={form.otp} onChange={handleChange}
                className="w-full rounded-lg bg-[#0f0f13] border border-white/10 px-4 py-3 text-sm text-white text-center tracking-[0.5em] font-mono text-lg placeholder-white/30 focus:border-brand-red/50 focus:outline-none focus:ring-1 focus:ring-brand-red/30 transition"
                placeholder="000000"
                maxLength={6}
                autoFocus
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-red px-4 py-3 text-sm font-bold text-white transition-all hover:bg-rose-600 hover:shadow-lg hover:shadow-brand-red/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Please wait...
              </span>
            ) : (
              mode === 'login' ? 'Sign In & Send OTP' :
              mode === 'register' ? 'Create Account' :
              'Verify OTP & Continue'
            )}
          </button>

          {/* Switch mode */}
          {mode !== 'otp' && (
            <p className="text-center text-sm text-white/40 mt-4">
              {mode === 'login' ? (
                <>New here? <button type="button" onClick={() => { setMode('register'); setError('') }} className="text-brand-red hover:underline font-medium">Create an account</button></>
              ) : (
                <>Already have an account? <button type="button" onClick={() => { setMode('login'); setError('') }} className="text-brand-red hover:underline font-medium">Sign In</button></>
              )}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}

export default LoginModal
