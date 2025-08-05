import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import OfferBanner from './components/Common/OfferBanner';
import HomePage from './pages/HomePage';
import FlightSearchPage from './pages/FlightSearchPage';
import FlightResultsPage from './pages/FlightResultsPage';
import HotelSearchPage from './pages/HotelSearchPage';
import HotelResultsPage from './pages/HotelResultsPage';
import CarRentalPage from './pages/CarRentalPage';
import CarResultsPage from './pages/CarResultsPage';
import AttractionsPage from './pages/AttractionsPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import BookingHistoryPage from './pages/BookingHistoryPage';
import CheckoutPage from './pages/CheckoutPage';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BookingProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <OfferBanner />
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/flights/search" element={<FlightSearchPage />} />
                  <Route path="/flights/results" element={<FlightResultsPage />} />
                  <Route path="/hotels/search" element={<HotelSearchPage />} />
                  <Route path="/hotels/results" element={<HotelResultsPage />} />
                  <Route path="/cars/search" element={<CarRentalPage />} />
                  <Route path="/cars/results" element={<CarResultsPage />} />
                  <Route path="/attractions" element={<AttractionsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/bookings" element={<BookingHistoryPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </BookingProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;