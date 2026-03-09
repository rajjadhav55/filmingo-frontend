import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TIER_COLORS } from '../../data/playsData'
import SeatMap from './SeatMap'

const StadiumSeatLayout = ({ match, sections, onProceedToCheckout }) => {
  const [selectedSection, setSelectedSection] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [zoomedSection, setZoomedSection] = useState(null) // section being zoomed into
  const [view, setView] = useState('stadium') // 'stadium' | 'seats'

  const handleSectionClick = (section) => {
    if (section.available === 0) return
    setSelectedSection(section)
    setSelectedSeats([])
    setZoomedSection(section)
    setView('seats')
  }

  const handleBackToStadium = () => {
    setView('stadium')
    setZoomedSection(null)
    setSelectedSeats([])
  }

  const handleSeatsChange = (seats) => {
    setSelectedSeats(seats)
  }

  const handleProceed = () => {
    if (!selectedSection || selectedSeats.length === 0) return
    onProceedToCheckout?.({
      match,
      section: selectedSection,
      ticketCount: selectedSeats.length,
      selectedSeats,
      subtotal: selectedSection.price * selectedSeats.length,
    })
  }

  // Stadium SVG geometry helpers
  const polarToXY = (cx, cy, r, angleDeg) => {
    const rad = (angleDeg - 90) * (Math.PI / 180)
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
  }

  const renderRing = (sectionsList, radius, thickness, cx, cy) => {
    const count = sectionsList.length
    const gap = 4
    const step = 360 / count

    return sectionsList.map((sec, i) => {
      const startAngle = i * step + gap / 2
      const endAngle = (i + 1) * step - gap / 2
      const isSelected = selectedSection?.id === sec.id
      const isSoldOut = sec.available === 0
      const tier = sec.tier
      const colors = TIER_COLORS[isSoldOut ? 'Sold Out' : tier]

      const innerR = radius
      const outerR = radius + thickness

      const p1 = polarToXY(cx, cy, innerR, startAngle)
      const p2 = polarToXY(cx, cy, outerR, startAngle)
      const p3 = polarToXY(cx, cy, outerR, endAngle)
      const p4 = polarToXY(cx, cy, innerR, endAngle)

      const scaleY = 0.7
      const pathData = `
        M ${p1.x} ${cy + (p1.y - cy) * scaleY}
        L ${p2.x} ${cy + (p2.y - cy) * scaleY}
        A ${outerR} ${outerR * scaleY} 0 0 1 ${p3.x} ${cy + (p3.y - cy) * scaleY}
        L ${p4.x} ${cy + (p4.y - cy) * scaleY}
        A ${innerR} ${innerR * scaleY} 0 0 0 ${p1.x} ${cy + (p1.y - cy) * scaleY}
        Z
      `

      return (
        <motion.path
          key={sec.id}
          layoutId={`section-${sec.id}`}
          d={pathData}
          fill={isSoldOut ? '#2a2a30' : colors.fill}
          fillOpacity={isSelected ? 0.8 : isSoldOut ? 0.3 : 0.35}
          stroke={isSelected ? '#ffffff' : isSoldOut ? '#3f3f46' : colors.fill}
          strokeWidth={isSelected ? 2.5 : 1}
          className={`transition-all duration-200 ${
            isSoldOut ? 'cursor-not-allowed' : 'cursor-pointer hover:fill-opacity-60'
          }`}
          onClick={() => handleSectionClick(sec)}
          whileHover={!isSoldOut ? { fillOpacity: 0.6, scale: 1.02 } : {}}
          whileTap={!isSoldOut ? { scale: 0.98 } : {}}
        >
          <title>{sec.label} — {isSoldOut ? 'Sold Out' : `₹${sec.price} · ${sec.available} seats`}</title>
        </motion.path>
      )
    })
  }

  const CX = 250, CY = 250

  return (
    <section className="mb-16">
      {/* Match Header */}
      <div className="flex items-center gap-4 mb-8 flex-wrap">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Select Your Seats
        </h2>
        {match && (
          <span className="text-[#a1a1aa] text-sm">
            {match.team1} vs {match.team2} · {match.venue}
          </span>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Area — Stadium OR Seat Map */}
        <div className="flex-1 min-h-[500px] relative">
          <AnimatePresence mode="wait">
            {view === 'stadium' ? (
              <motion.div
                key="stadium-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="bg-[#1a1a20] rounded-2xl border border-white/5 p-6 flex flex-col items-center"
              >
                <svg viewBox="0 0 500 500" className="w-full max-w-[500px]">
                  {renderRing(sections.general || [], 190, 45, CX, CY)}
                  {renderRing(sections.premium || [], 130, 50, CX, CY)}
                  {renderRing(sections.vip || [], 80, 40, CX, CY)}

                  <ellipse cx={CX} cy={CY} rx={55} ry={30} fill="#1a3a1a" stroke="#22c55e" strokeWidth={1.5} opacity={0.7} />
                  <rect x={CX - 15} y={CY - 4} width={30} height={8} rx={2} fill="#c4a94d" opacity={0.8} />
                  <text x={CX} y={CY + 20} textAnchor="middle" fill="#71717a" fontSize="8" fontWeight="700" letterSpacing="0.1em">PITCH</text>
                </svg>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 mt-6 justify-center">
                  {Object.entries(TIER_COLORS).map(([tier, colors]) => (
                    <div key={tier} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors.fill, opacity: tier === 'Sold Out' ? 0.3 : 0.6 }} />
                      <span className="text-[#a1a1aa] text-xs font-medium">{tier}</span>
                      <span className="text-[#71717a] text-xs">({colors.label})</span>
                    </div>
                  ))}
                </div>

                {/* Hint */}
                <p className="text-[#71717a] text-xs mt-4 text-center">
                  Click a section to zoom into individual seats
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="seat-view"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <SeatMap
                  section={zoomedSection}
                  matchId={match?.id}
                  onBack={handleBackToStadium}
                  onSeatsChange={handleSeatsChange}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar: Your Selection — Glassmorphism */}
        <div className="w-full lg:w-80 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 flex flex-col h-fit lg:sticky lg:top-24">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#e11d48]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
            </svg>
            Your Selection
          </h3>

          {selectedSection && view === 'seats' ? (
            <div className="flex flex-col gap-5">
              {/* Section Info */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-bold">{selectedSection.label}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                    TIER_COLORS[selectedSection.tier].bg
                  } ${TIER_COLORS[selectedSection.tier].text} border ${TIER_COLORS[selectedSection.tier].border}`}>
                    {selectedSection.tier}
                  </span>
                </div>
                <p className="text-[#71717a] text-xs">₹{selectedSection.price.toLocaleString('en-IN')} per seat</p>
              </div>

              {/* Selected Seats List */}
              {selectedSeats.length > 0 ? (
                <div>
                  <label className="text-[#a1a1aa] text-xs font-bold uppercase tracking-widest mb-3 block">
                    Selected Seats ({selectedSeats.length})
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
                    <AnimatePresence>
                      {selectedSeats.map((seat) => (
                        <motion.button
                          key={seat.seat_id}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                          onClick={() => handleSeatsChange(selectedSeats.filter((s) => s.seat_id !== seat.seat_id))}
                          className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#e11d48]/15 border border-[#e11d48]/30 text-[#e11d48] text-xs font-bold hover:bg-[#e11d48]/25 transition-all"
                          title={`Remove ${seat.seat_id}`}
                        >
                          {seat.seat_id}
                          <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </motion.button>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <p className="text-[#71717a] text-xs text-center py-4">
                  Click on available seats to add them
                </p>
              )}

              {/* Price */}
              {selectedSeats.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-t border-white/5 pt-4"
                >
                  <div className="flex justify-between text-sm text-[#a1a1aa] mb-1">
                    <span>{selectedSeats.length} × ₹{selectedSection.price.toLocaleString('en-IN')}</span>
                    <span>₹{(selectedSection.price * selectedSeats.length).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-xl mt-2">
                    <span>Subtotal</span>
                    <span>₹{(selectedSection.price * selectedSeats.length).toLocaleString('en-IN')}</span>
                  </div>
                </motion.div>
              )}

              {/* CTA */}
              <button
                onClick={handleProceed}
                disabled={selectedSeats.length === 0}
                className={`w-full font-bold py-3.5 rounded-lg shadow-lg text-sm uppercase tracking-wider mt-2 transition-all active:scale-[0.97] ${
                  selectedSeats.length > 0
                    ? 'bg-[#e11d48] hover:bg-[#f43f5e] text-white shadow-rose-600/25 hover:shadow-rose-600/40'
                    : 'bg-white/5 text-[#71717a] cursor-not-allowed shadow-none'
                }`}
              >
                {selectedSeats.length > 0
                  ? `Proceed — ₹${(selectedSection.price * selectedSeats.length).toLocaleString('en-IN')}`
                  : 'Select seats to continue'
                }
              </button>
            </div>
          ) : view === 'stadium' && selectedSection ? (
            // Stadium view with a section previously selected
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="bg-white/5 rounded-xl p-4 border border-white/5 w-full mb-4">
                <p className="text-white font-bold">{selectedSection.label}</p>
                <p className="text-[#71717a] text-xs mt-1">Click section again to view seats</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-[#71717a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
                </svg>
              </div>
              <p className="text-[#a1a1aa] text-sm font-medium mb-1">No section selected</p>
              <p className="text-[#71717a] text-xs">Click on a stadium section to zoom into seats</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default StadiumSeatLayout
