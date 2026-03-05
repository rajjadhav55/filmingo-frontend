import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { exploreAPI } from '../api/exploreAPI.js'
import { API_BASE } from '../api/axiosClient.js'
import { useAuth } from '../context/AuthContext.jsx'
import ReviewSummarizer from '../components/ReviewSummarizer.jsx'

// Safely format any date string: ISO dates → locale format, bare year → just the year, invalid → blank
const formatReviewDate = (dateStr) => {
  if (!dateStr) return ''
  // If it looks like a bare year (4 digits), just return it
  if (/^\d{4}$/.test(String(dateStr).trim())) return String(dateStr).trim()
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? '' : d.toLocaleDateString()
}

const MovieDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [movie, setMovie] = useState(null)
  
  const isStreaming = location.state?.isStreaming || false

  const getImageUrl = (path) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${API_BASE}${path}`
  }

  useEffect(() => {
    const load = async () => {
      try {
        const m = await exploreAPI.getMovieDetails(id)
        setMovie(m)
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [id])

  if (!movie) return <p>Loading...</p>

  // A movie is 'in theaters' if its release date is in the future, OR if it came out within the last 21 days
  let isInTheaters = false
  if (movie.release_date) {
    const releaseDate = new Date(movie.release_date)
    const today = new Date()
    const diffTime = today.getTime() - releaseDate.getTime()
    const diffDays = diffTime / (1000 * 3600 * 24)
    // If it comes out in the future (diffDays < 0) or came out less than 21 days ago
    if (diffDays <= 21) {
      isInTheaters = true
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Banner Section */}
      <div 
        className="relative w-full bg-slate-900"
        style={{
          backgroundImage: `url(${getImageUrl(movie.image)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Dark Overlay/Blur effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/80 backdrop-blur-sm"></div>

        <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12 text-white md:flex-row items-start">
           {/* Share Button (Absolute Top Right) */}
           <div className="absolute top-6 right-6">
            <button className="flex items-center gap-2 rounded-md bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-md transition hover:bg-white/30">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
                <path d="M13 4.5a2.5 2.5 0 1 1 .702 1.737L6.97 9.604a2.518 2.518 0 0 1 0 .792l6.733 3.367a2.5 2.5 0 1 1-.443 1.54l-6.733-3.367a2.5 2.5 0 1 1 0-3.536l6.733-3.367A2.5 2.5 0 0 1 13 4.5Z" />
              </svg>
              Share
            </button>
          </div>

          {/* Left: Poster */}
          <div className="w-full flex-shrink-0 md:w-64 lg:w-72">
            <div className="relative overflow-hidden rounded-xl bg-slate-800 shadow-2xl aspect-[2/3]">
              {movie.image ? (
                <img
                  src={getImageUrl(movie.image)}
                  alt={movie.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-500">
                  No Image
                </div>
              )}
               {isInTheaters && (
                 <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-1 text-center text-xs font-semibold text-white">
                  In cinemas
                 </div>
               )}
            </div>
          </div>

          {/* Right: Details */}
          <div className="flex flex-1 flex-col pt-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
              {movie.title}
            </h1>

            {/* Rating Block — OMDb preferred, TMDB fallback for new movies */}
            {(() => {
              const omdbRatings = movie.omdb_ratings || []
              const imdbEntry = omdbRatings.find(r => r.Source === 'Internet Movie Database')
              const imdbVal = imdbEntry?.Value  // e.g. "8.7/10"
              const [score] = imdbVal ? imdbVal.split('/') : []
              const hasOmdb = omdbRatings.length > 0
              const tmdbScore = movie.avg_rating ? movie.avg_rating.toFixed(1) : null

              return (
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  {/* IMDb star score (from OMDb) or TMDB fallback */}
                  <div className="flex items-center gap-2 text-xl font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                      className={`size-8 ${imdbVal ? 'text-yellow-400' : 'text-slate-400'}`}>
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                    {imdbVal ? (
                      <>
                        <span>{score}<span className="text-base font-normal text-slate-400">/10</span></span>
                        <span className="text-sm font-semibold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded">IMDb</span>
                      </>
                    ) : tmdbScore ? (
                      <>
                        <span>{tmdbScore}<span className="text-base font-normal text-slate-400">/10</span></span>
                        <span className="text-sm font-semibold text-slate-300 bg-slate-500/30 px-2 py-0.5 rounded">TMDB</span>
                      </>
                    ) : (
                      <>
                        <span className="text-slate-500">N/A</span>
                      </>
                    )}
                  </div>
                  {/* Rotten Tomatoes pill */}
                  {omdbRatings.filter(r => r.Source === 'Rotten Tomatoes').map(r => (
                    <span key="rt" className="flex items-center gap-1 text-sm font-semibold bg-red-500/20 text-red-300 px-3 py-1 rounded-full">
                      🍅 {r.Value}
                    </span>
                  ))}
                  {/* Metacritic pill */}
                  {omdbRatings.filter(r => r.Source === 'Metacritic').map(r => (
                    <span key="mc" className="flex items-center gap-1 text-sm font-semibold bg-green-500/20 text-green-300 px-3 py-1 rounded-full">
                      🎮 {r.Value}
                    </span>
                  ))}
                </div>
              )
            })()}

            {/* Meta Info Box */}
            <div className="mt-6 flex flex-wrap items-center gap-2 rounded-lg bg-slate-800/50 px-4 py-3 text-sm font-medium text-white backdrop-blur-sm w-fit">
              {/* Dynamic Duration */}
              {movie.duration_min > 0 && (
                <>
                  <span>
                    {Math.floor(movie.duration_min / 60)}h {movie.duration_min % 60}m
                  </span>
                  <span className="text-slate-400">•</span>
                </>
              )}
              
              {/* Genres */}
              <span>{movie.genres?.join(', ') || 'Drama'}</span>
              <span className="text-slate-400">•</span>
              
              {/* Hardcoded Certification for now as not in backend */}
              <span>UA16+</span>
              <span className="text-slate-400">•</span>
              
              {/* Dynamic Date */}
              <span>{new Date(movie.release_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>

            {/* Format Buttons */}
             <div className="mt-6 flex flex-wrap gap-3">
                <span className="cursor-pointer rounded-sm bg-white px-2 py-1 text-xs font-bold uppercase text-slate-900 hover:bg-slate-200">
                  2D
                </span>
                {(movie.language || []).map(lang => (
                   <span key={lang} className="cursor-pointer rounded-sm bg-white px-2 py-1 text-xs font-bold uppercase text-slate-900 hover:bg-slate-200">
                    {lang}
                  </span>
                ))}
             </div>
             
             {/* Streaming Providers */}
             {movie.streaming_platforms && movie.streaming_platforms.length > 0 && (
               <div className="mt-6 flex flex-col gap-2">
                 <span className="text-sm font-semibold text-slate-300">Watch it on:</span>
                 <div className="flex flex-wrap gap-3">
                   {movie.streaming_platforms.map(provider => (
                     <div key={provider.name} className="flex items-center gap-2 rounded-lg bg-slate-800/50 p-2 pr-4 border border-white/5" title={provider.name}>
                        {provider.logo_url ? (
                          <img src={provider.logo_url} alt={provider.name} className="w-8 h-8 rounded-md object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-md bg-slate-700 flex items-center justify-center text-xs">
                             {provider.name.charAt(0)}
                          </div>
                        )}
                        <span className="text-sm font-medium text-white">{provider.name}</span>
                     </div>
                   ))}
                 </div>
               </div>
             )}


            {/* CTA Button */}
            {!isStreaming && (
              isInTheaters ? (
                <button
                  onClick={() => navigate(`/shows/${movie.id}`)}
                  className="mt-8 w-fit rounded-lg bg-brand-red px-10 py-3 text-lg font-bold text-white shadow-lg transition hover:bg-rose-600"
                >
                  Book tickets
                </button>
              ) : (
                <button
                  className="mt-8 flex items-center gap-2 rounded-lg bg-slate-800 px-10 py-3 text-lg font-bold text-white shadow-lg transition hover:bg-slate-700"
                  onClick={() => alert('No tickets available. This movie is no longer running in theaters.')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-slate-400">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
                  </svg>
                  Theatrical Run Ended
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="mb-4 text-2xl font-bold text-slate-900">About the movie</h2>
        <p className="text-base leading-relaxed text-slate-700 md:text-lg">
          {movie.description}
        </p>

      {/* Cast Section */}
      {movie.cast && movie.cast.length > 0 && (
        <CastSection cast={movie.cast} />
      )}

      {/* OMDb Ratings Bar */}
      {movie.omdb_ratings && movie.omdb_ratings.length > 0 && (
        <OmdbRatingsBar ratings={movie.omdb_ratings} />
      )}

      <hr className="my-8 border-slate-200" />
      
      {/* Reviews Component */}
      <ReviewsSection movieId={movie.id} />
      </div>
    </div>
  )
}

// ── Cast Section ─────────────────────────────────────────────────────────────
function CastSection({ cast }) {
  const scrollRef = useRef(null)
  // card width (140) + gap (16) = 156px per step
  const STEP = 156

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * STEP * 2, behavior: 'smooth' })
    }
  }

  return (
    <div className="my-10">
      <h3 className="mb-5 text-xl font-bold text-slate-900">Cast</h3>

      {/* Wrapper with relative positioning for the floating arrow */}
      <div className="relative">
        {/* Scrollable row */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {cast.map((member) => (
            <div
              key={member.id}
              className="flex flex-shrink-0 flex-col gap-2"
              style={{ width: '140px', scrollSnapAlign: 'start' }}
            >
              {/* Rounded-square portrait image */}
              <div className="w-[140px] aspect-[3/4] overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
                {member.profile_url ? (
                  <img
                    src={member.profile_url}
                    alt={member.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-200 text-4xl font-bold text-slate-400">
                    {member.name?.[0] ?? '?'}
                  </div>
                )}
              </div>
              {/* Name */}
              <p className="text-sm font-bold text-slate-900 leading-tight line-clamp-1">
                {member.name}
              </p>
              {/* Character */}
              {member.character && (
                <p className="text-xs text-slate-500 leading-tight line-clamp-1 -mt-1">
                  as {member.character}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Floating right arrow — matches BookMyShow reference */}
        <button
          onClick={() => scroll(1)}
          className="absolute -right-4 top-1/3 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-600 shadow-lg border border-slate-200 hover:bg-slate-50 transition"
          aria-label="Scroll cast right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
            <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  )
}


// ── OMDb Ratings Bar ────────────────────────────────────────────────────────
const SOURCE_META = {
  'Internet Movie Database': {
    label: 'IMDb',
    icon: '⭐',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    badge: 'bg-yellow-400',
  },
  'Rotten Tomatoes': {
    label: 'Rotten Tomatoes',
    icon: '🍅',
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    badge: 'bg-red-500',
  },
  'Metacritic': {
    label: 'Metacritic',
    icon: '🎮',
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    badge: 'bg-green-500',
  },
}

const OmdbRatingsBar = ({ ratings }) => (
  <div className="my-8">
    <h3 className="mb-4 text-lg font-bold text-slate-800 flex items-center gap-2">
      <span className="text-xl">🏆</span> Critics Ratings
    </h3>
    <div className="flex flex-wrap gap-4">
      {ratings.map(({ Source, Value }) => {
        const meta = SOURCE_META[Source] || {
          label: Source, icon: '📊',
          bg: 'bg-slate-50', border: 'border-slate-200',
          text: 'text-slate-700', badge: 'bg-slate-400',
        }
        return (
          <div
            key={Source}
            className={`flex items-center gap-3 rounded-xl border ${meta.border} ${meta.bg} px-5 py-4 shadow-sm min-w-[160px]`}
          >
            <span className="text-2xl">{meta.icon}</span>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wide ${meta.text} opacity-70`}>
                {meta.label}
              </p>
              <p className={`text-xl font-extrabold ${meta.text}`}>{Value}</p>
            </div>
          </div>
        )
      })}
    </div>
  </div>
)

const ReviewsSection = ({ movieId }) => {
  const { isAuthenticated, email } = useAuth()
  const [reviews, setReviews] = useState([])
  const [aiSummary, setAiSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [userReview, setUserReview] = useState(null)
  
  // Form state
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const data = await exploreAPI.getReviews(movieId)
      if (data.reviews) {
        setReviews(data.reviews)
      }
      if (data.ai_summary) {
        setAiSummary(data.ai_summary)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [movieId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rating) return alert('Please select a rating')
    
    setSubmitting(true)
    try {
      await exploreAPI.postReview(movieId, { rating, comment })
      setComment('')
      setRating(0)
      fetchReviews() // Refresh list
    } catch (err) {
      console.error(err)
      alert('Failed to post review')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return
    try {
      await exploreAPI.deleteReview(movieId, reviewId)
      fetchReviews()
    } catch (err) {
      console.error(err)
      alert('Failed to delete review')
    }
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-slate-900">Reviews & Ratings</h2>
      
      {/* AI Summary Card */}
      {aiSummary && (
        <div className="mb-8 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border border-indigo-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
             <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436h.678c2.089 0 3.86 1.468 4.196 3.493a2 2 0 0 1-1.996 2.307l-3.237-.323a.75.75 0 0 0-.616 1.05l1.63 3.535a.75.75 0 0 1-1.363.633l-1.92-4.24a.75.75 0 0 1 .253-.941l2.454-1.637a.75.75 0 0 0-.416-1.35h-3.96l-1.905-1.905a.75.75 0 0 0-.53-.22H5.97L9.315 7.584ZM4.5 9.75v-1.5a.75.75 0 0 1 1.5 0v1.5a.75.75 0 0 1-1.5 0ZM6 12.75a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0v-1.5ZM3.75 15a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                </svg>
             </div>
             <h3 className="text-lg font-bold text-indigo-900">AI Consensus</h3>
          </div>
          <p className="text-indigo-800 font-medium leading-relaxed">
            {aiSummary}
          </p>
          <p className="mt-4 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Generated by Gemini from {reviews.length} reviews
          </p>
        </div>
      )}

      {/* Write Review Box */}
      {isAuthenticated ? (
        <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">Write a Review</h3>
          <div className="mb-4 flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-2xl transition hover:scale-110 ${
                  star <= rating ? 'text-brand-red' : 'text-slate-300'
                }`}
              >
                ★
              </button>
            ))}
            <span className="ml-2 text-sm text-slate-500">{rating > 0 ? `${rating}/5` : 'Rate this movie'}</span>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full rounded-md border border-slate-300 p-3 text-sm focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
            rows="3"
          />
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-md bg-brand-red px-6 py-2 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:opacity-50"
            >
              {submitting ? 'Posting...' : 'Post Review'}
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-8 rounded-lg bg-slate-100 p-6 text-center text-slate-600">
            {/* Removed login prompt to clean up UI for demo, or keep it */}
           <p>Sign in to post your own review.</p>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
            <div className="h-24 bg-slate-200 rounded-lg"></div>
            <div className="h-24 bg-slate-200 rounded-lg"></div>
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-slate-500">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
             <div key={review.id} className="group border-b border-slate-100 pb-6 last:border-0 relative">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-lg font-bold text-slate-500 overflow-hidden">
                    {review.author_details?.avatar_path ? (
                        <img src={review.author_details.avatar_path.startsWith('/http') ? review.author_details.avatar_path.substring(1) : (review.author_details.avatar_path.startsWith('http') ? review.author_details.avatar_path : `https://image.tmdb.org/t/p/w200${review.author_details.avatar_path}`)} className="w-full h-full object-cover" alt="avatar" />
                    ) : (
                        review.author?.[0]?.toUpperCase() || 'U'
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{review.author}</p>
                    <p className="text-xs text-slate-500">{formatReviewDate(review.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   {review.rating && (
                    <div className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
                        <span className="text-brand-red">★</span>
                        {review.rating}/10
                    </div>
                   )}
                </div>
              </div>
              <p className="text-sm text-slate-700 line-clamp-4 hover:line-clamp-none transition-all">{review.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MovieDetailPage

