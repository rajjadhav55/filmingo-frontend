import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosClient from '../api/axiosClient'

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('movies') // 'movies' or 'turfs'
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axiosClient.get('/my-bookings/')
        setBookings(response.data.bookings || [])
      } catch (error) {
        console.error('Failed to fetch bookings:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  const formatDate = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatTime = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    )
  }

  const filteredBookings = bookings.filter((booking) => {
    const isMovie = booking.type === 'movie' || !booking.type;
    return activeTab === 'movies' ? isMovie : !isMovie;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          
          {/* Tabs */}
          <div className="flex items-center space-x-2 bg-gray-200 p-1 rounded-lg self-start md:self-auto">
            <button
              onClick={() => setActiveTab('movies')}
              className={`px-4 py-2 rounded-md font-semibold text-sm transition-all ${
                activeTab === 'movies' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Movie Tickets
            </button>
            <button
              onClick={() => setActiveTab('turfs')}
              className={`px-4 py-2 rounded-md font-semibold text-sm transition-all ${
                activeTab === 'turfs' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Turf Bookings
            </button>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-6xl mb-4">{activeTab === 'movies' ? '🎬' : '🏟️'}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No {activeTab === 'movies' ? 'Movie' : 'Turf'} Bookings Found
            </h2>
            <p className="text-gray-600 mb-6">
              {activeTab === 'movies' 
                ? 'Start booking your favorite movies!' 
                : 'Get out there and book a turf for your next game!'}
            </p>
            <button
              onClick={() => navigate(activeTab === 'movies' ? '/' : '/explore?tab=sports')}
              className="bg-brand-red text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Browse {activeTab === 'movies' ? 'Movies' : 'Sports'}
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredBookings.map((booking) => {
              const isMovie = booking.type === 'movie' || !booking.type;
              
              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition border border-gray-100"
                >
                  <div className="md:flex">
                    {/* Poster / Side Image */}
                    <div className="md:flex-shrink-0">
                      {isMovie ? (
                        booking.movie_poster ? (
                          <img
                            src={booking.movie_poster}
                            alt={booking.movie_title}
                            className="h-48 w-full object-cover md:h-full md:w-48"
                          />
                        ) : (
                          <div className="h-48 w-full md:h-full md:w-48 bg-gray-100 flex items-center justify-center">
                            <span className="text-6xl">🎬</span>
                          </div>
                        )
                      ) : (
                        <div className="h-48 w-full md:h-full md:w-48 bg-emerald-50 flex items-center justify-center border-r border-gray-100">
                          <div className="flex flex-col items-center gap-2">
                             <span className="text-6xl">🏟️</span>
                             <span className="text-[10px] font-black uppercase tracking-tighter text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">Sports</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Booking Details */}
                    <div className="p-6 flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-1">
                            {isMovie ? booking.movie_title : booking.turf_name}
                          </h2>
                          <p className="text-gray-600 text-sm">
                            {isMovie 
                              ? `${booking.theater_name}, ${booking.theater_location}` 
                              : booking.turf_location && booking.turf_location !== 'Unknown Location' 
                                ? `Sports Venue • ${booking.turf_location}` 
                                : 'Sports Venue'}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {booking.is_paid && (
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                              ✓ Paid
                            </span>
                          )}
                          <span className="text-lg font-black text-gray-900">₹{booking.total_price}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">{isMovie ? 'Show Date' : 'Booking Date'}</p>
                          <p className="font-semibold text-gray-900">
                            {isMovie ? formatDate(booking.show_time) : formatDate(booking.booking_date)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">{isMovie ? 'Show Time' : 'Time Slots'}</p>
                          <p className="font-semibold text-gray-900 line-clamp-2">
                            {isMovie 
                              ? formatTime(booking.show_time) 
                              : booking.time_slots ? booking.time_slots.join(', ') : booking.time_slot}
                          </p>
                        </div>
                        {isMovie ? (
                          <>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Seats</p>
                              <p className="font-semibold text-gray-900">
                                {booking.seats?.join(', ') || 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Tickets</p>
                              <p className="font-semibold text-gray-900">
                                {booking.number_of_tickets}
                              </p>
                            </div>
                          </>
                        ) : (
                          <div className="col-span-2">
                            <p className="text-xs text-gray-500 mb-1">Status</p>
                            <p className="font-semibold text-emerald-600">Confirmed & Reserved</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                          Booked on {formatDate(booking.booking_time)}
                        </p>
                        <button
                          className="text-brand-red font-semibold text-sm hover:underline"
                          onClick={() => alert('View details feature coming soon!')}
                        >
                          View {isMovie ? 'Ticket' : 'Details'} →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyBookingsPage
