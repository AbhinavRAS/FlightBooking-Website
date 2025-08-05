import React, { createContext, useContext, useState } from 'react';

interface FlightBooking {
  id: string;
  departure: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  class: string;
  price: number;
}

interface HotelBooking {
  id: string;
  hotelName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  price: number;
}

interface CarBooking {
  id: string;
  carType: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  dropoffDate: string;
  price: number;
}

interface BookingContextType {
  currentBooking: FlightBooking | HotelBooking | CarBooking | null;
  bookingHistory: (FlightBooking | HotelBooking | CarBooking)[];
  setCurrentBooking: (booking: FlightBooking | HotelBooking | CarBooking | null) => void;
  addToHistory: (booking: FlightBooking | HotelBooking | CarBooking) => void;
  clearCurrentBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentBooking, setCurrentBooking] = useState<FlightBooking | HotelBooking | CarBooking | null>(null);
  const [bookingHistory, setBookingHistory] = useState<(FlightBooking | HotelBooking | CarBooking)[]>([]);

  const addToHistory = (booking: FlightBooking | HotelBooking | CarBooking) => {
    setBookingHistory(prev => [booking, ...prev]);
  };

  const clearCurrentBooking = () => {
    setCurrentBooking(null);
  };

  const value = {
    currentBooking,
    bookingHistory,
    setCurrentBooking,
    addToHistory,
    clearCurrentBooking
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};