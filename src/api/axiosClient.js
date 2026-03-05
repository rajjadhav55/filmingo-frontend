import axios from 'axios'

export const API_BASE = 'http://localhost:8000' // adjust if backend URL differs

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

