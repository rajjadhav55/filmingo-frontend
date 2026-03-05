import axiosClient from './axiosClient.js'

// Simple in-memory cache to prevent redundant API calls to backend & OSM
const turfCache = {}
const turfDetailsCache = {}

export const exploreAPI = {
  async search(query) {
    const res = await axiosClient.get('/explore/', {
      params: { movie_title: query },
    })
    return res.data
  },

  async chatWithAssistant(message) {
    const startRes = await axiosClient.post('/chatbot/', { message })
    const taskId = startRes.data.task_id
    if (!taskId) {
       throw new Error("Failed to start chatbot task. Missing task ID.")
    }

    // Poll the status
    let attempts = 0;
    while (attempts < 60) { // 2 mins timeout max
      const statusRes = await axiosClient.get(`/chatbot/status/${taskId}/`)
      const state = statusRes.data.status

      if (state === 'SUCCESS') {
        const replyData = statusRes.data.reply;
        if (typeof replyData === 'object' && replyData !== null) {
            return replyData;
        }
        return { reply: replyData };
      } else if (state === 'FAILURE' || statusRes.status >= 400) {
        throw new Error(statusRes.data.error || "Chatbot task failed")
      }
      
      // If PENDING, wait 2 seconds and try again
      await new Promise(resolve => setTimeout(resolve, 2000))
      attempts++
    }
    
    throw new Error("Chatbot request timed out after 2 minutes.")
  },

  async getLocations() {
    const res = await axiosClient.get('/citys/')
    return res.data.citys || []
  },
// ... rest of file

  async getMovies(filters = {}) {
    const params = {}
    if (filters.page) params.page = filters.page
    if (filters.language) params.language = filters.language
    if (filters.genre) params.genre = filters.genre
    if (filters.search) params.search = filters.search

    const res = await axiosClient.get('/api/movies/', { params })
    return res.data
  },

  async getMovieDetails(id) {
    const res = await axiosClient.get(`/api/movie/${id}/`)
    return res.data.movie
  },

  async getShowsForMovie(movieTitle, date, movieId) {
    const params = {}
    if (movieTitle) params.movie_title = movieTitle
    if (movieId) params.movie_id = movieId
    if (date) params.date = date
    const res = await axiosClient.get('/explore/', { params })
    return res.data
  },

  async getReviews(movieId) {
    const res = await axiosClient.get(`/api/movie/${movieId}/reviews/`)
    return res.data // { reviews: [], ai_summary: "..." }
  },

  async postReview(movieId, data) {
    const res = await axiosClient.post(`/movie/${movieId}/reviews/`, data)
    return res.data
  },

  async deleteReview(movieId, reviewId) {
    const res = await axiosClient.delete(`/movie/${movieId}/reviews/${reviewId}/`)
    return res.data
  },

  async getMovieSummary(movieId, forceRefresh = false) {
    const params = forceRefresh ? { force_refresh: 'true' } : {}
    const res = await axiosClient.get(`/movie/${movieId}/summary/`, { params })
    return res.data
  },

  async getNowPlaying() {
    const res = await axiosClient.get('/api/movies/now-playing/')
    return res.data.results || []
  },

  async getStreamingProviders() {
    const res = await axiosClient.get('/api/providers/')
    return res.data.providers || []
  },

  async getMoviesByProvider(providerId, { page = 1, genres = [], language = '' } = {}) {
    const params = { provider_id: providerId, page }
    if (genres.length > 0) params.genres = genres.join(',')
    if (language) params.language = language
    const res = await axiosClient.get('/api/stream/movies/', { params })
    return res.data.results || []
  },

  async getTurfs(location = 'Mumbai') {
    const locKey = location.toLowerCase().trim()
    if (turfCache[locKey]) {
      console.log(`[Cache Hit] Returning cached turfs for: ${location}`)
      return turfCache[locKey]
    }
    const res = await axiosClient.get(`/api/sports/turfs/?location=${encodeURIComponent(location)}`)
    const data = res.data.turfs || []
    if (data.length > 0) {
      turfCache[locKey] = data
    }
    return data
  },

  async getTurfDetails(turfId) {
    if (turfDetailsCache[turfId]) {
      return turfDetailsCache[turfId]
    }
    const res = await axiosClient.get(`/api/sports/turf/${turfId}/`)
    const data = res.data || {}
    turfDetailsCache[turfId] = data
    return data
  },
  
  async getTurfBookedSlots(turfId, date) {
    const res = await axiosClient.get(`/api/sports/turf/${turfId}/booked-slots/`, {
      params: { date }
    })
    return res.data.booked_slots || []
  },

  async bookTurfSlot(bookingData) {
    const res = await axiosClient.post('/api/sports/turfs/book/', bookingData)
    return res.data
  },
}
