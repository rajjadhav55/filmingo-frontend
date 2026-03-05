import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { loadTokensFromStorage, clearTokens } from '../api/axiosClient.js'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState(null)
  const [user, setUser] = useState(null) // { name, username, email, user_id }
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [onLoginSuccess, setOnLoginSuccess] = useState(null) // callback after modal login

  // Decode JWT payload to extract user info
  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return {
        user_id: payload.user_id,
        username: payload.username,
        email: payload.email,
        name: payload.name || payload.username,
        is_staff: payload.is_staff,
      }
    } catch {
      return null
    }
  }

  useEffect(() => {
    loadTokensFromStorage()
    const access = localStorage.getItem('access_token')
    const storedEmail = localStorage.getItem('user_email')
    if (access && storedEmail) {
      setIsAuthenticated(true)
      setEmail(storedEmail)
      const decoded = decodeToken(access)
      if (decoded) setUser(decoded)
    }
  }, [])

  const login = ({ email: userEmail }) => {
    setIsAuthenticated(true)
    setEmail(userEmail)
    localStorage.setItem('user_email', userEmail)
    // Decode token for user info
    const access = localStorage.getItem('access_token')
    if (access) {
      const decoded = decodeToken(access)
      if (decoded) setUser(decoded)
    }
  }

  const logout = () => {
    clearTokens()
    setIsAuthenticated(false)
    setEmail(null)
    setUser(null)
    localStorage.removeItem('user_email')
  }

  // Opens the login modal with an optional success callback
  const requireAuth = useCallback((callback) => {
    if (isAuthenticated) {
      if (callback) callback()
      return true
    }
    // Store callback to fire after successful login
    setOnLoginSuccess(() => callback)
    setShowLoginModal(true)
    return false
  }, [isAuthenticated])

  // Called by LoginModal after successful login
  const handleModalLoginSuccess = useCallback(({ email: userEmail }) => {
    login({ email: userEmail })
    setShowLoginModal(false)
    // Fire the stored callback
    if (onLoginSuccess) {
      setTimeout(() => onLoginSuccess(), 100)
      setOnLoginSuccess(null)
    }
  }, [onLoginSuccess])

  const closeLoginModal = () => {
    setShowLoginModal(false)
    setOnLoginSuccess(null)
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated, email, user,
      login, logout,
      requireAuth, showLoginModal, closeLoginModal, handleModalLoginSuccess,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
