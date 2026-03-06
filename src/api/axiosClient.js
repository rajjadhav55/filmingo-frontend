import axios from 'axios'

// Remove the || 'http://localhost:8000' fallback to force it to use the cloud URL
export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://filmingo-backend.onrender.com';

let accessToken = null
let refreshToken = null

export const setTokens = ({ access, refresh }) => {
  accessToken = access
  refreshToken = refresh
  if (access) localStorage.setItem('access_token', access)
  if (refresh) localStorage.setItem('refresh_token', refresh)
}

export const clearTokens = () => {
  accessToken = null
  refreshToken = null
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

export const loadTokensFromStorage = () => {
  accessToken = localStorage.getItem('access_token')
  refreshToken = localStorage.getItem('refresh_token')
}

const axiosClient = axios.create({
  baseURL: API_BASE,
})

axiosClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

export default axiosClient

