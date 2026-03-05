import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Film, QrCode } from 'lucide-react'

const BookingConfirmationPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const demoState = { bookingId: 'FILM-987X4A', seats: ['G12', 'G13'], totalPrice: 600, paymentMethod: 'upi', movieTitle: 'Subedaar', theaterName: 'Cinema', posterUrl: '', qrBase64: '' }
  const { bookingId, seats, totalPrice, paymentMethod, movieTitle, theaterName, posterUrl, qrBase64 } = location.state || demoState

  useEffect(() => {
    // Confetti effect or celebration animation could go here
    if (bookingId) {
      console.log('Booking confirmed:', bookingId)
    }
  }, [bookingId])

  if (!bookingId) {
    return (
      <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Booking Found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-[#e11d48] hover:underline font-semibold"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  const getPaymentMethodName = (method) => {
    const methods = {
      upi: 'UPI',
      card: 'Credit/Debit Card',
      netbanking: 'Net Banking',
      wallet: 'Wallet'
    }
    return methods[method] || method
  }

  return (
    <div className="min-h-screen bg-[#0f0f13] py-12 px-4 selection:bg-[#e11d48]/30">
      <div className="max-w-xl mx-auto">
        
        {/* Success Animation & Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6 shadow-[0_0_20px_rgba(34,197,94,0.4)] animate-bounce">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Booking Confirmed!</h1>
          <p className="text-gray-400 text-sm">Your premium digital ticket is ready.</p>
        </div>

        {/* Digital Ticket Card */}
        <div className="relative bg-[#1a1a20] rounded-2xl shadow-2xl flex flex-col mb-10 overflow-hidden border border-white/5">
            
          {/* Top Header Section (Red) */}
          <div className="bg-gradient-to-r from-[#e11d48] to-[#9f1239] p-6 text-white flex gap-6">
            {/* Poster or Placeholder */}
            {posterUrl ? (
              <img 
                src={posterUrl.startsWith('http') ? posterUrl : `http://localhost:8000${posterUrl}`} 
                alt="Movie Poster" 
                className="w-24 h-32 object-cover rounded-lg border border-white/10 shadow-inner"
              />
            ) : (
              <div className="w-24 h-32 bg-black/40 rounded-lg border border-white/10 flex flex-col items-center justify-center flex-shrink-0 shadow-inner">
                <Film className="w-8 h-8 text-white/40 mb-2" />
                <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Admit One</span>
              </div>
            )}
            
            {/* Booking Info */}
            <div className="flex flex-col justify-center flex-1">
              <div className="mb-4">
                <p className="text-[10px] uppercase tracking-widest text-white/70 font-bold mb-1">Booking ID</p>
                <p className="text-2xl font-black font-mono tracking-tighter drop-shadow-md">{bookingId}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/70 font-bold mb-1">Amount Paid</p>
                <p className="text-xl font-bold drop-shadow-md">₹{totalPrice}</p>
              </div>
            </div>
          </div>

          {/* Middle Dashed Line with Cutouts */}
          <div className="relative h-12 bg-[#1a1a20] flex items-center">
            {/* Dashed Line */}
            <div className="absolute left-6 right-6 border-t-2 border-dashed border-gray-600/50" />
            
            {/* Left Cutout */}
            <div 
              className="absolute left-0 w-8 h-8 bg-[#0f0f13] rounded-full -translate-x-1/2 border-r border-white/5" 
              style={{ boxShadow: 'inset -4px 0 6px rgba(0,0,0,0.5)' }} 
            />
            {/* Right Cutout */}
            <div 
              className="absolute right-0 w-8 h-8 bg-[#0f0f13] rounded-full translate-x-1/2 border-l border-white/5" 
              style={{ boxShadow: 'inset 4px 0 6px rgba(0,0,0,0.5)' }} 
            />
          </div>

          {/* Details Section */}
          <div className="px-8 pb-4">
            <div className="grid grid-cols-2 gap-y-8 gap-x-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1.5 font-bold">Date & Time</p>
                  <p className="text-sm font-bold text-white">
                    {new Date().toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1.5 font-bold">Payment Method</p>
                  <p className="text-sm font-bold text-white">{getPaymentMethodName(paymentMethod)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1.5 font-bold">Seats ({seats.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {seats.map((seat) => (
                      <span key={seat} className="inline-flex items-center justify-center bg-white/5 border border-white/10 text-white px-2.5 py-1 rounded text-xs font-bold shadow-sm">
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>
                 <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1.5 font-bold">Tickets</p>
                   <p className="text-sm font-bold text-white">{seats.length} Tickets</p>
                </div>
            </div>
          </div>

          {/* Barcode Section at Bottom */}
          <div className="px-8 pb-8 pt-6 flex flex-col items-center">
            <div className="w-full border-t border-white/5 mb-6" />
            {qrBase64 ? (
               <img src={`data:image/png;base64,${qrBase64}`} alt="QR Code" className="w-32 h-32 mb-3 bg-white p-2 rounded" />
            ) : (
               <QrCode className="w-24 h-24 text-white/90 mb-3" strokeWidth={1.5} />
            )}
            <p className="text-[10px] text-gray-500 uppercase font-mono tracking-[0.2em]">{bookingId.split('-').join('')}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-10">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-transparent border-2 border-[#e11d48] text-[#e11d48] py-4 rounded-xl font-bold hover:bg-[#e11d48]/10 transition-colors active:scale-95"
            >
              Back to Home
            </button>  
            <button
              onClick={() => alert('Ticket download feature coming soon!')}
              className="w-full bg-[#e11d48] text-white py-4 rounded-xl font-bold shadow-lg shadow-rose-900/20 hover:bg-rose-600 transition-colors active:scale-95"
            >
              Download Ticket
            </button>
        </div>

        {/* Info Box */}
        <div className="bg-[#121625] border border-blue-900/40 rounded-xl p-6 shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="flex gap-4 relative z-10">
            <div className="mt-0.5 flex-shrink-0">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold ring-1 ring-blue-500/30">i</span>
            </div>
            <div>
              <p className="font-bold text-blue-100 mb-2 text-sm uppercase tracking-wider">Important Information</p>
              <ul className="list-disc list-outside ml-4 space-y-2 text-xs text-blue-200/60 leading-relaxed marker:text-blue-500/50">
                <li>Please arrive at the venue at least 15 minutes prior to the showtime.</li>
                <li>Carry a valid physical or digital ID proof for age verification at the entrance.</li>
                <li>Show this digital ticket (QR code) directly at the scanner to gain entry.</li>
                <li>Outside food and beverages are strictly prohibited inside the premises.</li>
              </ul>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default BookingConfirmationPage
