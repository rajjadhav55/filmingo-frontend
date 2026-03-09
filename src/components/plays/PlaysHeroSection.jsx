import React, { useState, useEffect } from 'react'

const PlaysHeroSection = ({ match, onBookNow }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    if (!match) return
    const target = new Date(match.date).getTime()

    const tick = () => {
      const now = Date.now()
      const diff = Math.max(0, target - now)
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [match])

  if (!match) return null

  const pad = (n) => String(n).padStart(2, '0')

  return (
    <section className="relative w-full min-h-[520px] overflow-hidden rounded-2xl mb-10">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1920&h=800&fit=crop"
          alt="Cricket Stadium"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f13] via-[#0f0f13]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f13]/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full min-h-[520px] p-8 md:p-12">
        <div className="max-w-3xl">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e11d48]/20 text-[#e11d48] text-xs font-bold uppercase tracking-widest mb-4 border border-[#e11d48]/30">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Live Event
          </span>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-3">
            Live Cricket &<br /> Sports Events
          </h1>
          <p className="text-[#a1a1aa] text-base md:text-lg max-w-xl mb-8">
            Book tickets for IPL, World Cup, and more — experience the thrill live
          </p>

          {/* Featured Match Card */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 max-w-lg">
            {/* League Badge */}
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#e11d48] text-white text-[10px] font-bold uppercase tracking-widest mb-4">
              {match.league}
            </span>

            {/* Teams */}
            <div className="flex items-center gap-4 mb-5">
              <div className="flex items-center gap-3 flex-1">
                <img src={match.team1Logo} alt={match.team1} className="w-12 h-12 rounded-full bg-white/10 object-contain p-1" />
                <span className="text-white font-bold text-lg">{match.team1}</span>
              </div>
              <span className="text-[#e11d48] font-extrabold text-xl">VS</span>
              <div className="flex items-center gap-3 flex-1 justify-end">
                <span className="text-white font-bold text-lg text-right">{match.team2}</span>
                <img src={match.team2Logo} alt={match.team2} className="w-12 h-12 rounded-full bg-white/10 object-contain p-1" />
              </div>
            </div>

            {/* Date & Venue */}
            <div className="flex items-center gap-4 text-sm text-[#a1a1aa] mb-5">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                {new Date(match.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {match.venue}
              </span>
            </div>

            {/* Countdown Timer */}
            <div className="flex gap-3 mb-6">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Mins', value: timeLeft.minutes },
                { label: 'Secs', value: timeLeft.seconds },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center bg-white/5 rounded-xl px-4 py-2.5 border border-white/5 min-w-[60px]">
                  <span className="text-white font-extrabold text-2xl tabular-nums">{pad(item.value)}</span>
                  <span className="text-[#71717a] text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={() => onBookNow?.(match)}
              className="w-full bg-[#e11d48] hover:bg-[#f43f5e] text-white font-bold py-3.5 px-6 rounded-lg shadow-lg shadow-rose-600/25 hover:shadow-rose-600/40 transition-all active:scale-[0.97] text-sm uppercase tracking-wider"
            >
              Book Now — From ₹{match.priceFrom}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PlaysHeroSection
