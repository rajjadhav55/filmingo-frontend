import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { bookingAPI } from '../api/bookingAPI.js'
import { exploreAPI } from '../api/exploreAPI.js'

const ShowsPage = () => {
  const { movieId } = useParams()
  const navigate = useNavigate()
  const [selectedDateOffset, setSelectedDateOffset] = useState(0)
  const [theaters, setTheaters] = useState([])
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(false)

  // Build an array of date objects for the next 7 days
  const dateOptions = useMemo(() => {
    const days = []
    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() + i)
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short' })
      const dayNum = d.getDate()
      const month = d.toLocaleDateString('en-IN', { month: 'short' })
      const yyyy = d.getFullYear()
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      days.push({
        label: dayName,
        dayNum,
        month,
        dateStr: `${yyyy}-${mm}-${dd}`,
      })
    }
    return days
  }, [])

  const selectedDate = dateOptions[selectedDateOffset]?.dateStr

  // Fetch movie details from TMDB
  useEffect(() => {
    const loadMovie = async () => {
      try {
        const data = await exploreAPI.getMovieDetails(movieId)
        setMovie(data)
      } catch (e) {
        console.error('Failed to load movie:', e)
      }
    }
    loadMovie()
  }, [movieId])

  // Fetch shows for the selected date
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const data = await bookingAPI.getShowsForDate(movieId, selectedDate)
        setTheaters(data || [])
      } catch (e) {
        console.error('Failed to load shows:', e)
        setTheaters([])
      } finally {
        setLoading(false)
      }
    }
    if (selectedDate) load()
  }, [movieId, selectedDate])

  const handleShowClick = (showId) => {
    navigate(`/book/${showId}`)
  }

  // Extract genres from TMDB movie data
  const genres = movie?.genres?.map(g => typeof g === 'string' ? g : g.name).filter(Boolean) || []
  const certification = movie?.certification || 'U/A'

  return (
    <div className="min-h-screen bg-[#0f0f13] pb-8">
      {/* ── Movie Header ── */}
      <div className="bg-[#1a1a20] border-b border-white/10 px-6 py-5">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-bold text-white">
            {movie?.title || 'Loading...'}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {/* Censor Certificate */}
            <span className="rounded border border-white/30 px-2 py-0.5 text-xs font-semibold text-white/80 uppercase tracking-wider">
              {certification}
            </span>
            {/* Genres */}
            {genres.map((g, i) => (
              <span key={i} className="rounded-full bg-white/10 px-3 py-0.5 text-xs text-white/70">
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Date Ribbon ── */}
      <div className="border-b border-white/10 bg-[#0f0f13]">
        <div className="mx-auto max-w-5xl px-6 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {dateOptions.map((opt, idx) => {
              const active = idx === selectedDateOffset
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDateOffset(idx)}
                  className={`flex flex-col items-center min-w-[64px] rounded-lg px-3 py-2 text-center transition-all duration-200
                    ${active
                      ? 'bg-brand-red text-white shadow-lg shadow-brand-red/30'
                      : 'bg-[#1a1a20] text-white/60 hover:bg-[#252530] hover:text-white/80 border border-white/10'
                    }`}
                >
                  <span className="text-[10px] font-medium uppercase tracking-wide">
                    {opt.label}
                  </span>
                  <span className="text-lg font-bold leading-tight">{opt.dayNum}</span>
                  <span className="text-[10px] uppercase">{opt.month}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Theater List ── */}
      <div className="mx-auto max-w-5xl px-6 mt-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-red border-t-transparent" />
          </div>
        ) : theaters.length === 0 ? (
          <div className="text-center py-20 text-white/40">
            <p className="text-lg">No shows available for this date</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {theaters.map((theater) => (
              <div
                key={theater.theater_id}
                className="rounded-xl bg-[#1a1a20] border border-white/10 p-5 transition hover:border-white/20"
              >
                {/* Theater name row */}
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-semibold text-white">
                    {theater.theater_name}
                  </h3>
                  {/* Info icon */}
                  <button className="text-white/40 hover:text-brand-red transition" title="Theater info">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <span className="text-xs text-white/40 ml-auto">
                    {theater.theater_location}
                  </span>
                </div>

                {/* Showtime pills */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {theater.showtimes?.map((show) => (
                    <button
                      key={show.id}
                      onClick={() => handleShowClick(show.id)}
                      className="group relative rounded-lg border border-white/20 px-4 py-2.5 text-sm transition-all duration-200
                        hover:border-brand-red hover:shadow-lg hover:shadow-brand-red/10"
                    >
                      <span className="font-semibold text-white group-hover:text-brand-red transition-colors">
                        {show.time}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-white/40">{show.format}</span>
                        <span className="text-[10px] text-white/30">•</span>
                        <span className="text-[10px] text-white/40">{show.language}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ShowsPage
