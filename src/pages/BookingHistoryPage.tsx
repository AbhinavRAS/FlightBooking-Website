import React, { useState } from 'react';
import { Calendar, Plane, Building2, Car, MapPin, Download, Eye, Filter } from 'lucide-react';

interface Booking {
  id: string;
  type: 'flight' | 'hotel' | 'car';
  status: 'confirmed' | 'completed' | 'cancelled';
  date: string;
  details: {
    title: string;
    subtitle: string;
    location: string;
    dates: string;
  };
  price: number;
  bookingRef: string;
}

const BookingHistoryPage: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock booking data
  const bookings: Booking[] = [
    {
      id: '1',
      type: 'flight',
      status: 'confirmed',
      date: '2024-01-15',
      details: {
        title: 'New York to Paris',
        subtitle: 'Delta Airlines - DL 123',
        location: 'JFK → CDG',
        dates: 'Jan 15, 2024 - Jan 22, 2024'
      },
      price: 599,
      bookingRef: 'TW-FL-001234'
    },
    {
      id: '2',
      type: 'hotel',
      status: 'completed',
      date: '2023-12-10',
      details: {
        title: 'Grand Palace Hotel',
        subtitle: 'Deluxe Room with City View',
        location: 'Paris, France',
        dates: 'Dec 10, 2023 - Dec 15, 2023'
      },
      price: 945,
      bookingRef: 'TW-HT-005678'
    },
    {
      id: '3',
      type: 'car',
      status: 'confirmed',
      date: '2024-02-01',
      details: {
        title: 'Toyota Camry',
        subtitle: 'Mid-size Car Rental',
        location: 'Los Angeles Airport',
        dates: 'Feb 1, 2024 - Feb 5, 2024'
      },
      price: 156,
      bookingRef: 'TW-CR-009876'
    },
    {
      id: '4',
      type: 'flight',
      status: 'cancelled',
      date: '2023-11-20',
      details: {
        title: 'London to Tokyo',
        subtitle: 'British Airways - BA 456',
        location: 'LHR → NRT',
        dates: 'Nov 20, 2023 - Nov 28, 2023'
      },
      price: 789,
      bookingRef: 'TW-FL-004321'
    }
  ];

  const filteredBookings = bookings.filter(booking => {
    const typeMatch = filter === 'all' || booking.type === filter;
    const statusMatch = statusFilter === 'all' || booking.status === statusFilter;
    return typeMatch && statusMatch;
  });

  const getBookingIcon = (type: string) => {
    switch (type) {
      case 'flight':
        return <Plane className="h-5 w-5" />;
      case 'hotel':
        return <Building2 className="h-5 w-5" />;
      case 'car':
        return <Car className="h-5 w-5" />;
      default:
        return <MapPin className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'flight':
        return 'bg-blue-600';
      case 'hotel':
        return 'bg-green-600';
      case 'car':
        return 'bg-orange-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage and view all your travel bookings</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filter by:</span>
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="flight">Flights</option>
              <option value="hotel">Hotels</option>
              <option value="car">Car Rentals</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <div className="ml-auto">
              <span className="text-sm text-gray-600">
                {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''} found
              </span>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.map(booking => (
            <div key={booking.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${getTypeColor(booking.type)} rounded-full flex items-center justify-center text-white`}>
                      {getBookingIcon(booking.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{booking.details.title}</h3>
                      <p className="text-gray-600">{booking.details.subtitle}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{booking.details.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">{booking.details.dates}</span>
                  </div>
                  <div className="text-right md:text-left">
                    <span className="text-lg font-bold text-gray-900">${booking.price}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <span className="text-sm text-gray-600">Booking Reference: </span>
                    <span className="text-sm font-medium text-gray-900">{booking.bookingRef}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm">View Details</span>
                    </button>
                    <button className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <Download className="h-4 w-4" />
                      <span className="text-sm">Download</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">You don't have any bookings matching the selected filters.</p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Start Planning Your Trip
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistoryPage;