import axiosClient from './axiosClient.js'

export const bookingAPI = {
  async getSeatLayout(showId) {
    const res = await axiosClient.get('/seat_layout/', { params: { id: showId } })
    return res.data
  },

  async lockSeats(showId, seatNumbers, action = "lock", sessionId = null) {
    const res = await axiosClient.post('/booking/', {
      show_id: showId,
      seat_numbers: seatNumbers,
      action: action,
      ...(sessionId && { session_id: sessionId })
    })
    return res.data
  },

  async confirmBooking(showId, seatNumbers, paymentMethod, sessionId) {
    const res = await axiosClient.post('/confirm_booking/', {
      show_id: showId,
      seat_numbers: seatNumbers,
      payment_method: paymentMethod,
      session_id: sessionId,
    })
    return res.data
  },

  // ── New endpoints for movie booking flow ──

  async getShowsForDate(movieId, date) {
    const res = await axiosClient.get(`/api/movies/${movieId}/shows/`, {
      params: { date },
    })
    return res.data
  },

  async getSeatsForShow(showId) {
    const res = await axiosClient.get(`/api/shows/${showId}/seats/`)
    return res.data
  },
}
