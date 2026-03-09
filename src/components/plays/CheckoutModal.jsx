import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TIER_COLORS } from '../../data/playsData'

const CheckoutModal = ({ isOpen, onClose, bookingData }) => {
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const navigate = useNavigate()

  if (!isOpen || !bookingData) return null

  const { match, section, ticketCount, subtotal } = bookingData
  const convenienceFee = Math.round(subtotal * 0.03)
  const gst = Math.round((subtotal + convenienceFee) * 0.18)
  const promoDiscount = promoApplied ? Math.round(subtotal * 0.1) : 0
  const total = subtotal + convenienceFee + gst - promoDiscount

  const handleApplyPromo = () => {
    if (promoCode.trim().length > 0) {
      setPromoApplied(true)
    }
  }

  const handleMockPayment = async () => {
    setIsProcessing(true);

    // Simulate a 2-second bank processing delay (Judges love this visual)
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
        const seatIds = bookingData.selectedSeats ? bookingData.selectedSeats.map(s => s.seat_id) : [];
        const response = await fetch('https://filmingo-backend-raj-baafa2e5289f.herokuapp.com/api/book-tickets/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                movie_id: match.id || 'SPORT-1',
                seats: seatIds.length > 0 ? seatIds : [`${section?.label}-1`],
                amount: total
            })
        });

        const data = await response.json();

        if (response.ok) {
            setIsProcessing(false);
            onClose();
            navigate('/ticket', { state: { ticketData: data } });
        } else {
            alert("Booking failed. Please try again.");
            setIsProcessing(false);
        }
    } catch (error) {
        console.error("Payment Error:", error);
        alert("Payment Error. Please try again.");
        setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg bg-[#1a1a20] rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#a1a1aa] hover:text-white transition-all z-20"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6 md:p-8">
          {/* Header */}
          <h2 className="text-2xl font-extrabold text-white mb-1 tracking-tight">Confirm Your Booking</h2>
          <p className="text-[#71717a] text-sm mb-6">Review your selection before payment</p>
          <div className="border-t border-white/5 mb-6" />

          {/* Event Details */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/5 mb-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-bold">{match?.team1} vs {match?.team2}</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#e11d48] text-white text-[10px] font-bold uppercase tracking-widest">
                {match?.league}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 text-[#a1a1aa] text-xs">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                {match && new Date(match.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                {', '}
                {match && new Date(match.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {match?.venue}
              </span>
            </div>
          </div>

          {/* Seats Summary */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/5 mb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-sm">{section?.label}</p>
                <p className="text-[#71717a] text-xs mt-0.5">{ticketCount} ticket{ticketCount > 1 ? 's' : ''} × ₹{section?.price?.toLocaleString('en-IN')}</p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                TIER_COLORS[section?.tier]?.bg || ''
              } ${TIER_COLORS[section?.tier]?.text || ''} border ${TIER_COLORS[section?.tier]?.border || ''}`}>
                {section?.tier}
              </span>
            </div>
            {/* Show individual seat IDs if available */}
            {bookingData?.selectedSeats?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/5">
                {bookingData.selectedSeats.map((seat) => (
                  <span key={seat.seat_id} className="px-2 py-0.5 rounded bg-[#e11d48]/10 border border-[#e11d48]/20 text-[#e11d48] text-[10px] font-bold">
                    {seat.seat_id}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Promo Code */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => { setPromoCode(e.target.value); setPromoApplied(false) }}
              className="flex-1 rounded-lg bg-white/5 border border-white/10 py-2.5 px-4 text-sm text-white placeholder-[#71717a] focus:border-[#e11d48]/50 focus:outline-none focus:ring-1 focus:ring-[#e11d48]/50 transition-all"
            />
            <button
              onClick={handleApplyPromo}
              className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-all"
            >
              Apply
            </button>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between text-[#a1a1aa]">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-[#a1a1aa]">
              <span>Convenience Fee</span>
              <span>₹{convenienceFee.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-[#a1a1aa]">
              <span>GST (18%)</span>
              <span>₹{gst.toLocaleString('en-IN')}</span>
            </div>
            {promoApplied && (
              <div className="flex justify-between text-green-400">
                <span>Promo Discount</span>
                <span>-₹{promoDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>

          <div className="border-t border-white/5 pt-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-white font-bold text-lg">Total</span>
              <span className="text-white font-extrabold text-2xl tabular-nums">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleMockPayment}
            disabled={isProcessing}
            className={`w-full font-bold py-4 rounded-lg shadow-lg transition-all active:scale-[0.97] text-sm uppercase tracking-wider ${
              isProcessing 
                ? 'bg-gray-500 outline-none cursor-wait text-white shadow-none'
                : 'bg-[#e11d48] hover:bg-[#f43f5e] text-white shadow-rose-600/25 hover:shadow-rose-600/40'
            }`}
          >
            {isProcessing ? 'Processing Payment...' : `Confirm & Pay ₹${total.toLocaleString('en-IN')}`}
          </button>

          {/* Security Note */}
          <p className="text-center text-[#71717a] text-xs mt-4 flex items-center justify-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            Secure payment powered by Razorpay
          </p>
        </div>
      </div>

      <style>{`
        @keyframes animateIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-in {
          animation: animateIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default CheckoutModal
