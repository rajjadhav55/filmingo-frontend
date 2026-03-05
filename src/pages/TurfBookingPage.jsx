import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { exploreAPI } from '../api/exploreAPI';
import { useAuth } from '../context/AuthContext.jsx';
import { ChevronLeft, Sun, Moon, Sunrise, Sunset, Plus, Check, X, Lock, Loader2 } from 'lucide-react';

const TurfBookingPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const turf = location.state?.turf || { name: 'Turf', rating: 5.0 };

  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedCourt, setSelectedCourt] = useState('ASTRO TURF');
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const { requireAuth } = useAuth();

  // Generate next 7 days for the date ribbon
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      fullDate: d,
      isoDate: d.toISOString().split('T')[0]
    };
  });

  // Base slot definitions (Structural)
  const baseSlots = [
    { id: 1, time: '04:00 - 04:30', price: 500, period: 'Mid-Night' },
    { id: 2, time: '04:30 - 05:00', price: 500, period: 'Morning' },
    { id: 3, time: '05:00 - 05:30', price: 500, period: 'Morning' },
    { id: 4, time: '05:30 - 06:00', price: 500, period: 'Morning' },
    { id: 5, time: '12:30 - 13:00', price: 600, period: 'Afternoon' },
    { id: 6, time: '13:00 - 13:30', price: 600, period: 'Afternoon' },
    { id: 7, time: '16:30 - 17:00', price: 800, period: 'Evening' },
    { id: 8, time: '17:00 - 17:30', price: 800, period: 'Evening' },
  ];

  // Fetch booked slots from DB whenever date changes
  useEffect(() => {
    const date = dates[selectedDate].isoDate;
    setLoadingBookings(true);
    setSelectedSlots([]); // Reset selection on date change
    exploreAPI.getTurfBookedSlots(id, date)
      .then(booked => {
        setBookedSlots(booked);
      })
      .catch(err => console.error("Error fetching booked slots", err))
      .finally(() => setLoadingBookings(false));
  }, [id, selectedDate]);

  // Merge base slots with booking status
  const currentSlots = baseSlots.map(slot => ({
    ...slot,
    status: bookedSlots.includes(slot.time) ? 'booked' : 'available'
  }));

  const periods = [
    { name: 'Mid-Night', icon: <Moon className="w-4 h-4" /> },
    { name: 'Morning', icon: <Sunrise className="w-4 h-4" /> },
    { name: 'Afternoon', icon: <Sun className="w-4 h-4" /> },
    { name: 'Evening', icon: <Sunset className="w-4 h-4" /> },
  ];

  const toggleSlot = (slot) => {
    if (slot.status === 'booked') return;
    
    if (selectedSlots.find(s => s.id === slot.id)) {
      setSelectedSlots(selectedSlots.filter(s => s.id !== slot.id));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  const handleBooking = () => {
    if (selectedSlots.length === 0) return;
    
    requireAuth(() => {
      const date = dates[selectedDate].isoDate;
      navigate(`/sports/turf/${id}/payment`, {
        state: {
          turf,
          selectedSlots,
          date,
          totalPrice
        }
      });
    });
  };

  const totalPrice = selectedSlots.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="min-h-screen bg-[#0f0f13] text-white pb-32">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0f0f13]/95 backdrop-blur-md border-b border-white/5 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full transition-colors mr-2">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="font-bold text-lg leading-tight">{turf.name}</h1>
            <div className="flex items-center text-xs text-gray-400">
              <span className="text-emerald-500 mr-1">★</span>
              <span>{turf.rating} (6)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a20] border-b border-white/5 py-4">
        <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-4">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z"/>
          </svg>
          {dates[0].month} 2026
        </div>

        {/* Date Ribbon */}
        <div className="flex overflow-x-auto no-scrollbar px-4 gap-3">
          {dates.map((d, i) => (
            <button
              key={i}
              onClick={() => setSelectedDate(i)}
              className={`flex-shrink-0 w-14 h-20 rounded-xl flex flex-col items-center justify-center transition-all ${
                selectedDate === i 
                  ? 'bg-[#e11d48] text-white shadow-lg shadow-rose-900/20' 
                  : 'bg-white/5 border border-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <span className="text-[10px] uppercase font-bold mb-1">{i === 0 ? 'Today' : d.day}</span>
              <span className="text-xl font-bold">{d.date}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Court Selection */}
      <div className="px-4 py-6">
        <div className="flex gap-4 mb-8">
          {['ASTRO TURF', 'Full Court'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedCourt(type)}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all border ${
                selectedCourt === type
                  ? 'border-[#e11d48] text-[#e11d48] bg-[#e11d48]/5'
                  : 'border-white/10 text-gray-400 hover:border-white/20'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-bold text-gray-300">
            {loadingBookings ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#e11d48]" />
                Checking availability...
              </span>
            ) : (
              `Available Slots (${currentSlots.filter(s => s.status === 'available').length})`
            )}
          </span>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500 uppercase tracking-wider">
             <div className="w-4 h-4 rounded bg-white/5 border border-white/5" />
             Min. 60 mins slots
          </div>
        </div>

        {/* Time Slots List Grouped by Period - Centered and Constrained */}
        <div className="max-w-[650px] mx-auto space-y-8">
          {periods.map(period => {
            const periodSlots = currentSlots.filter(s => s.period === period.name);
            if (periodSlots.length === 0) return null;

            return (
              <div key={period.name}>
                {/* Period Divider */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
                  <div className="flex items-center gap-2 text-[#e11d48] font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-[#e11d48]/10">
                    {period.icon}
                    <span>{period.name} Slots</span>
                  </div>
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
                </div>

                <div className="space-y-3">
                  {periodSlots.map(slot => {
                    const isSelected = selectedSlots.find(s => s.id === slot.id);
                    const isBooked = slot.status === 'booked';

                    return (
                      <div
                        key={slot.id}
                        onClick={() => toggleSlot(slot)}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                          isBooked 
                            ? 'bg-black/20 border-white/5 opacity-50 cursor-not-allowed'
                            : isSelected
                              ? 'bg-[#e11d48]/10 border-[#e11d48] shadow-lg shadow-rose-900/10'
                              : 'bg-[#1a1a20] border-white/5 hover:border-white/10 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-6">
                          <span className={`${isBooked ? 'text-gray-600' : isSelected ? 'text-white font-bold' : 'text-gray-300'} font-medium`}>
                            {slot.time}
                          </span>
                          <span className={`text-sm ${isBooked ? 'text-gray-600' : 'text-[#e11d48] font-bold'}`}>
                            ₹{slot.price}
                          </span>
                        </div>
                        
                        <div>
                          {isBooked ? (
                            <div className="flex items-center gap-2 text-gray-600 text-[10px] uppercase font-bold">
                              <Lock className="w-3 h-3" />
                              Booked
                            </div>
                          ) : isSelected ? (
                            <div className="w-8 h-8 rounded-full bg-[#e11d48] flex items-center justify-center shadow-lg shadow-rose-600/20">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5">
                              <Plus className="w-4 h-4 text-[#e11d48]" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Footer */}
      {selectedSlots.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#0f0f13]/95 backdrop-blur-xl border-t border-white/10 p-5 z-50 animate-in slide-in-from-bottom duration-300">
          <div className="max-w-[700px] mx-auto flex items-center justify-between gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase font-black tracking-tighter">Selected {selectedSlots.length} Slots</span>
              <span className="text-xl font-black text-white">₹{totalPrice}</span>
            </div>
            <button 
              onClick={handleBooking}
              disabled={bookingInProgress}
              className="flex-1 bg-[#e11d48] hover:bg-rose-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold text-lg py-3.5 rounded-xl shadow-xl shadow-rose-600/20 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              {bookingInProgress ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Proceed to Pay</span>
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TurfBookingPage;
