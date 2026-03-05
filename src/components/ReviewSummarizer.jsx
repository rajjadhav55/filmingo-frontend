
import React, { useEffect, useState } from 'react'
import { exploreAPI } from '../api/exploreAPI'

const ReviewSummarizer = ({ movieId }) => {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchSummary = async (forceRefresh = false) => {
    setLoading(true)
    try {
      const data = await exploreAPI.getMovieSummary(movieId, forceRefresh)
      if (data.summary) {
        setSummary(data.summary)
      }
    } catch (err) {
      console.error("Failed to fetch summary", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Only fetch if movieId exists
    if (movieId) {
      fetchSummary()
    }
  }, [movieId])

  const handleRefresh = () => {
    fetchSummary(true) // Force refresh
  }

  if (!summary && !loading) return null

  return (
    <div className="mb-8 rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-slate-900">Audience Verdict</h3>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-brand-red hover:bg-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Refresh summary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
          >
            <path
              fillRule="evenodd"
              d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
              clipRule="evenodd"
            />
          </svg>
          Refresh
        </button>
      </div>
      
      {loading ? (
        <div className="animate-pulse space-y-2">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
        </div>
      ) : (
        <p className="text-sm text-slate-700 leading-relaxed mb-4">
            {summary}
        </p>
      )}

      <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-brand-red">
          <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813a3.75 3.75 0 0 0 2.576-2.576l.813-2.846A.75.75 0 0 1 9 4.5ZM1.5 5.25a.75.75 0 0 1 1.5 0v2.25h2.25a.75.75 0 0 1 0 1.5H3v2.25a.75.75 0 0 1-1.5 0v-2.25H.75a.75.75 0 0 1 0-1.5H1.5v-2.25Z" clipRule="evenodd" />
        </svg>
        AI-generated summary based on audience reviews
      </div>
    </div>
  )
}

export default ReviewSummarizer
