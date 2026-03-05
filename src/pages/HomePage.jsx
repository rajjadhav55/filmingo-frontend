import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { exploreAPI } from '../api/exploreAPI.js'
import { API_BASE } from '../api/axiosClient.js'
import { ChatBot } from '../components/ChatBot.jsx'
import { Star } from '../components/Icons'
import NowShowingCarousel from '../components/NowShowingCarousel.jsx'

const LANGUAGES = ['Hindi', 'English', 'Marathi', 'Malayalam', 'Tamil', 'Telugu', 'Kannada', 'Bengali', 'Gujarati', 'Punjabi']
const GENRES = ['Action', 'Comedy', 'Drama', 'Adventure', 'Thriller', 'Romance', 'Horror', 'Sci-Fi', 'Fantasy', 'Animation', 'Crime', 'Mystery']

const LANG_CODE = {
  Hindi: 'hi', English: 'en', Marathi: 'mr', Malayalam: 'ml',
  Tamil: 'ta', Telugu: 'te', Kannada: 'kn', Bengali: 'bn',
  Gujarati: 'gu', Punjabi: 'pa',
}

const toggle = (arr, val) => arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]

const HomePage = () => {
  const [selectedLanguages, setSelectedLanguages] = useState([])
  const [selectedGenres, setSelectedGenres] = useState([])
  const [page, setPage] = useState(1)
  const [movies, setMovies] = useState({ now: [], upcoming: [] })
  const [loading, setLoading] = useState(false)
  const [viewState, setViewState] = useState('now')
  const [expandedFilters, setExpandedFilters] = useState({ languages: true, genres: true })
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search')
  const navigate = useNavigate()

  const toggleFilter = (section) => {
    setExpandedFilters(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const loadMovies = async (pageNum = 1) => {
    if (loading) return
    setLoading(true)
    try {
      const data = await exploreAPI.getMovies({
        language: selectedLanguages.length === 1 ? selectedLanguages[0] : '',
        genre: selectedGenres.join(','),
        search: searchQuery,
        page: pageNum
      })
      setMovies(prev => {
        if (pageNum === 1) {
          return {
            now: data['Now Showing'] || [],
            upcoming: data.upcoming || [],
          }
        }
        return {
          now: [...prev.now, ...(data['Now Showing'] || [])],
          upcoming: [...prev.upcoming, ...(data.upcoming || [])],
        }
      })
    } catch (err) {
      console.error('Failed to load movies', err)
    } finally {
      setLoading(false)
    }
  }

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1)
    loadMovies(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguages, selectedGenres, searchQuery])

  // Load next page when page state increments
  useEffect(() => {
    if (page > 1) {
      loadMovies(page)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  // Infinite Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight
      ) {
        if (!loading) {
          setPage(prev => prev + 1)
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loading])

  const getImageUrl = (path) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${API_BASE}${path}`
  }

  const renderMovieCard = (movie) => (
    <button
      key={movie.id}
      onClick={() => navigate(`/movie/${movie.id}`)}
      className="group w-full flex-shrink-0 text-left bg-[#1a1a20] rounded-xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-white/5"
    >
      <div className="relative w-full aspect-[2/3] overflow-hidden">
        {movie.image ? (
          <img
            src={getImageUrl(movie.image)}
            alt={movie.title}
            className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-800 text-slate-500">
            No Image
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0f0f13] via-[#0f0f13]/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <div className="flex items-center gap-1 mb-1">
             <Star className="text-yellow-400 fill-yellow-400" size={14} />
             <span className="text-white text-xs font-bold">
               {typeof movie.rating === 'number' ? movie.rating.toFixed(1) : (movie.rating || 'N/A')}
             </span>
           </div>
           
           <span className="block w-full rounded-md bg-[#e11d48] py-2 text-center text-xs font-bold text-white shadow-lg">
             Book Now
           </span>
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="line-clamp-1 text-base font-bold text-white group-hover:text-[#e11d48] transition-colors">
          {movie.title}
        </h3>
        <p className="mt-1 line-clamp-1 text-xs text-gray-400">
           {movie.genre || movie.genres?.join(', ') || 'Movie'}
        </p>
      </div>
    </button>
  )

  return (
    <div className="mt-6 flex flex-col md:flex-row gap-8 px-6 pb-20 max-w-[1440px] mx-auto">
      {/* Sidebar - Dark Glassmorphism */}
      <aside className="w-full md:w-72 flex-shrink-0 space-y-6">
        <div className="rounded-xl bg-[#1a1a20] border border-white/5 px-5 py-6 shadow-xl sticky top-24">
            <h3 className="mb-6 text-lg font-bold text-white flex items-center justify-between">
                Filters
            </h3>

            {/* Languages Filter */}
            <div className="border-b border-white/5 pb-6">
            <div 
                className="mb-3 flex cursor-pointer items-center justify-between text-xs font-semibold uppercase tracking-wide text-gray-400 hover:text-white transition-colors"
                onClick={() => toggleFilter('languages')}
            >
                <div className="flex items-center gap-2">
                <span className={`transition-transform duration-200 ${expandedFilters.languages ? 'rotate-180' : ''} text-[#e11d48]`}>
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
                        <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>
                </span>
                <span>Languages</span>
                </div>
                <button
                onClick={(e) => {
                    e.stopPropagation()
                    setSelectedLanguages([])
                }}
                className="text-[10px] font-medium text-[#e11d48] hover:text-rose-400 transition-colors"
                >
                Clear
                </button>
            </div>
            {expandedFilters.languages && (
                <div className="mt-2 flex flex-wrap gap-2 transition-all duration-300">
                {LANGUAGES.map((lang) => {
                    const active = selectedLanguages.includes(lang)
                    return (
                    <button
                        key={lang}
                        onClick={() => setSelectedLanguages(toggle(selectedLanguages, lang))}
                        className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                        active
                            ? 'bg-[#e11d48] text-white shadow-lg shadow-rose-900/20 ring-1 ring-[#e11d48]'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-transparent'
                        }`}
                    >
                        {lang}
                    </button>
                    )
                })}
                </div>
            )}
            </div>

            {/* Genres Filter */}
            <div className="py-6">
            <div 
                className="mb-3 flex cursor-pointer items-center justify-between text-xs font-semibold uppercase tracking-wide text-gray-400 hover:text-white transition-colors"
                onClick={() => toggleFilter('genres')}
            >
            <div className="flex items-center gap-2">
                <span className={`transition-transform duration-200 ${expandedFilters.genres ? 'rotate-180' : ''} text-[#e11d48]`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
                        <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>
                </span>
                <span>Genres</span>
                </div>
                <button
                onClick={(e) => {
                    e.stopPropagation()
                    setSelectedGenres([])
                }}
                className="text-[10px] font-medium text-[#e11d48] hover:text-rose-400 transition-colors"
                >
                Clear
                </button>
            </div>
            {expandedFilters.genres && (
                <div className="mt-2 flex flex-wrap gap-2 transition-all duration-300">
                {GENRES.map((g) => {
                    const active = selectedGenres.includes(g)
                    return (
                    <button
                        key={g}
                        onClick={() => setSelectedGenres(toggle(selectedGenres, g))}
                        className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                        active
                            ? 'bg-white text-black shadow-lg ring-1 ring-white'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-transparent'
                        }`}
                    >
                        {g}
                    </button>
                    )
                })}
                </div>
            )}
            </div>
        </div>
      </aside>

      {/* Main content */}
      <section className="flex-1 min-w-0">
        {/* === NOW SHOWING IN THEATRES CAROUSEL === */}
        <NowShowingCarousel />

        {/* Heading and language chips row */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
          <h2 className="text-2xl font-bold text-white tracking-tight">Movies in Mumbai</h2>
        </div>

        {/* Categories / Quick Filter Chips */}
        <div className="mb-8 flex overflow-x-auto pb-4 gap-3 scrollbar-hide">
          {LANGUAGES.slice(0, 5).map((lang) => {
            const active = selectedLanguages.includes(lang)
            return (
              <button
                key={`top-${lang}`}
                onClick={() => setSelectedLanguages(toggle(selectedLanguages, lang))}
                className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all border ${
                  active
                    ? 'bg-[#e11d48] border-[#e11d48] text-white'
                    : 'border-white/10 bg-[#1a1a20] text-gray-400 hover:border-white/30 hover:text-white'
                }`}
              >
                {lang}
              </button>
            )
          })}
        </div>

        {/* Coming Soon / Now Showing Toggle Banner */}
        <div 
          onClick={() => setViewState(viewState === 'now' ? 'upcoming' : 'now')}
          className="mb-8 relative overflow-hidden rounded-xl bg-gradient-to-r from-[#1a1a20] to-[#25252e] p-1 shadow-lg cursor-pointer group border border-white/5"
        >   
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-32 h-32 text-[#e11d48]">
                  <path d="M19.82 2.53a.75.75 0 0 0-.75 0l-.06 .03a.75.75 0 0 0 .19 1.48l.05 -.02 .01 -.01a2.24 2.24 0 0 1 2.24 2.24v11.5a2.25 2.25 0 0 1 -2.25 2.25h-14.5a2.25 2.25 0 0 1 -2.25 -2.25v-11.5a2.25 2.25 0 0 1 2.25 -2.25 .75 .75 0 0 0 0 -1.5 3.75 3.75 0 0 0 -3.75 3.75v11.5a3.75 3.75 0 0 0 3.75 3.75h14.5a3.75 3.75 0 0 0 3.75 -3.75v-11.5a3.75 3.75 0 0 0 -3.75 -3.75z" />
                  <path d="M11 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
              </svg>
          </div>
          
          <div className="relative flex items-center justify-between px-6 py-4">
            <div className="flex flex-col">
                 <span className="text-xs uppercase tracking-widest text-[#e11d48] font-bold mb-1">
                    {viewState === 'now' ? 'Switch to Upcoming' : 'Switch to Now Showing'}
                 </span>
                 <span className="text-xl font-bold text-white">
                    {viewState === 'now' ? 'Coming Soon' : 'Now Showing'}
                 </span>
            </div>
            
             <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#e11d48] text-white shadow-lg group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                </svg>
             </div>
          </div>
        </div>

        {loading && (viewState === 'now' ? movies.now.length === 0 : movies.upcoming.length === 0) && (
            <div className="flex h-40 items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-[#e11d48]"></div>
            </div>
        )}

        {/* Movie Grid */}
        <div className="mb-20">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
            {(viewState === 'now' ? movies.now : movies.upcoming).map(renderMovieCard)}
          </div>
          
          {loading && (viewState === 'now' ? movies.now.length > 0 : movies.upcoming.length > 0) && (
            <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-[#e11d48]"></div>
            </div>
          )}
          
          {viewState === 'upcoming' && movies.upcoming.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 border-2 border-dashed border-white/5 rounded-xl">
                 <p className="text-lg">No upcoming movies found.</p>
            </div>
          )}
           {viewState === 'now' && movies.now.length === 0 && !loading && (
             <div className="flex flex-col items-center justify-center py-20 text-gray-500 border-2 border-dashed border-white/5 rounded-xl">
                 <p className="text-lg">No movies currently showing.</p>
            </div>
          )}
        </div>
      </section>
      <ChatBot />
    </div>
  )
}

export default HomePage
