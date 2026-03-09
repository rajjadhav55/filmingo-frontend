import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TIER_COLORS } from '../../data/playsData'
import { fetchSeatsBySection } from '../../api/seatAPI'

// ── Animation Variants ──
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.008, delayChildren: 0.15 },
  },
  exit: {
    transition: { staggerChildren: 0.005, staggerDirection: -1 },
  },
}

const seatVariants = {
  hidden: { opacity: 0, scale: 0.3, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 500, damping: 28 } },
  exit: { opacity: 0, scale: 0.3, transition: { duration: 0.12 } },
}

const SEAT_STATUS_STYLES = {
  available: {
    base: 'bg-sky-400/30 border-sky-400/40 hover:bg-sky-400/50 hover:border-sky-400/60 hover:shadow-sky-400/20 cursor-pointer',
    dot: 'bg-sky-400',
  },
  selected: {
    base: 'bg-[#e11d48]/40 border-[#e11d48]/60 shadow-lg shadow-rose-600/20 cursor-pointer ring-1 ring-[#e11d48]/40',
    dot: 'bg-[#e11d48]',
  },
  sold: {
    base: 'bg-zinc-800/40 border-zinc-700/30 cursor-not-allowed opacity-40',
    dot: 'bg-zinc-600',
  },
}

const SeatMap = ({ section, matchId, onBack, onSeatsChange }) => {
  const [seats, setSeats] = useState([])
  const [selectedSeats, setSelectedSeats] = useState([])
  const [loading, setLoading] = useState(true)

  const tierColors = TIER_COLORS[section?.tier] || TIER_COLORS.General

  // Fetch seats from API
  useEffect(() => {
    if (!section) return
    setLoading(true)
    setSelectedSeats([])
    fetchSeatsBySection(section.id, matchId)
      .then((data) => {
        setSeats(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch seats:', err)
        setLoading(false)
      })
  }, [section?.id, matchId])

  // Notify parent when selected seats change
  useEffect(() => {
    onSeatsChange?.(selectedSeats)
  }, [selectedSeats])

  const toggleSeat = (seat) => {
    if (seat.status === 'sold') return
    setSelectedSeats((prev) => {
      const exists = prev.find((s) => s.seat_id === seat.seat_id)
      if (exists) return prev.filter((s) => s.seat_id !== seat.seat_id)
      if (prev.length >= 10) return prev // max 10 seats
      return [...prev, seat]
    })
  }

  const isSeatSelected = (seatId) => selectedSeats.some((s) => s.seat_id === seatId)

  // Group seats by row for the curved layout
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = []
    acc[seat.row].push(seat)
    return acc
  }, {})

  const rowKeys = Object.keys(seatsByRow)
  const cols = rowKeys.length > 0 ? seatsByRow[rowKeys[0]].length : 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-[#a1a1aa] hover:text-white text-sm font-medium transition-colors group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to Stadium
          </button>
          <div className="w-px h-5 bg-white/10" />
          <h3 className="text-white font-bold text-lg">{section?.label}</h3>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${tierColors.bg} ${tierColors.text} border ${tierColors.border}`}>
            {section?.tier}
          </span>
        </div>
        <div className="text-[#71717a] text-xs">
          {selectedSeats.length > 0 ? (
            <span className="text-white font-medium">{selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''} selected</span>
          ) : (
            'Click seats to select'
          )}
          <span className="text-[#71717a] ml-2">· max 10</span>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="bg-[#1a1a20] rounded-2xl border border-white/5 p-6 overflow-hidden">
        {/* Screen / Pitch indicator */}
        <div className="flex justify-center mb-8">
          <div className="w-48 h-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent rounded-full" />
        </div>
        <p className="text-center text-[#71717a] text-[10px] font-bold uppercase tracking-[0.2em] -mt-6 mb-6">
          ← Pitch Side →
        </p>

        {loading ? (
          // Skeleton loader
          <div className="flex flex-col items-center gap-2 py-10">
            {Array.from({ length: 6 }).map((_, r) => (
              <div key={r} className="flex gap-1.5 justify-center">
                {Array.from({ length: 12 }).map((_, c) => (
                  <div key={c} className="w-7 h-7 rounded bg-white/5 animate-pulse" />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center gap-1.5"
            style={{
              perspective: '800px',
            }}
          >
            {rowKeys.map((rowLabel, rowIdx) => {
              // Slight curve: middle rows are wider, edge rows are narrower
              const curveAmount = 1 - Math.abs(rowIdx - rowKeys.length / 2) / (rowKeys.length / 2) * 0.06
              const rotateX = (rowIdx / rowKeys.length) * 4 - 2 // subtle tilt

              return (
                <motion.div
                  key={rowLabel}
                  className="flex items-center gap-1.5"
                  style={{
                    transform: `perspective(800px) rotateX(${rotateX}deg) scaleX(${curveAmount})`,
                    transformOrigin: 'center center',
                  }}
                >
                  {/* Row label */}
                  <span className="w-5 text-right text-[10px] text-[#71717a] font-bold mr-1 select-none">
                    {rowLabel}
                  </span>

                  {/* Seats */}
                  {seatsByRow[rowLabel].map((seat) => {
                    const selected = isSeatSelected(seat.seat_id)
                    const status = selected ? 'selected' : seat.status
                    const styles = SEAT_STATUS_STYLES[status] || SEAT_STATUS_STYLES.available

                    return (
                      <motion.button
                        key={seat.seat_id}
                        variants={seatVariants}
                        onClick={() => toggleSeat(seat)}
                        disabled={seat.status === 'sold'}
                        title={`${seat.seat_id} · ${seat.status === 'sold' ? 'Sold Out' : `₹${seat.price}`}`}
                        className={`w-7 h-7 rounded border flex items-center justify-center transition-all duration-150 ${styles.base}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
                      </motion.button>
                    )
                  })}

                  {/* Row label right */}
                  <span className="w-5 text-left text-[10px] text-[#71717a] font-bold ml-1 select-none">
                    {rowLabel}
                  </span>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-8 pt-4 border-t border-white/5">
          {[
            { label: 'Available', styles: SEAT_STATUS_STYLES.available },
            { label: 'Selected', styles: SEAT_STATUS_STYLES.selected },
            { label: 'Sold Out', styles: SEAT_STATUS_STYLES.sold },
          ].map(({ label, styles }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded border flex items-center justify-center ${styles.base.split('hover')[0]}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
              </div>
              <span className="text-[#a1a1aa] text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default SeatMap
