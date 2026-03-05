import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { exploreAPI } from '../api/exploreAPI';
import { Shirt, Droplet, BriefcaseMedical, Lightbulb, Car, Users, CheckCircle } from 'lucide-react';

const TurfDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Basic info passed from the list page
  const turf = location.state?.turf || null;
  
  // Hydration state
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
    
    setLoading(true);
    exploreAPI.getTurfDetails(id)
      .then(data => {
        setDetails(data);
      })
      .catch(err => console.error("Error fetching turf details", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (!turf) {
    return (
      <div className="min-h-screen bg-[#0f0f13] pt-24 pb-20 text-white flex items-center justify-center">
        <p>Turf not found. Please select a turf from the Sports page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f13] pb-28 text-white relative">
      
      {/* Top Navigation Bar with Back Button */}
      <div className="sticky top-0 z-50 bg-[#0f0f13]/80 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center shadow-md">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>
        <span className="ml-4 font-bold text-lg">Back to Sports</span>
      </div>

      {/* Main Content Scrollable Area */}
      <div className="max-w-[700px] mx-auto p-4 md:p-6 space-y-6">
        
        {/* 1. HEADER CARD */}
        <div className="bg-[#1a1a20] rounded-2xl overflow-hidden shadow-lg border border-white/5">
          {/* Cover Image */}
          <div className="h-64 md:h-80 w-full relative">
            <img src={turf.image_url} alt={turf.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a20] to-transparent"></div>
          </div>
          
          <div className="p-5 md:p-6 -mt-16 relative z-10">
            {/* Title & Badge */}
            <h1 className="text-3xl font-extrabold text-white mb-2">{turf.name.toUpperCase()}</h1>
            <div className="inline-block bg-[#e11d48] text-white text-xs font-bold px-3 py-1.5 rounded shadow-md uppercase tracking-wider mb-4">
              SPORTS {turf.sport} COURT
            </div>
            
            {/* Price & Timing */}
            <div className="text-gray-300 text-sm md:text-base font-medium flex items-center gap-2 mb-4">
              <span className="text-white font-bold">₹{turf.price_per_hour} onwards</span>
              <span className="text-gray-500">•</span>
              <span>{loading ? "Loading..." : details?.timings}</span>
            </div>
            
            {/* Address */}
            <div className="border-t border-white/5 pt-4">
              <p className="text-gray-400 text-sm leading-relaxed mb-2 flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                {turf.location} (Approx. {turf.distance} away)
              </p>
              <button className="text-[#e11d48] font-bold text-xs uppercase tracking-wide hover:underline ml-7">
                VIEW ON MAPS
              </button>
            </div>
            
            {/* Standard Metrics */}
            <div className="flex items-center justify-between border-t border-white/5 mt-5 pt-5">
              <div className="flex items-center border border-white/10 rounded-full px-4 py-2 bg-white/5">
                <span className="font-bold text-lg mr-2">{turf.rating}</span>
                <span className="text-emerald-500 mr-2">★</span>
                <span className="text-gray-400 text-sm underline decoration-gray-600 underline-offset-4">50 ratings</span>
              </div>
              <button className="border-2 border-[#e11d48] text-[#e11d48] font-bold rounded-full px-5 py-2 hover:bg-[#e11d48] hover:text-white transition-colors uppercase text-sm">
                Rate Venue
              </button>
            </div>
          </div>
        </div>

        {/* 2. HIGHLIGHTS CARD */}
        <div className="bg-[#1a1a20] rounded-2xl p-5 md:p-6 shadow-lg border border-white/5">
          <h2 className="text-xl font-bold mb-4">Highlight</h2>
          {loading ? (
             <div className="h-10 bg-white/5 rounded-full w-64 animate-pulse"></div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {details?.highlights?.map((hl, i) => (
                <div key={i} className="flex items-center border border-white/10 rounded-full px-4 py-2 bg-white/5 text-sm font-medium">
                  <CheckCircle className="w-4 h-4 text-gray-400 mr-2" /> {hl}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. AMENITIES CARD */}
        <div className="bg-[#1a1a20] rounded-2xl p-5 md:p-6 shadow-lg border border-white/5">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold">Amenities</h2>
             <span className="text-[#e11d48] text-sm font-bold bg-[#e11d48]/10 px-2 py-1 rounded">SEE ALL</span>
          </div>
          {loading ? (
             <div className="space-y-4">
                <div className="h-6 bg-white/5 w-full rounded animate-pulse"></div>
                <div className="h-6 bg-white/5 w-full rounded animate-pulse"></div>
             </div>
          ) : (
            <div className="space-y-4">
              {details?.amenities?.map((amenity, i) => (
                <div key={i} className="flex justify-between items-center text-gray-300">
                  <span className="font-medium">{amenity}</span>
                  <div className="text-gray-400">
                     {amenity === 'Changing Room' ? <Shirt className="w-5 h-5" /> :
                      amenity === 'Drinking Water' ? <Droplet className="w-5 h-5" /> :
                      amenity === 'First Aid' ? <BriefcaseMedical className="w-5 h-5" /> :
                      amenity === 'Flood Lights' ? <Lightbulb className="w-5 h-5" /> :
                      amenity === 'Parking' ? <Car className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. RULES CARD */}
        <div className="bg-[#1a1a20] rounded-2xl p-5 md:p-6 shadow-lg border border-white/5">
          <h2 className="text-xl font-bold mb-4">Venue rules</h2>
          {loading ? (
             <div className="h-6 bg-white/5 rounded w-3/4 animate-pulse"></div>
          ) : (
            <ul className="text-gray-400 text-sm space-y-3">
              {details?.rules?.map((rule, i) => (
                <li key={i} className="flex items-start gap-2">
                   <span className="text-gray-600 mt-0.5">•</span>
                   <span>{rule}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 5. STICKY BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0f0f13]/90 backdrop-blur-xl border-t border-white/10 p-4 z-50 shadow-2xl">
         <div className="max-w-[700px] mx-auto">
            <button 
              onClick={() => navigate(`/sports/turf/${id}/book`, { state: { turf } })}
              className="w-full bg-[#e11d48] hover:bg-rose-600 text-white font-bold text-lg py-3.5 rounded-lg shadow-lg hover:shadow-rose-600/25 transition-all flex items-center justify-between px-6"
            >
              <span>BOOK {turf.sport.toUpperCase()}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
         </div>
      </div>

    </div>
  );
};

export default TurfDetailPage;
