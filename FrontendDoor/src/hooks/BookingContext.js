// BookingContext.js
import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const addBooking = (booking) => {
    setBookings([...bookings, booking]);
  };

  const removeBooking = (bookingId) => {
    setBookings(bookings.filter((booking) => booking.id !== bookingId));
  };

  const updateBooking = (updatedBooking) => {
    setBookings(bookings.map((booking) => (booking.id === updatedBooking.id ? updatedBooking : booking)));
  };

  const selectBooking = (bookingId) => {
    const booking = bookings.find((b) => b.id === bookingId);
    setSelectedBooking(booking);
  };

  const clearSelectedBooking = () => {
    setSelectedBooking(null);
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        selectedBooking,
        addBooking,
        removeBooking,
        updateBooking,
        selectBooking,
        clearSelectedBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);