import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'

import MainLayout from './layouts/MainLayout.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import HomePage from './pages/HomePage.jsx'
import MovieDetailPage from './pages/MovieDetailPage.jsx'
import ShowsPage from './pages/ShowsPage.jsx'
import SeatLayoutPage from './pages/SeatLayoutPage.jsx'
import PaymentPage from './pages/PaymentPage.jsx'
import BookingConfirmationPage from './pages/BookingConfirmationPage.jsx'
import MyBookingsPage from './pages/MyBookingsPage.jsx'
import StreamPage from './pages/StreamPage.jsx'
import SportsPage from './pages/SportsPage.jsx'
import TurfDetailPage from './pages/TurfDetailPage.jsx'
import TurfBookingPage from './pages/TurfBookingPage.jsx'
import TurfPaymentPage from './pages/TurfPaymentPage.jsx'
import LoginModal from './components/LoginModal.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {
  return (
    <>
      <LoginModal />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/shows/:movieId" element={<ShowsPage />} />
          <Route path="/book/:showId" element={<SeatLayoutPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
          <Route path="/my-bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
          <Route path="/stream" element={<StreamPage />} />
          <Route path="/sports" element={<SportsPage />} />
          <Route path="/sports/turf/:id" element={<TurfDetailPage />} />
          <Route path="/sports/turf/:id/book" element={<TurfBookingPage />} />
          <Route path="/sports/turf/:id/payment" element={<TurfPaymentPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
