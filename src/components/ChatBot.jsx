import React, { useState, useRef, useEffect } from 'react'
import './ChatBot.css'
import { exploreAPI } from '../api/exploreAPI.js'
import { API_BASE } from '../api/axiosClient.js'

const MovieRecommendationCard = ({ movie }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const isCatalog = movie.in_catalog
  // Ensure correct URL construction
  let imageUrl = null
  if (movie.image) {
    if (movie.image.startsWith('http')) {
      imageUrl = movie.image
    } else {
      // safely join base and path
      const base = API_BASE.replace(/\/$/, '')
      const path = movie.image.startsWith('/') ? movie.image : `/${movie.image}`
      imageUrl = `${base}${path}`
    }
  }

  if (isCatalog) {
    return (
      <div className="flex gap-3 bg-[#1a1a20] p-3 rounded-lg shadow-sm border border-white/10 mb-2">
        <div className="w-16 h-24 flex-shrink-0 bg-[#0f0f13] rounded overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt={movie.title} className="w-full h-full object-cover" />
          ) : (
             <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500">No Img</div>
          )}
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-white text-sm leading-tight">{movie.title}</h4>
            <div className="flex items-center gap-1 mt-1">
               <span className="text-xs text-zinc-400">{movie.year}</span>
               {movie.rating && (
                 <span className="bg-white/10 text-yellow-500 text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                   ★ {movie.rating}
                 </span>
               )}
            </div>
          </div>
          <div className="mt-1">
            <p className={`text-xs text-zinc-400 ${!isExpanded ? 'line-clamp-2' : ''}`}>{movie.reason}</p>
            {movie.reason && movie.reason.length > 80 && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)} 
                className="text-[10px] text-blue-400 hover:text-blue-300 mt-0.5 font-medium transition-colors"
              >
                {isExpanded ? 'View Less' : 'View More'}
              </button>
            )}
          </div>
          {movie.in_theaters ? (
              <a href={`/movie/${movie.db_id}`} className="mt-2 text-center bg-brand-red text-white text-xs font-semibold py-1.5 rounded hover:bg-rose-600 transition">
                Book Now
              </a>
          ) : (
              <a href={`/movie/${movie.db_id}`} className="mt-2 text-center bg-[#292932] border border-white/10 text-white text-xs font-semibold py-1.5 rounded hover:bg-[#34343f] transition">
                 View Details
              </a>
          )}
        </div>
      </div>
    )
  }

  // Non-catalog fallback (Tabular style)
  return (
    <div className="flex justify-between items-start border-b border-white/10 pb-2 mb-2 last:border-0">
      <div>
        <div className="font-semibold text-white text-sm">{movie.title} <span className="text-xs font-normal text-zinc-500">({movie.year})</span></div>
        <div className="text-xs text-zinc-400 mt-0.5">{movie.reason}</div>
      </div>
    </div>
  )
}

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(() => {
     return localStorage.getItem('chat_isOpen') === 'true'
  })
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chat_messages')
    return saved ? JSON.parse(saved) : [
      { text: "Hi! I'm your BookMyShow assistant. Ask me anything about movies!", isBot: true }
    ]
  })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages, isOpen])

  // Persist state
  useEffect(() => {
    localStorage.setItem('chat_messages', JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    localStorage.setItem('chat_isOpen', isOpen)
  }, [isOpen])

  const renderMessageContent = (msg) => {
    if (msg.type === 'recommendations') {
       return (
         <div className="flex flex-col gap-1 w-full">
            <p className="mb-2 text-sm">{msg.text}</p>
            {msg.movies.map((m, idx) => (
              <MovieRecommendationCard key={idx} movie={m} />
            ))}
         </div>
       )
    }
    return <span>{msg.text}</span>
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg = input
    setMessages(prev => [...prev, { text: userMsg, isBot: false }])
    setInput('')
    setLoading(true)

    try {
      // 1. Get the direct chat response from the backend
      const response = await exploreAPI.chatWithAssistant(userMsg)
      setLoading(false)
      
      if (response && response.text) {
         setMessages(prev => [...prev, { ...response, isBot: true }])
      } else if (response && response.reply) {
         setMessages(prev => [...prev, { text: response.reply, isBot: true }])
      } else {
         setMessages(prev => [...prev, { text: "I'm sorry, I couldn't process your request right now.", isBot: true }])
      }

    } catch (err) {
      setLoading(false)
      const errorMsg = err.response?.data?.error || "Sorry, I couldn't start the request."
      setMessages(prev => [...prev, { text: errorMsg, isBot: true }])
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {isOpen && (
        <div className="w-96 md:w-[28rem] h-[32rem] overflow-hidden rounded-2xl bg-[#0f0f13] shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-white/10 flex flex-col">
          {/* Header */}
          <div className="bg-[#1a1a20] px-6 py-4 text-white flex-shrink-0 flex justify-between items-center border-b border-white/5">
             <div>
                <h3 className="text-lg font-bold text-white">Filmingo Assistant</h3>
                <p className="text-xs text-zinc-400">Powered by Gemini AI</p>
             </div>
             <button 
                onClick={() => {
                    setMessages([{ text: "Hi! I'm your Filmingo assistant. Ask me anything about movies!", isBot: true }])
                    localStorage.removeItem('chat_messages')
                }}
                className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 px-2 py-1 rounded transition text-zinc-300"
                title="Clear Chat History"
            >
                Clear
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-[#0f0f13] p-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-4 flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                    msg.isBot
                      ? 'rounded-tl-none bg-[#1a1a20] text-white border border-white/5'
                      : 'rounded-tr-none bg-brand-red text-white'
                  }`}
                >
                  {renderMessageContent(msg)}
                </div>
              </div>
            ))}
            {loading && (
              <div className="mb-4 flex justify-start">
                <div className="max-w-[80%] rounded-2xl rounded-tl-none bg-[#1a1a20] border border-white/5 px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500"></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500 delay-100"></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500 delay-200"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="border-t border-white/10 bg-[#1a1a20] p-3 flex-shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about movies..."
                className="flex-1 rounded-full border border-white/10 bg-[#0f0f13] text-white px-4 py-2 text-sm focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red placeholder-zinc-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-brand-red text-white transition hover:bg-rose-600 disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 transition group-hover:translate-x-0.5">
                  <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Button Toggle */}
      <div onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <button className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-red text-white shadow-lg transition hover:bg-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-200">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </button>
          ) : (
             <div className="loader-wrapper">
              <span className="loader-letter">A</span>
              <span className="loader-letter">s</span>
              <span className="loader-letter">k</span>
              <span className="loader-letter">&nbsp;</span>
              <span className="loader-letter">m</span>
              <span className="loader-letter">e</span>
              <div className="loader" />
            </div>
          )}
      </div>
    </div>
  )
}
