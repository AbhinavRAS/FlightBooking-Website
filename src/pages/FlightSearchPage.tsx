import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeftRight, Calendar, Users, Plane } from 'lucide-react';
import AirportSearch from '../components/AirportSearch';

const FlightSearchPage: React.FC = () => {
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    departDate: '',
    returnDate: '',
    passengers: 1,
    class: 'economy',
    tripType: 'round-trip'
  });
  
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  const handleAirportSelect = (field: 'from' | 'to') => (iataCode: string) => {
    setSearchData(prev => ({
      ...prev,
      [field]: iataCode
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to results page with search parameters
    navigate('/flights/results', { state: searchData });
  };

  const swapLocations = () => {
    setSearchData({
      ...searchData,
      from: searchData.to,
      to: searchData.from
    });
  };

  const popularRoutes = [
    { from: 'New York', to: 'London', price: '$299' },
    { from: 'Los Angeles', to: 'Tokyo', price: '$459' },
    { from: 'Miami', to: 'Paris', price: '$349' },
    { from: 'Chicago', to: 'Rome', price: '$399' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Flight</h1>
          <p className="text-xl text-gray-600">Compare flights from hundreds of airlines and travel sites</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Trip Type */}
            <div className="flex space-x-4 mb-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tripType"
                  value="round-trip"
                  checked={searchData.tripType === 'round-trip'}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Round Trip
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tripType"
                  value="one-way"
                  checked={searchData.tripType === 'one-way'}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                One Way
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tripType"
                  value="multi-city"
                  checked={searchData.tripType === 'multi-city'}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Multi-City
              </label>
            </div>

            {/* Origin and Destination */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                <AirportSearch onSelect={handleAirportSelect('from')} />
              </div>

              <div className="md:col-span-2 flex justify-center">
                <button
                  type="button"
                  onClick={swapLocations}
                  className="p-3 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                >
                  <ArrowLeftRight className="h-5 w-5 text-blue-600" />
                </button>
              </div>

              <div className="md:col-span-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <AirportSearch onSelect={handleAirportSelect('to')} />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Departure Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    name="departDate"
                    value={searchData.departDate}
                    onChange={handleInputChange}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {searchData.tripType === 'round-trip' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Return Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      name="returnDate"
                      value={searchData.returnDate}
                      onChange={handleInputChange}
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Passengers and Class */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Passengers</label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <select
                    name="passengers"
                    value={searchData.passengers}
                    onChange={handleInputChange}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Passenger' : 'Passengers'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                <select
                  name="class"
                  value={searchData.class}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="economy">Economy</option>
                  <option value="premium-economy">Premium Economy</option>
                  <option value="business">Business</option>
                  <option value="first">First Class</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-4 px-8 rounded-lg font-semibold text-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Search className="h-5 w-5" />
              <span>Search Flights</span>
            </button>
          </form>
        </div>

        {/* Popular Routes */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Routes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {popularRoutes.map((route, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                onClick={() => {
                  setSearchData({
                    ...searchData,
                    from: route.from,
                    to: route.to
                  });
                }}
              >
                <div>
                  <div className="font-semibold text-gray-900">{route.from} → {route.to}</div>
                  <div className="text-sm text-gray-600">Popular destination</div>
                </div>
                <div className="text-lg font-bold text-orange-600">{route.price}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSearchPage;