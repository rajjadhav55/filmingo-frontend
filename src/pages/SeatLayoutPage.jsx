import React, { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { bookingAPI } from '../api/bookingAPI.js'
import { useAuth } from '../context/AuthContext.jsx'

const SeatLayoutPage = () => {
  const { showId } = useParams()
  const navigate = useNavigate()
  const [showInfo, setShowInfo] = useState(null)
  const [tiers, setTiers] = useState([])
  const [selectedSeats, setSelectedSeats] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const [sessionId, setSessionId] = useState(null)
  const [isLocking, setIsLocking] = useState(false)
  const { requireAuth } = useAuth()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const data = await bookingAPI.getSeatsForShow(showId)
        setShowInfo({
          movieTitle: data.movie_title,
          theaterName: data.theater_name,
          theaterLocation: data.theater_location,
          date: data.date,
          time: data.time,
          format: data.format,
          language: data.language,
        })
        setTiers(data.tiers || [])
      } catch (e) {
        console.error(e)
        showToast('Failed to load seat layout')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [showId])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleSeatClick = async (seat, tierPrice) => {
    if (seat.status === 'booked' || seat.status === 'locked' || isLocking) return

    const seatKey = seat.seat_number
    const isSelected = selectedSeats.some(s => s.seat_number === seatKey)
    
    setIsLocking(true)
    requireAuth(async () => {
        try {
            if (isSelected) {
                // Unlock
                await bookingAPI.lockSeats(showId, [seatKey], 'unlock', sessionId)
                setSelectedSeats(prev => prev.filter(s => s.seat_number !== seatKey))
            } else {
                // Lock
                if (selectedSeats.length >= 10) {
                    showToast('Maximum 10 seats allowed')
                    setIsLocking(false)
                    return
                }
                const res = await bookingAPI.lockSeats(showId, [seatKey], 'lock', sessionId)
                if (res.session_id) {
                    setSessionId(res.session_id)
                }
                setSelectedSeats(prev => [...prev, { seat_number: seatKey, price: tierPrice }])
            }
        } catch (err) {
            showToast(err.response?.data?.error || 'Failed to modify seat selection')
        } finally {
            setIsLocking(false)
        }
    })
  }

  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0)

  // Group a tier's seats into rows for rendering
  const groupSeatsByRow = (seats) => {
    const rowMap = {}
    seats.forEach(seat => {
      const match = seat.seat_number.match(/^([A-Z]+)(\d+)$/)
      if (match) {
        const row = match[1]
        const col = parseInt(match[2])
        if (!rowMap[row]) rowMap[row] = []
        rowMap[row].push({ ...seat, col })
      }
    })
    // Sort rows reverse alphabetically (back of theater first) and cols numerically
    const sortedRows = Object.keys(rowMap).sort().reverse()
    sortedRows.forEach(row => {
      rowMap[row].sort((a, b) => a.col - b.col)
    })
    return { sortedRows, rowMap }
  }

  // Format the date nicely
  const formattedDate = useMemo(() => {
    if (!showInfo?.date) return ''
    const d = new Date(showInfo.date + 'T00:00:00')
    return d.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }, [showInfo?.date])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-red border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f13] pb-32">
      {/* ── Header ── */}
      <div className="bg-[#1a1a20] border-b border-white/10 px-6 py-4">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-lg font-bold text-white">
              {showInfo?.movieTitle}
            </h2>
            <span className="rounded bg-brand-red/20 text-brand-red px-2 py-0.5 text-xs font-semibold">
              {showInfo?.format}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm text-white/50">
            <span>{showInfo?.theaterName}</span>
            <span className="text-white/20">|</span>
            <span>{formattedDate}</span>
            <span className="text-white/20">|</span>
            <span>{showInfo?.time}</span>
            <span className="text-white/20">|</span>
            <span>{showInfo?.language}</span>
          </div>
        </div>
      </div>

      {/* ── Seat Grid ── */}
      <div className="mx-auto max-w-4xl px-4 mt-8">
        {tiers.map((tier) => {
          const { sortedRows, rowMap } = groupSeatsByRow(tier.seats)
          return (
            <div key={tier.name} className="mb-8">
              {/* Tier label */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold text-white/50 uppercase tracking-widest">
                  {tier.name}
                </span>
                <span className="text-xs text-brand-red font-semibold">₹{tier.price}</span>
                <div className="flex-1 border-t border-white/10" />
              </div>

              {/* Rows */}
              <div className="flex flex-col items-center gap-1.5">
                {sortedRows.map((row) => (
                  <div key={row} className="flex items-center gap-1.5">
                    {/* Row label */}
                    <div className="w-6 text-center text-[11px] font-medium text-white/30">
                      {row}
                    </div>

                    {/* Seats */}
                    <div className="flex gap-1">
                      {rowMap[row].map((seat) => {
                        const isSelected = selectedSeats.some(s => s.seat_number === seat.seat_number)
                        const isBooked = seat.status === 'booked' || seat.status === 'locked'
                        // Add gap after cols 3 and 9 for aisle
                        const addGapAfter = seat.col === 3 || seat.col === 9

                        return (
                          <React.Fragment key={seat.seat_number}>
                            <button
                              onClick={() => handleSeatClick(seat, tier.price)}
                              disabled={isBooked}
                              title={`${seat.seat_number} - ${tier.name} ₹${tier.price}`}
                              className={`
                                flex h-7 w-7 items-center justify-center rounded-sm text-[9px] font-semibold
                                transition-all duration-150
                                ${isBooked
                                  ? 'bg-[#2a2a35] text-white/15 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-brand-red text-white shadow-md shadow-brand-red/30 scale-105'
                                  : 'bg-transparent border border-brand-red/50 text-brand-red/70 hover:border-brand-red hover:text-brand-red hover:bg-brand-red/10 cursor-pointer'
                                }
                              `}
                            >
                              {seat.col}
                            </button>
                            {addGapAfter && <div className="w-4" />}
                          </React.Fragment>
                        )
                      })}
                    </div>

                    {/* Row label right */}
                    <div className="w-6 text-center text-[11px] font-medium text-white/30">
                      {row}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {/* ── Screen ── */}
        <div className="flex justify-center mt-10 mb-6">
          <div className="relative w-full max-w-md">
            <div
              className="h-2 rounded-b-full bg-gradient-to-r from-transparent via-brand-red/30 to-transparent"
              style={{
                transform: 'perspective(300px) rotateX(-30deg)',
                transformOrigin: 'top',
                boxShadow: '0 4px 30px rgba(225, 29, 72, 0.15)',
              }}
            />
            <p className="text-center text-[11px] text-white/30 mt-4 font-medium tracking-wider uppercase">
              All eyes this way please!
            </p>
          </div>
        </div>

        {/* ── Legend ── */}
        <div className="flex justify-center gap-6 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-sm border border-brand-red/50" />
            <span className="text-white/40">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-sm bg-brand-red shadow-sm shadow-brand-red/30" />
            <span className="text-white/40">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-sm bg-[#2a2a35]" />
            <span className="text-white/40">Sold</span>
          </div>
        </div>
      </div>

      {/* ── Sticky Footer ── */}
      {selectedSeats.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 bg-[#1a1a20]/95 backdrop-blur-xl border-t border-white/10 px-6 py-4 shadow-2xl z-50"
          style={{
            animation: 'slideUp 0.3s ease-out',
          }}
        >
          <style>{`
            @keyframes slideUp {
              from { transform: translateY(100%); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}</style>
          <div className="mx-auto max-w-4xl flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div>
                <div className="text-[10px] text-white/40 uppercase tracking-wider">Seats</div>
                <div className="text-sm font-semibold text-white mt-0.5">
                  {selectedSeats.map(s => s.seat_number).join(', ')}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-white/40 uppercase tracking-wider">Total</div>
                <div className="text-xl font-bold text-white mt-0.5">₹{totalPrice}</div>
              </div>
            </div>
            <button
              onClick={() => {
                  navigate('/payment', {
                    state: {
                      showId,
                      seats: selectedSeats.map(s => s.seat_number),
                      totalPrice,
                      sessionId,
                    },
                  })
              }}
              disabled={isLocking}
              className={`rounded-lg px-8 py-3 text-sm font-bold text-white transition-all
                ${isLocking ? 'bg-brand-red/50 cursor-not-allowed' : 'bg-brand-red hover:bg-red-600 hover:shadow-lg hover:shadow-brand-red/30 active:scale-95'}`}
            >
              Pay ₹{totalPrice}
            </button>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 rounded-lg bg-white/10 backdrop-blur-md px-5 py-2.5 text-sm text-white shadow-xl border border-white/10 z-50">
          {toast}
        </div>
      )}
    </div>
  )
}

export default SeatLayoutPage
