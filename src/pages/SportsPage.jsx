import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { exploreAPI } from '../api/exploreAPI'
import { useLocationContext } from '../context/LocationContext.jsx'

const SportsPage = () => {
  const [turfs, setTurfs] = useState([])
  const [loading, setLoading] = useState(true)
  const { location: locationStr, setLocation: setLocationStr } = useLocationContext()
  const [searchInput, setSearchInput] = useState('')
  const scrollRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    exploreAPI.getTurfs(locationStr)
      .then(data => setTurfs(data))
      .catch(err => console.error("Error fetching turfs:", err))
      .finally(() => setLoading(false))
  }, [locationStr])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      setLocationStr(searchInput.trim())
    } else {
      setLocationStr('Mumbai')
    }
  }

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f13] pt-10 pb-20">
      <div className="max-w-[1440px] mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
              Sports & Activities in {locationStr}
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl mb-6">
              Discover and book top-rated sports turfs, pitches, and activity centers. Get fit, play hard.
            </p>
            
            <form onSubmit={handleSearch} className="flex gap-2 max-w-sm">
              <input
                type="text"
                placeholder="Search location (e.g. Borivali)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full rounded-lg bg-[#1a1a20] border border-white/10 py-2.5 px-4 text-sm text-white placeholder-gray-500 focus:border-[#e11d48]/50 focus:outline-none focus:ring-1 focus:ring-[#e11d48]/50 transition-all"
              />
              <button 
                type="submit"
                className="bg-[#e11d48] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg hover:bg-rose-600 focus:ring-2 focus:ring-rose-500/50"
              >
                Search
              </button>
            </form>
          </div>
          <div className="flex gap-2 self-start md:self-end">
             <button 
                onClick={() => scroll(-1)}
                className="w-10 h-10 rounded-full border border-white/10 bg-[#1a1a20] flex items-center justify-center text-gray-400 hover:text-white hover:bg-rose-600 hover:border-rose-600 transition-all shadow-xl"
             >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
             </button>
             <button 
                onClick={() => scroll(1)}
                className="w-10 h-10 rounded-full border border-white/10 bg-[#1a1a20] flex items-center justify-center text-gray-400 hover:text-white hover:bg-rose-600 hover:border-rose-600 transition-all shadow-xl"
             >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
             </button>
          </div>
        </div>

        {/* Carousel Section */}
        {loading ? (
          <div className="flex gap-6 overflow-hidden py-4">
             {Array.from({ length: 5 }).map((_, i) => (
               <div key={i} className="flex-shrink-0 w-72 md:w-[340px] h-[340px] rounded-xl bg-[#1a1a20] animate-pulse border border-white/5" />
             ))}
          </div>
        ) : turfs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#1a1a20] text-gray-400 border border-white/5 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-4 text-gray-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            <p className="text-xl font-bold text-white mb-2">No turfs found in {locationStr}</p>
            <p className="text-sm">Try searching for a different city or neighborhood in OpenStreetMap.</p>
          </div>
        ) : (
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-8 pt-2 scroll-smooth scrollbar-hide"
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            {turfs.map(turf => (
              <div 
                key={turf.id} 
                className="flex-shrink-0 w-72 md:w-[340px] bg-[#1a1a20] rounded-2xl overflow-hidden border border-white/5 shadow-lg hover:shadow-2xl hover:border-white/10 group transition-all duration-300 flex flex-col"
              >
                {/* Top Half: Image & Overlays */}
                <div className="relative h-48 md:h-52 w-full overflow-hidden">
                  <img 
                    src={turf.image_url} 
                    alt={turf.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a20] via-transparent to-transparent opacity-60"></div>
                  
                  {/* Featured Badge Overlay as requested */}
                  <div className="absolute bottom-3 left-3 bg-red-600 text-white text-[10px] md:text-xs font-bold px-2.5 py-1 rounded shadow-md uppercase tracking-wider backdrop-blur-sm border border-red-500/50">
                    Featured
                  </div>
                  
                  {/* Sport Type Badge */}
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white/90 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider border border-white/10">
                    {turf.sport}
                  </div>
                </div>

                {/* Bottom Half: Details */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-1.5 gap-2">
                    <h3 className="text-lg md:text-xl font-bold text-white line-clamp-1 group-hover:text-red-500 transition-colors">
                      {turf.name}
                    </h3>
                    <div className="bg-yellow-400/10 text-yellow-400 text-xs font-bold px-2 py-1 rounded flex items-center gap-1 flex-shrink-0 border border-yellow-400/20">
                      ★ {turf.rating}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-5 line-clamp-1 flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-500">
                        <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.02.01.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
                    </svg>
                    {turf.location} <span className="text-gray-600 px-1">•</span> {turf.distance}
                  </p>

                  <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
                    <div>
                        <span className="text-lg font-bold text-white">
                        ₹{turf.price_per_hour}
                        </span>
                        <span className="text-xs text-gray-500 font-medium ml-1 uppercase tracking-wider">/ hr</span>
                    </div>
                    <button 
                      onClick={() => navigate(`/sports/turf/${turf.id}`, { state: { turf } })}
                      className="bg-[#e11d48] hover:bg-rose-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg hover:shadow-rose-600/25 active:scale-95"
                    >
                      Book Turf
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SportsPage
