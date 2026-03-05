import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { bookingAPI } from '../api/bookingAPI'
import { Smartphone, CreditCard, Landmark, Wallet, ArrowLeft, CheckCircle2, Circle } from 'lucide-react'

const PaymentPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { showId, seats, totalPrice, sessionId } = location.state || {}
  
  const [selectedMethod, setSelectedMethod] = useState('upi')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  // Enhanced payment methods with Lucide icons
  const paymentMethods = [
    { id: 'upi', name: 'UPI', Icon: Smartphone, description: 'Google Pay, PhonePe, Paytm' },
    { id: 'card', name: 'Credit/Debit Card', Icon: CreditCard, description: 'Visa, Mastercard, Rupay' },
    { id: 'netbanking', name: 'Net Banking', Icon: Landmark, description: 'All major banks' },
    { id: 'wallet', name: 'Wallet', Icon: Wallet, description: 'Paytm, PhonePe, Amazon Pay' },
  ]

  const handlePayment = async () => {
    if (!showId || !seats || seats.length === 0) {
      setError('Invalid booking details')
      return
    }

    setProcessing(true)
    setError('')

    try {
      // Simulate payment processing delay showing animation
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Call backend to confirm booking
      const response = await bookingAPI.confirmBooking(showId, seats, selectedMethod, sessionId)
      
      // Navigate to confirmation page
      navigate('/booking-confirmation', {
        state: {
          bookingId: response.booking_id,
          seats: seats,
          totalPrice: totalPrice,
          paymentMethod: selectedMethod,
          movieTitle: response.movie_title,
          theaterName: response.theater_name,
          posterUrl: response.poster_url,
          qrBase64: response.qr_base64,
        }
      })
    } catch (err) {
      console.error('Payment failed:', err)
      setError(err.response?.data?.error || 'Payment failed. Please try again.')
      setProcessing(false)
    }
  }

  if (!showId || !seats) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center bg-[#1a1a20] p-8 rounded-2xl border border-white/5 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-2">Invalid Booking</h2>
          <p className="text-gray-400 mb-6">No booking details found</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-[#D91E43] text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#121212] pt-8 pb-16 px-4 relative overflow-hidden font-sans">
      
      {/* Background Filmingo Watermark Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-5 flex items-center justify-center">
        <div className="w-[150%] h-[150%] rotate-[-15deg] opacity-20"
             style={{
               backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, #fff 40px, #fff 80px), repeating-linear-gradient(90deg, transparent, transparent 40px, #fff 40px, #fff 80px)',
               backgroundSize: '100px 100px'
             }}
        />
      </div>

      <div className="max-w-xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="mb-8 animate-[fadeInDown_0.5s_ease-out]">
          <button
            onClick={() => navigate(-1)}
            className="text-white hover:text-white/70 mb-6 flex items-center gap-2 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-black text-white tracking-tight mb-2">
              Complete Payment
            </h1>
            <p className="text-gray-400 font-medium">
              Choose your payment method
            </p>
          </div>
        </div>

        {/* Booking Summary Card */}
        <div className="bg-[#1a1a20] rounded-2xl p-6 mb-8 shadow-2xl border border-white/5 animate-[fadeInUp_0.6s_ease-out]">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-5 text-center">
            Booking Summary
          </h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <span className="text-gray-400 font-medium">Selected Seats</span>
              <span className="text-white font-bold">{seats.join(', ')}</span>
            </div>
            
            <div className="flex justify-between items-center px-2">
              <span className="text-gray-400 font-medium">Number of Tickets</span>
              <span className="text-white font-bold">{seats.length}</span>
            </div>
            
            <div className="border-t border-white/10 pt-4 mt-2 px-2 flex justify-between items-center">
              <span className="text-gray-300 font-medium">Total Amount</span>
              <span className="text-3xl font-black text-[#D91E43] drop-shadow-[0_0_8px_rgba(217,30,67,0.3)]">
                ₹{totalPrice}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Methods Section */}
        <div className="bg-[#1a1a20] rounded-2xl p-6 mb-8 shadow-2xl border border-white/5 animate-[fadeInUp_0.7s_ease-out]">
          <h2 className="text-lg font-bold text-white mb-6">
            Select your Payment Method
          </h2>
          
          <div className="space-y-4">
            {paymentMethods.map(({ id, name, Icon, description }) => {
              const isSelected = selectedMethod === id;
              
              return (
                <button
                  key={id}
                  onClick={() => setSelectedMethod(id)}
                  className={`group w-full flex items-center gap-5 p-4 rounded-xl border-2 transition-all duration-300 relative overflow-hidden text-left focus:outline-none focus:ring-2 focus:ring-[#D91E43]/50 focus:ring-offset-2 focus:ring-offset-[#121212] ${
                    isSelected
                      ? 'border-[#D91E43] bg-[#D91E43]/10 shadow-[0_0_15px_rgba(217,30,67,0.2)] transform scale-[1.01]'
                      : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:scale-[1.01]'
                  }`}
                >
                  {/* Subtle hover gradient */}
                  {!isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  )}
                  
                  {/* Icon Container */}
                  <div className={`p-3 rounded-lg flex-shrink-0 transition-colors duration-300 ${
                    isSelected ? 'bg-[#D91E43] text-white shadow-lg shadow-[#D91E43]/40' : 'bg-white/10 text-gray-400 group-hover:text-white'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  {/* Text Details */}
                  <div className="flex-1 min-w-0">
                    <div className={`font-bold text-base truncate transition-colors ${
                      isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'
                    }`}>
                      {name}
                    </div>
                    <div className={`text-xs truncate mt-0.5 transition-colors ${
                      isSelected ? 'text-[#D91E43]/80 font-medium' : 'text-gray-500'
                    }`}>
                      {description}
                    </div>
                  </div>
                  
                  {/* Radio Indicator */}
                  <div className="flex-shrink-0 ml-2">
                    {isSelected ? (
                      <CheckCircle2 className="w-6 h-6 text-[#D91E43] drop-shadow-[0_0_8px_rgba(217,30,67,0.8)]" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-500 group-hover:text-gray-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 mb-6 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-[bounceIn_0.5s_ease-out]">
            <p className="text-red-400 text-sm font-medium text-center">{error}</p>
          </div>
        )}

        {/* Primary Action Button */}
        <div className="animate-[fadeInUp_0.8s_ease-out]">
          <button
            onClick={handlePayment}
            disabled={processing}
            className={`w-full relative overflow-hidden bg-[#D91E43] text-white py-4 rounded-xl font-bold text-lg tracking-wide shadow-[0_0_20px_rgba(217,30,67,0.4)] hover:shadow-[0_0_30px_rgba(217,30,67,0.6)] hover:bg-[#b51837] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group`}
          >
            {processing ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24 fill-none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing Payment...
              </span>
            ) : (
              <>
                <span className="relative z-10">Pay ₹{totalPrice}</span>
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-[-15deg] group-hover:animate-[shimmer_2s_infinite]" />
              </>
            )}
          </button>
        </div>

        {/* Security Note */}
        <div className="mt-8 text-center text-xs text-gray-500 font-medium px-4 animate-[fadeIn_1s_ease-out]">
          <p className="flex items-center justify-center gap-1.5 mb-1">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            This is a mock payment gateway for demonstration purposes
          </p>
          <p className="opacity-70">No actual payment will be processed</p>
        </div>

      </div>

      {/* Global CSS for custom animations */}
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        @keyframes shimmer {
          100% { transform: translateX(150%) skew(-15deg); }
        }
      `}</style>
    </div>
  )
}

export default PaymentPage
