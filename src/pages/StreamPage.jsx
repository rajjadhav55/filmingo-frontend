import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { exploreAPI } from '../api/exploreAPI.js'
import { Star } from '../components/Icons'

const LANGUAGES = ['Hindi', 'English', 'Marathi', 'Malayalam', 'Tamil', 'Telugu', 'Kannada', 'Bengali', 'Gujarati', 'Punjabi']
const GENRES    = ['Action', 'Comedy', 'Drama', 'Adventure', 'Thriller', 'Romance', 'Horror', 'Sci-Fi', 'Fantasy', 'Animation', 'Crime', 'Mystery']

const LANG_CODE = {
  Hindi: 'hi', English: 'en', Marathi: 'mr', Malayalam: 'ml',
  Tamil: 'ta', Telugu: 'te', Kannada: 'kn', Bengali: 'bn',
  Gujarati: 'gu', Punjabi: 'pa',
}

// ── Icons ──────────────────────────────────────────────────────
const ChevRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M9 18l6-6-6-6" />
  </svg>
)
const ChevLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M15 18l-6-6 6-6" />
  </svg>
)
const ChevDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
)

// ── Skeleton card ──────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="animate-pulse bg-[#1a1a20] rounded-xl overflow-hidden border border-white/5">
    <div className="aspect-[2/3] bg-[#25252e]" />
    <div className="p-3 space-y-2">
      <div className="h-3 bg-[#25252e] rounded w-3/4" />
      <div className="h-3 bg-[#25252e] rounded w-1/2" />
    </div>
  </div>
)

