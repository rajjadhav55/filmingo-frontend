import React, { useState } from 'react'

const SportsEventsGrid = ({ matches, filters, onBookTickets }) => {
  const [activeFilter, setActiveFilter] = useState('all')

  const filteredMatches = activeFilter === 'all'
    ? matches
    : matches.filter(m => m.sport === activeFilter)

  return (
    <section className="mb-16">
      {/* Filter Tabs */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Upcoming Matches
        </h2>
        <div className="flex gap-1 bg-[#1a1a20] rounded-xl p-1 border border-white/5">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeFilter === filter.id
                  ? 'bg-[#e11d48] text-white shadow-lg shadow-rose-600/20'
                  : 'text-[#a1a1aa] hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="mr-1.5">{filter.icon}</span>
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {filteredMatches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#1a1a20] rounded-2xl border border-white/5">
          <span className="text-5xl mb-4">🏟️</span>
          <p className="text-white font-bold text-lg mb-1">No matches found</p>
          <p className="text-[#71717a] text-sm">Try selecting a different sport filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((match) => (
            <div
              key={match.id}
              className="group bg-[#1a1a20] rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 hover:shadow-2xl hover:shadow-rose-600/5 transition-all duration-300 flex flex-col"
            >
              {/* Card Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={match.image}
                  alt={`${match.team1} vs ${match.team2}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a20] via-transparent to-transparent opacity-80" />

                {/* Sport Badge */}
                <span className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white/90 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest border border-white/10 capitalize">
                  {match.sport}
                </span>

                {/* League Badge */}
                <span className="absolute bottom-3 left-3 bg-[#e11d48] text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-md uppercase tracking-wider">
                  {match.league}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col flex-grow">
                {/* Team Matchup */}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#e11d48] transition-colors">
                  {match.team1} vs {match.team2}
                </h3>

                {/* Date & Venue */}
                <div className="flex flex-col gap-1.5 text-sm text-[#a1a1aa] mb-4">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-[#71717a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    {new Date(match.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {' · '}
                    {new Date(match.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-[#71717a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {match.venue}
                  </span>
                </div>

                {/* Footer */}
                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-white">₹{match.priceFrom}</span>
                    <span className="text-[10px] text-[#71717a] font-bold uppercase tracking-widest">onwards</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 bg-yellow-400/10 text-yellow-400 text-xs font-bold px-2 py-1 rounded border border-yellow-400/20">
                      ★ {match.rating}
                    </span>
                    <button
                      onClick={() => onBookTickets?.(match)}
                      className="bg-[#e11d48] hover:bg-[#f43f5e] text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg hover:shadow-rose-600/25 active:scale-95 uppercase tracking-wider"
                    >
                      Book
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default SportsEventsGrid
