import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { exploreAPI } from '../api/exploreAPI.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useLocationContext } from '../context/LocationContext.jsx'
import { Search, MapPin, User, Menu, Bell } from './Icons'

const ChevronDown = ({ size = 16, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 9l6 6 6-6"/>
  </svg>
)

const Navbar = () => {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('search') || '')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const { location: currentLocation, setLocation: setCurrentLocation, locationsList: locations } = useLocationContext()
  
  const [isLocationOpen, setIsLocationOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const locationRef = useRef(null)
  const userMenuRef = useRef(null)

  const { isAuthenticated, email, user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setIsLocationOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (!query.trim()) {
      navigate('/')
      return
    }
    navigate(`/?search=${encodeURIComponent(query.trim())}`)
  }

  const getUserInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase()
    if (email) return email.charAt(0).toUpperCase()
    return 'U'
  }

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0f0f13]/95 backdrop-blur-md text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold tracking-tight text-white hover:opacity-90 transition">
            <span className="text-[#e11d48]">Film</span>ingo
          </Link>
          
          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
            {['Movies', 'Events', 'Plays'].map((link) => (
              <a 
                key={link} 
                href="#" 
                className="transition-colors hover:text-white relative group"
              >
                {link}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#e11d48] transition-all group-hover:w-full"></span>
              </a>
            ))}
            <Link to="/sports" className="transition-colors hover:text-white relative group">
              Sports
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#e11d48] transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/stream" className="transition-colors hover:text-white relative group">
              Stream
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#e11d48] transition-all group-hover:w-full"></span>
            </Link>
             {isAuthenticated && (
                <Link to="/my-bookings" className="transition-colors hover:text-white relative group">
                    My Bookings
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#e11d48] transition-all group-hover:w-full"></span>
                </Link>
             )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-lg mx-8 relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#e11d48] transition-colors">
            <Search size={18} />
          </div>
          <form onSubmit={handleSearchSubmit} className="w-full">
            <input
              type="text"
              placeholder="Search for movies, events, sports..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-full bg-[#1a1a20] border border-white/10 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#e11d48]/50 focus:bg-[#25252e] focus:outline-none focus:ring-1 focus:ring-[#e11d48]/50 transition-all"
            />
          </form>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          
          {/* Location Dropdown */}
          <div className="relative hidden md:flex items-center gap-1 text-gray-400 font-medium cursor-pointer" ref={locationRef}>
            <button 
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="flex items-center gap-1 hover:text-white transition-colors"
            >
                <MapPin size={16} />
                <span className="text-white text-sm">{currentLocation}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isLocationOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isLocationOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 overflow-hidden rounded-xl border border-white/10 bg-[#1a1a20] shadow-xl ring-1 ring-black ring-opacity-5 z-50">
                    <div className="max-h-60 overflow-y-auto py-1">
                        {locations.length > 0 ? (
                            locations.map(loc => (
                                <button
                                    key={loc}
                                    onClick={() => {
                                        setCurrentLocation(loc)
                                        setIsLocationOpen(false)
                                    }}
                                    className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-white/5 ${
                                        currentLocation === loc ? 'text-[#e11d48] font-semibold bg-white/5' : 'text-gray-300'
                                    }`}
                                >
                                    {loc}
                                </button>
                            ))
                        ) : (
                            <button
                                onClick={() => {
                                    setCurrentLocation('Mumbai')
                                    setIsLocationOpen(false)
                                }}
                                className="block w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/5"
                            >
                                Mumbai
                            </button>
                        )}
                    </div>
                </div>
            )}
          </div>
          
          <button className="hidden md:block p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors">
            <Bell size={20} />
          </button>

          {/* ── User Area ── */}
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 group"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e11d48] text-white font-bold text-sm shadow-md border border-rose-400/20 transition group-hover:shadow-lg group-hover:shadow-brand-red/20">
                  {getUserInitial()}
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 hidden md:block ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-[#1a1a20] shadow-2xl z-50"
                  style={{ animation: 'modalSlideUp 0.15s ease-out' }}
                >
                  <style>{`
                    @keyframes modalSlideUp {
                      from { transform: translateY(8px); opacity: 0; }
                      to { transform: translateY(0); opacity: 1; }
                    }
                  `}</style>

                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
                    <p className="text-xs text-white/40 truncate">{email}</p>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    <button
                      onClick={() => { setIsUserMenuOpen(false) }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      My Profile
                    </button>

                    <Link
                      to="/my-bookings"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                      My Bookings
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-white/10 py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 rounded-full bg-[#e11d48] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-900/20 transition-transform hover:scale-105 hover:bg-rose-600">
              Sign In
            </Link>
          )}
          
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-300">
            <Menu size={24} />
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#1a1a20] px-6 py-4 space-y-4">
             {['Movies', 'Events', 'Plays'].map((link) => (
              <a key={link} href="#" className="block text-gray-400 hover:text-white">{link}</a>
            ))}
            <Link to="/sports" className="block text-gray-400 hover:text-white">Sports</Link>
            <Link to="/stream" className="block text-gray-400 hover:text-white">Stream</Link>
            {isAuthenticated && <Link to="/my-bookings" className="block text-gray-400 hover:text-white">My Bookings</Link>}
            <div className="pt-4 border-t border-white/10">
                 {isAuthenticated ? (
                     <button onClick={handleLogout} className="text-[#e11d48] font-medium">Logout</button>
                 ) : (
                     <Link to="/login" className="block w-full text-center bg-[#e11d48] text-white py-2 rounded-lg font-medium">Sign In</Link>
                 )}
            </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