// ── Provider chip ──────────────────────────────────────────────
const ProviderChip = ({ provider, isActive, onClick }) => (
  <button
    onClick={() => onClick(provider)}
    title={provider.name}
    style={{
      flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: '148px', height: '76px', borderRadius: '12px', backgroundColor: '#1a1a20',
      border: isActive ? '2px solid #e11d48' : '1px solid rgba(255,255,255,0.08)',
      boxShadow: isActive ? '0 0 0 1px rgba(225,29,72,0.25), 0 4px 16px rgba(225,29,72,0.15)' : 'none',
      padding: '12px 16px', cursor: 'pointer',
      transition: 'border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease',
      transform: isActive ? 'scale(1.04)' : 'scale(1)',
    }}
  >
    {provider.logo_url ? (
      <img src={provider.logo_url} alt={provider.name}
        style={{ maxHeight: '44px', maxWidth: '116px', width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
    ) : (
      <span style={{ color: '#fff', fontSize: '11px', fontWeight: 600, textAlign: 'center', lineHeight: 1.3 }}>
        {provider.name}
      </span>
    )}
  </button>
)

// ── Toggle helper ──────────────────────────────────────────────
const toggle = (arr, val) => arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]

// ── Main page ──────────────────────────────────────────────────
const StreamPage = () => {
  const navigate = useNavigate()
  const ribbonRef = useRef(null)

  // Providers
  const [providers, setProviders] = useState([])
  const [selectedProvider, setSelectedProvider] = useState(null)
  const [loadingProviders, setLoadingProviders] = useState(true)

  // Movies + pagination
  const [movies, setMovies] = useState([])
  const [page, setPage] = useState(1)
  const [loadingMovies, setLoadingMovies] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  // Multi-select filters
  const [selectedLanguages, setSelectedLanguages] = useState([])
  const [selectedGenres, setSelectedGenres]       = useState([])
  const [expandedFilters, setExpandedFilters] = useState({ languages: true, genres: true })

  const [mediaType, setMediaType] = useState('Movies')

  const toggleSection = (s) => setExpandedFilters(p => ({ ...p, [s]: !p[s] }))

  // ── Load providers ─────────────────────────────────────────
  useEffect(() => {
    exploreAPI.getStreamingProviders()
      .then(data => { setProviders(data); if (data.length > 0) setSelectedProvider(data[0]) })
      .catch(e => console.error(e))
      .finally(() => setLoadingProviders(false))
  }, [])

  // ── Fetch movies (appends for infinite scroll) ─────────────
  const fetchMovies = useCallback(async (provId, pg, genres, languages, append = false) => {
    if (!provId) return
    setLoadingMovies(true)
    try {
      let data
      if (languages.length === 0) {
        // No language filter → single API call
        data = await exploreAPI.getMoviesByProvider(provId, { page: pg, genres })
      } else {
        // One call per language, then deduplicate by movie ID
        const calls = await Promise.all(
          languages.map(lang => exploreAPI.getMoviesByProvider(provId, { page: pg, genres, language: lang }))
        )
        const seen = new Set()
        data = calls.flat().filter(m => {
          if (seen.has(m.id)) return false
          seen.add(m.id)
          return true
        })
      }
      setMovies(prev => append ? [...prev, ...data] : data)
      setHasMore(data.length >= 18)
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingMovies(false)
    }
  }, [])

  // When provider or genre/language filters change → reset to page 1
  useEffect(() => {
    if (!selectedProvider) return
    setPage(1)
    setMovies([])
    fetchMovies(selectedProvider.id, 1, selectedGenres, selectedLanguages, false)
  }, [selectedProvider, selectedGenres, selectedLanguages, fetchMovies])

  // When page increments → append
  useEffect(() => {
    if (page === 1 || !selectedProvider) return
    fetchMovies(selectedProvider.id, page, selectedGenres, selectedLanguages, true)
  }, [page]) // eslint-disable-line

  // ── Infinite scroll ────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      if (loadingMovies || !hasMore) return
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 400
      if (nearBottom) setPage(p => p + 1)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadingMovies, hasMore])

  // Languages are now filtered server-side — displayMovies is the full list
  const displayMovies = movies

  const scrollRibbon = (dir) => ribbonRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' })

  // When provider changes, reset language filters too
  const handleProviderClick = (prov) => {
    setSelectedProvider(prov)
    setSelectedLanguages([])
    setSelectedGenres([])
  }

  // ── Movie card ─────────────────────────────────────────────
  const renderCard = (movie) => (
    <button
      key={movie.id}
      onClick={() => navigate(`/movie/${movie.id}`, { state: { isStreaming: true } })}
      className="group w-full flex-shrink-0 text-left bg-[#1a1a20] rounded-xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-white/5"
    >
      <div className="relative w-full aspect-[2/3] overflow-hidden">
        {movie.poster_url ? (
          <img src={movie.poster_url} alt={movie.title}
            className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-800 text-slate-500">No Image</div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0f0f13] via-[#0f0f13]/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-1 mb-1">
            <Star className="text-yellow-400 fill-yellow-400" size={14} />
            <span className="text-white text-xs font-bold">
              {typeof movie.rating === 'number' ? movie.rating.toFixed(1) : (movie.rating || 'N/A')}
            </span>
          </div>
          <span className="block w-full rounded-md bg-white/15 backdrop-blur-sm border border-white/20 py-2 text-center text-xs font-bold text-white shadow-lg tracking-wide">View Details</span>
        </div>
      </div>
      <div className="p-3">
        <h3 className="line-clamp-1 text-base font-bold text-white group-hover:text-[#e11d48] transition-colors">{movie.title}</h3>
        <p className="mt-1 line-clamp-1 text-xs text-gray-400">
          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Movie'}
        </p>
      </div>
    </button>
  )

  return (
    <div className="mt-6 flex flex-col md:flex-row gap-8 px-6 pb-20 max-w-[1440px] mx-auto">

      {/* ── Sidebar ── */}
      <aside className="w-full md:w-72 flex-shrink-0">
        <div className="rounded-xl bg-[#1a1a20] border border-white/5 px-5 py-6 shadow-xl sticky top-24">
          <h3 className="mb-6 text-lg font-bold text-white">Filters</h3>

          {/* Languages */}
          <div className="border-b border-white/5 pb-6">
            <div className="mb-3 flex cursor-pointer items-center justify-between text-xs font-semibold uppercase tracking-wide text-gray-400 hover:text-white transition-colors"
              onClick={() => toggleSection('languages')}>
              <div className="flex items-center gap-2">
                <span className={`transition-transform duration-200 ${expandedFilters.languages ? 'rotate-180' : ''} text-[#e11d48]`}><ChevDown /></span>
                <span>Languages</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setSelectedLanguages([]) }}
                className="text-[10px] font-medium text-[#e11d48] hover:text-rose-400 transition-colors">Clear</button>
            </div>
            {expandedFilters.languages && (
              <div className="mt-2 flex flex-wrap gap-2">
                {LANGUAGES.map(lang => {
                  const active = selectedLanguages.includes(lang)
                  return (
                    <button key={lang} onClick={() => setSelectedLanguages(toggle(selectedLanguages, lang))}
                      className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                        active ? 'bg-[#e11d48] text-white shadow-lg shadow-rose-900/20 ring-1 ring-[#e11d48]' : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-transparent'
                      }`}>{lang}</button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Genres */}
          <div className="py-6">
            <div className="mb-3 flex cursor-pointer items-center justify-between text-xs font-semibold uppercase tracking-wide text-gray-400 hover:text-white transition-colors"
              onClick={() => toggleSection('genres')}>
              <div className="flex items-center gap-2">
                <span className={`transition-transform duration-200 ${expandedFilters.genres ? 'rotate-180' : ''} text-[#e11d48]`}><ChevDown /></span>
                <span>Genres</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setSelectedGenres([]) }}
                className="text-[10px] font-medium text-[#e11d48] hover:text-rose-400 transition-colors">Clear</button>
            </div>
            {expandedFilters.genres && (
              <div className="mt-2 flex flex-wrap gap-2">
                {GENRES.map(g => {
                  const active = selectedGenres.includes(g)
                  return (
                    <button key={g} onClick={() => setSelectedGenres(toggle(selectedGenres, g))}
                      className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                        active ? 'bg-white text-black shadow-lg ring-1 ring-white' : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-transparent'
                      }`}>{g}</button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── Content ── */}
      <section className="flex-1 min-w-0">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white tracking-tight">Streaming Providers</h2>
          <div className="flex items-center gap-2 bg-[#1a1a20] rounded-full p-1 border border-white/10">
            {['Movies', 'TV Shows'].map(tab => (
              <button key={tab} onClick={() => setMediaType(tab)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  mediaType === tab ? 'bg-[#e11d48] text-white shadow-lg shadow-rose-900/30' : 'text-gray-400 hover:text-white'
                }`}>{tab}</button>
            ))}
          </div>
        </div>

        {/* Provider ribbon */}
        <div className="relative mb-8">
          <button onClick={() => scrollRibbon(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 hidden md:flex w-8 h-8 items-center justify-center rounded-full bg-[#1a1a20] border border-white/10 text-gray-400 hover:text-white hover:bg-[#25252e] transition-all shadow-xl">
            <ChevLeft />
          </button>
          {loadingProviders ? (
            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ flexShrink: 0, width: '148px', height: '76px', borderRadius: '12px', background: '#1a1a20' }} className="animate-pulse" />
              ))}
            </div>
          ) : (
            <div ref={ribbonRef} className="flex gap-4 pb-2"
              style={{ overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth' }}>
              {providers.map(p => (
                <ProviderChip key={p.id} provider={p} isActive={selectedProvider?.id === p.id} onClick={handleProviderClick} />
              ))}
            </div>
          )}
          <button onClick={() => scrollRibbon(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 hidden md:flex w-8 h-8 items-center justify-center rounded-full bg-[#1a1a20] border border-white/10 text-gray-400 hover:text-white hover:bg-[#25252e] transition-all shadow-xl">
            <ChevRight />
          </button>
        </div>

        {/* Active provider label + result count */}
        {selectedProvider && !loadingProviders && (
          <div className="mb-6 flex flex-wrap items-center gap-3">
            {selectedProvider.logo_url && (
              <img src={selectedProvider.logo_url} alt={selectedProvider.name} className="h-5 object-contain" />
            )}
            <h3 className="text-lg font-semibold text-white">{selectedProvider.name}</h3>
            <span className="text-gray-500 text-sm">— streaming in India</span>
            {(selectedLanguages.length > 0 || selectedGenres.length > 0) && (
              <span className="text-xs text-gray-500 ml-1">
                · {displayMovies.length} result{displayMovies.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}

        {/* Initial load skeleton */}
        {loadingMovies && movies.length === 0 && (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Movie grid */}
        {displayMovies.length > 0 && (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
            {displayMovies.map(renderCard)}
          </div>
        )}

        {/* Append spinner */}
        {loadingMovies && movies.length > 0 && (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-[#e11d48]" />
          </div>
        )}

        {/* Empty */}
        {!loadingMovies && displayMovies.length === 0 && !loadingProviders && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 border-2 border-dashed border-white/5 rounded-xl">
            <p className="text-lg">No movies found for the selected filters.</p>
            {(selectedLanguages.length > 0 || selectedGenres.length > 0) && (
              <button onClick={() => { setSelectedLanguages([]); setSelectedGenres([]) }}
                className="mt-4 text-sm text-[#e11d48] hover:text-rose-400 transition-colors">
                Clear filters
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

export default StreamPage
