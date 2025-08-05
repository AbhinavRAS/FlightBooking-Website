import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, MapPin, Car } from 'lucide-react';

const CarRentalPage: React.FC = () => {
  const [searchData, setSearchData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: '',
    pickupTime: '10:00',
    dropoffDate: '',
    dropoffTime: '10:00',
    driverAge: '25-65'
  });
  
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/cars/results', { state: searchData });
  };

  const carTypes = [
    { 
      type: 'Economy', 
      example: 'Nissan Versa or similar', 
      price: '$25', 
      features: ['Great gas mileage', '4 doors', 'A/C'],
      image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg'
    },
    { 
      type: 'Compact', 
      example: 'Toyota Corolla or similar', 
      price: '$32', 
      features: ['Easy to park', '4 doors', 'A/C'],
      image: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg'
    },
    { 
      type: 'Mid-size', 
      example: 'Toyota Camry or similar', 
      price: '$39', 
      features: ['More space', '4 doors', 'A/C'],
      image: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg'
    },
    { 
      type: 'Full-size', 
      example: 'Chevrolet Impala or similar', 
      price: '$45', 
      features: ['Spacious interior', '4 doors', 'A/C'],
      image: 'https://images.pexels.com/photos/1201407/pexels-photo-1201407.jpeg'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Rent the Perfect Car</h1>
          <p className="text-xl text-gray-600">Choose from a wide selection of rental cars at great prices</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pick-up Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="pickupLocation"
                    value={searchData.pickupLocation}
                    onChange={handleInputChange}
                    placeholder="City, airport, or address"
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Drop-off Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="dropoffLocation"
                    value={searchData.dropoffLocation}
                    onChange={handleInputChange}
                    placeholder="City, airport, or address"
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Date and Time Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pick-up Date & Time</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      name="pickupDate"
                      value={searchData.pickupDate}
                      onChange={handleInputChange}
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <select
                    name="pickupTime"
                    value={searchData.pickupTime}
                    onChange={handleInputChange}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = String(i).padStart(2, '0');
                      return (
                        <option key={hour} value={`${hour}:00`}>
                          {hour}:00
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Drop-off Date & Time</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      name="dropoffDate"
                      value={searchData.dropoffDate}
                      onChange={handleInputChange}
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <select
                    name="dropoffTime"
                    value={searchData.dropoffTime}
                    onChange={handleInputChange}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = String(i).padStart(2, '0');
                      return (
                        <option key={hour} value={`${hour}:00`}>
                          {hour}:00
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>

            {/* Driver Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Driver's Age</label>
              <select
                name="driverAge"
                value={searchData.driverAge}
                onChange={handleInputChange}
                className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="21-24">21-24 years old</option>
                <option value="25-65">25-65 years old</option>
                <option value="65+">65+ years old</option>
              </select>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-4 px-8 rounded-lg font-semibold text-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Search className="h-5 w-5" />
              <span>Search Cars</span>
            </button>
          </form>
        </div>

        {/* Car Types */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Car Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {carTypes.map((car, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                <img
                  src={car.image}
                  alt={car.type}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{car.type}</h3>
                <p className="text-sm text-gray-600 mb-2">{car.example}</p>
                <p className="text-xl font-bold text-orange-600 mb-3">{car.price}/day</p>
                <ul className="space-y-1">
                  {car.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-sm text-gray-600 flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarRentalPage;