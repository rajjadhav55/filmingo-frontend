import React, { useState } from 'react'
import PlaysHeroSection from '../components/plays/PlaysHeroSection'
import SportsEventsGrid from '../components/plays/SportsEventsGrid'
import StadiumSeatLayout from '../components/plays/StadiumSeatLayout'
import CheckoutModal from '../components/plays/CheckoutModal'
import {
  FEATURED_MATCH,
  UPCOMING_MATCHES,
  SPORTS_FILTERS,
  STADIUM_SECTIONS,
} from '../data/playsData'

const PlaysPage = () => {
  const [selectedMatch, setSelectedMatch] = useState(null)
  const [showSeatLayout, setShowSeatLayout] = useState(false)
  const [checkoutData, setCheckoutData] = useState(null)
  const [showCheckout, setShowCheckout] = useState(false)

  const handleBookNow = (match) => {
    setSelectedMatch(match)
    setShowSeatLayout(true)
    // Smooth scroll to seat layout
    setTimeout(() => {
      document.getElementById('seat-layout')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleBookTickets = (match) => {
    setSelectedMatch(match)
    setShowSeatLayout(true)
    setTimeout(() => {
      document.getElementById('seat-layout')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleProceedToCheckout = (data) => {
    setCheckoutData(data)
    setShowCheckout(true)
  }

  const handleCloseCheckout = () => {
    setShowCheckout(false)
    setCheckoutData(null)
  }

  return (
    <div className="min-h-screen bg-[#0f0f13] pt-6 pb-20">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Hero Section */}
        <PlaysHeroSection
          match={FEATURED_MATCH}
          onBookNow={handleBookNow}
        />

        {/* Sports Events Grid */}
        <SportsEventsGrid
          matches={UPCOMING_MATCHES}
          filters={SPORTS_FILTERS}
          onBookTickets={handleBookTickets}
        />

        {/* Stadium Seat Layout (shown when a match is selected) */}
        {showSeatLayout && selectedMatch && (
          <div id="seat-layout">
            <StadiumSeatLayout
              match={selectedMatch}
              sections={STADIUM_SECTIONS}
              onProceedToCheckout={handleProceedToCheckout}
            />
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={handleCloseCheckout}
        bookingData={checkoutData}
      />
    </div>
  )
}

export default PlaysPage
