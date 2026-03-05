import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, CreditCard, Smartphone, Landmark, Wallet, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';
import { exploreAPI } from '../api/exploreAPI';

const TurfPaymentPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { turf, selectedSlots, date, totalPrice } = location.state || {};

  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: <Smartphone className="w-5 h-5" />, desc: 'Google Pay, PhonePe, Paytm' },
    { id: 'card', name: 'Credit / Debit Card', icon: <CreditCard className="w-5 h-5" />, desc: 'Visa, Mastercard, Rupay' },
    { id: 'netbanking', name: 'Net Banking', icon: <Landmark className="w-5 h-5" />, desc: 'All major banks supported' },
    { id: 'wallet', name: 'Wallets', icon: <Wallet className="w-5 h-5" />, desc: 'Amazon Pay, Mobikwik' },
  ];

  const handlePayment = async () => {
    setProcessing(true);
    setError('');

    try {
      // Simulate bank latency
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create bookings in backend
      await exploreAPI.bookTurfSlot({
        turf_id: id,
        turf_name: turf.name,
        turf_location: turf.location || 'Sports Venue',
        booking_date: date,
        time_slots: selectedSlots,
        total_price: selectedSlots.reduce((sum, slot) => sum + slot.price, 0)
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/my-bookings');
      }, 2500);
    } catch (err) {
      console.error('Payment Error:', err);
      setError('Payment processing failed. Please try again.');
      setProcessing(false);
    }
  };

  if (!turf || !selectedSlots) {
    return (
      <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-400 mb-4">No booking details found.</p>
          <button onClick={() => navigate(-1)} className="text-rose-500 font-bold underline">Go Back</button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0f0f13] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </div>
        <h1 className="text-3xl font-black mb-2">Booking Confirmed!</h1>
        <p className="text-gray-400 mb-8 max-w-xs">Your slots at {turf.name} have been successfully reserved.</p>
        <div className="animate-pulse text-sm text-rose-500 font-bold uppercase tracking-widest">Redirecting to tickets...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f13] text-white pb-32">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0f0f13]/95 backdrop-blur-md border-b border-white/5 px-4 py-4 flex items-center">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full transition-colors mr-2">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="font-bold text-lg">Payments</h1>
      </div>

      <div className="max-w-[500px] mx-auto p-4">
        {/* Order Summary */}
        <div className="bg-[#1a1a20] rounded-2xl border border-white/5 p-5 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="font-bold text-lg text-rose-500 uppercase tracking-tight">{turf.name}</h2>
              <p className="text-xs text-gray-500 mt-1">{selectedSlots.length} Slots Selected • {date}</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-black italic">₹{totalPrice}</div>
              <div className="text-[10px] text-gray-500 uppercase">including GST</div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
            {selectedSlots.map(s => (
              <span key={s.id} className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded text-gray-400">
                {s.time}
              </span>
            ))}
          </div>
        </div>

        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-1">Choose Payment Method</h3>
        
        {/* Payment Methods */}
        <div className="space-y-3 mb-8">
          {paymentMethods.map(method => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                selectedMethod === method.id
                  ? 'bg-rose-500/5 border-rose-500 shadow-lg shadow-rose-900/10'
                  : 'bg-[#1a1a20] border-white/5 hover:border-white/10'
              }`}
            >
              <div className={`p-2.5 rounded-lg ${selectedMethod === method.id ? 'bg-rose-500 text-white' : 'bg-white/5 text-gray-400'}`}>
                {method.icon}
              </div>
              <div className="flex-1 text-left">
                <div className={`font-bold text-sm ${selectedMethod === method.id ? 'text-white' : 'text-gray-300'}`}>
                  {method.name}
                </div>
                <div className="text-[10px] text-gray-500">{method.desc}</div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedMethod === method.id ? 'border-rose-500' : 'border-white/10'
              }`}>
                {selectedMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />}
              </div>
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs font-medium">
            {error}
          </div>
        )}

        <div className="flex items-center gap-2 text-gray-500 mb-6 px-1">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="text-[10px] uppercase font-bold tracking-wider">100% SECURE TRANSACTIONS SSL ENCRYPTED</span>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={processing}
          className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-black text-lg py-4 rounded-2xl shadow-xl shadow-rose-600/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          {processing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Verifying {selectedMethod.toUpperCase()}...</span>
            </>
          ) : (
            <span>Confirm & Pay ₹{totalPrice}</span>
          )}
        </button>

        <p className="mt-6 text-center text-[10px] text-gray-600 italic">
          * This is a simulated environment. No actual funds will be deducted.
        </p>
      </div>
    </div>
  );
};

export default TurfPaymentPage;
