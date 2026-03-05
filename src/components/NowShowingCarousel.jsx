import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { exploreAPI } from '../api/exploreAPI.js'

const PLACEHOLDER_POSTER = 'https://via.placeholder.com/200x300?text=No+Poster'

const NowShowingCarousel = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    exploreAPI.getNowPlaying()
      .then(data => setMovies(data))
      .catch(err => console.error('NowPlaying fetch failed:', err))
      .finally(() => setLoading(false))
  }, [])

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 240, behavior: 'smooth' })
    }
  }

  if (loading) {
    return (
      <div className="flex gap-4 overflow-hidden py-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-40 h-60 rounded-xl bg-slate-200 animate-pulse" />
        ))}
      </div>
    )
  }

  if (!movies.length) return null

  return (
    <section className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            🎬 Now Showing in Theatres
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">Grab your tickets before they sell out</p>
        </div>
        <div className="flex gap-2">
          <ArrowBtn dir={-1} onClick={() => scroll(-1)} />
          <ArrowBtn dir={1}  onClick={() => scroll(1)}  />
        </div>
      </div>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-3 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {movies.map(movie => (
          <button
            key={movie.id}
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="group flex-shrink-0 w-40 text-left focus:outline-none"
          >
            {/* Poster */}
            <div className="relative w-40 h-60 rounded-xl overflow-hidden shadow-md group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300">
              <img
                src={movie.poster_url || PLACEHOLDER_POSTER}
                alt={movie.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { e.target.src = PLACEHOLDER_POSTER }}
              />
              {/* Gradient + rating overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-2 pb-2 pt-6">
                {movie.rating > 0 && (
                  <span className="inline-flex items-center gap-0.5 text-xs font-bold text-yellow-400">
                    ★ {movie.rating?.toFixed(1)}
                  </span>
                )}
              </div>
              {/* "In Theatres" badge */}
              <div className="absolute top-2 left-2">
                <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide shadow">
                  In Theatres
                </span>
              </div>
            </div>
            {/* Title */}
            <p className="mt-2 text-sm font-semibold text-white line-clamp-2 leading-snug group-hover:text-rose-600 transition-colors">
              {movie.title}
            </p>
            {movie.release_date && (
              <p className="text-xs text-slate-400 mt-0.5">
                {new Date(movie.release_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            )}
          </button>
        ))}
      </div>
    </section>
  )
}

const ArrowBtn = ({ dir, onClick }) => (
  <button
    onClick={onClick}
    className="w-9 h-9 rounded-full bg-[#e11d48] flex items-center justify-center text-white hover:bg-rose-700 transition-all shadow-md"
    aria-label={dir < 0 ? 'Scroll left' : 'Scroll right'}
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
      {dir < 0
        ? <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        : <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />}
    </svg>
  </button>
)

export default NowShowingCarousel
