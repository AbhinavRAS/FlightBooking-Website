import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plane, Clock, ArrowRight, Filter, SortAsc, Wifi, Utensils, Tv } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';

interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    time: string;
    date: string;
  };
  arrival: {
    airport: string;
    time: string;
    date: string;
  };
  duration: string;
  price: number;
  stops: number;
  amenities: string[];
}

const FlightResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setCurrentBooking } = useBooking();
  const searchData = location.state;

  const [flights, setFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('price');
  const [filters, setFilters] = useState({
    maxPrice: 1000,
    stops: 'any',
    airlines: [] as string[]
  });

  // Mock flight data - replace with real API calls
  const mockFlights: Flight[] = [
    {
      id: '1',
      airline: 'Delta Airlines',
      flightNumber: 'DL 123',
      departure: { airport: 'JFK', time: '08:00', date: '2024-01-15' },
      arrival: { airport: 'LHR', time: '20:30', date: '2024-01-15' },
      duration: '7h 30m',
      price: 299,
      stops: 0,
      amenities: ['wifi', 'meals', 'entertainment']
    },
    {
      id: '2',
      airline: 'American Airlines',
      flightNumber: 'AA 456',
      departure: { airport: 'JFK', time: '14:30', date: '2024-01-15' },
      arrival: { airport: 'LHR', time: '02:15', date: '2024-01-16' },
      duration: '6h 45m',
      price: 349,
      stops: 0,
      amenities: ['wifi', 'meals']
    },
    {
      id: '3',
      airline: 'United Airlines',
      flightNumber: 'UA 789',
      departure: { airport: 'JFK', time: '10:15', date: '2024-01-15' },
      arrival: { airport: 'LHR', time: '23:45', date: '2024-01-15' },
      duration: '8h 30m',
      price: 259,
      stops: 1,
      amenities: ['wifi', 'entertainment']
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFlights(mockFlights);
      setFilteredFlights(mockFlights);
      setLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    // Apply filters and sorting
    let filtered = flights.filter(flight => {
      return (
        flight.price <= filters.maxPrice &&
        (filters.stops === 'any' || 
         (filters.stops === 'nonstop' && flight.stops === 0) ||
         (filters.stops === '1stop' && flight.stops === 1))
      );
    });

    // Sort flights
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'duration':
          return parseFloat(a.duration) - parseFloat(b.duration);
        case 'departure':
          return a.departure.time.localeCompare(b.departure.time);
        default:
          return 0;
      }
    });

    setFilteredFlights(filtered);
  }, [flights, filters, sortBy]);

  const handleBookFlight = (flight: Flight) => {
    const booking = {
      id: flight.id,
      departure: searchData?.from || flight.departure.airport,
      destination: searchData?.to || flight.arrival.airport,
      departureDate: flight.departure.date,
      returnDate: searchData?.returnDate,
      passengers: searchData?.passengers || 1,
      class: searchData?.class || 'economy',
      price: flight.price
    };
    
    setCurrentBooking(booking);
    navigate('/checkout');
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi':
        return <Wifi className="h-4 w-4" />;
      case 'meals':
        return <Utensils className="h-4 w-4" />;
      case 'entertainment':
        return <Tv className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Searching for the best flights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center space-x-4">
              <Plane className="h-6 w-6 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {searchData?.from} → {searchData?.to}
                </h1>
                <p className="text-gray-600">
                  {searchData?.departDate} • {searchData?.passengers} passenger{searchData?.passengers > 1 ? 's' : ''} • {searchData?.class}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">{filteredFlights.length} flights found</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <div className="flex items-center space-x-2 mb-6">
                <Filter className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold">Filters</h2>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>$100</span>
                  <span>${filters.maxPrice}</span>
                </div>
              </div>

              {/* Stops */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Stops</h3>
                <div className="space-y-2">
                  {[
                    { value: 'any', label: 'Any' },
                    { value: 'nonstop', label: 'Nonstop' },
                    { value: '1stop', label: '1 Stop' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="stops"
                        value={option.value}
                        checked={filters.stops === option.value}
                        onChange={(e) => setFilters({ ...filters, stops: e.target.value })}
                        className="mr-2"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <SortAsc className="h-5 w-5 text-gray-600" />
                  <h3 className="font-medium text-gray-900">Sort by</h3>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="price">Price (Low to High)</option>
                  <option value="duration">Duration</option>
                  <option value="departure">Departure Time</option>
                </select>
              </div>
            </div>
          </div>

          {/* Flight Results */}
          <div className="lg:col-span-3 space-y-4">
            {filteredFlights.map(flight => (
              <div key={flight.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Plane className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{flight.airline}</h3>
                          <p className="text-sm text-gray-600">{flight.flightNumber}</p>
                        </div>
                      </div>
                      {flight.stops === 0 && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Nonstop
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{flight.departure.time}</p>
                        <p className="text-sm text-gray-600">{flight.departure.airport}</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-1">
                          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                          <div className="flex-1 h-0.5 bg-gray-300"></div>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                          <div className="flex-1 h-0.5 bg-gray-300"></div>
                          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        </div>
                        <p className="text-sm text-gray-600">{flight.duration}</p>
                        {flight.stops > 0 && (
                          <p className="text-xs text-gray-500">{flight.stops} stop{flight.stops > 1 ? 's' : ''}</p>
                        )}
                      </div>

                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{flight.arrival.time}</p>
                        <p className="text-sm text-gray-600">{flight.arrival.airport}</p>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="flex items-center space-x-4 mt-4">
                      {flight.amenities.map(amenity => (
                        <div key={amenity} className="flex items-center space-x-1 text-gray-600">
                          {getAmenityIcon(amenity)}
                          <span className="text-sm capitalize">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price and Book Button */}
                  <div className="lg:ml-8 mt-6 lg:mt-0 text-center lg:text-right">
                    <div className="mb-4">
                      <p className="text-3xl font-bold text-gray-900">${flight.price}</p>
                      <p className="text-sm text-gray-600">per person</p>
                    </div>
                    <button
                      onClick={() => handleBookFlight(flight)}
                      className="w-full lg:w-auto bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                    >
                      Select Flight
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightResultsPage;