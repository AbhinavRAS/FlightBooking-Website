import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Car, Users, Briefcase, Fuel, Settings, Filter, SortAsc } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';

interface CarRental {
  id: string;
  make: string;
  model: string;
  category: string;
  image: string;
  features: {
    passengers: number;
    luggage: number;
    transmission: string;
    fuel: string;
    aircon: boolean;
  };
  pricePerDay: number;
  totalPrice: number;
  company: string;
  rating: number;
  freeCancel: boolean;
}

const CarResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setCurrentBooking } = useBooking();
  const searchData = location.state;

  const [cars, setCars] = useState<CarRental[]>([]);
  const [filteredCars, setFilteredCars] = useState<CarRental[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('price');
  const [filters, setFilters] = useState({
    maxPrice: 200,
    category: 'all',
    transmission: 'all',
    company: 'all'
  });

  // Mock car rental data
  const mockCars: CarRental[] = [
    {
      id: '1',
      make: 'Toyota',
      model: 'Corolla',
      category: 'Compact',
      image: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg',
      features: {
        passengers: 5,
        luggage: 2,
        transmission: 'Automatic',
        fuel: 'Gasoline',
        aircon: true
      },
      pricePerDay: 32,
      totalPrice: 96,
      company: 'Enterprise',
      rating: 4.5,
      freeCancel: true
    },
    {
      id: '2',
      make: 'Nissan',
      model: 'Versa',
      category: 'Economy',
      image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg',
      features: {
        passengers: 5,
        luggage: 1,
        transmission: 'Automatic',
        fuel: 'Gasoline',
        aircon: true
      },
      pricePerDay: 25,
      totalPrice: 75,
      company: 'Budget',
      rating: 4.2,
      freeCancel: true
    },
    {
      id: '3',
      make: 'Toyota',
      model: 'Camry',
      category: 'Mid-size',
      image: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg',
      features: {
        passengers: 5,
        luggage: 3,
        transmission: 'Automatic',
        fuel: 'Gasoline',
        aircon: true
      },
      pricePerDay: 39,
      totalPrice: 117,
      company: 'Hertz',
      rating: 4.6,
      freeCancel: false
    },
    {
      id: '4',
      make: 'Chevrolet',
      model: 'Impala',
      category: 'Full-size',
      image: 'https://images.pexels.com/photos/1201407/pexels-photo-1201407.jpeg',
      features: {
        passengers: 5,
        luggage: 4,
        transmission: 'Automatic',
        fuel: 'Gasoline',
        aircon: true
      },
      pricePerDay: 45,
      totalPrice: 135,
      company: 'Avis',
      rating: 4.4,
      freeCancel: true
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCars(mockCars);
      setFilteredCars(mockCars);
      setLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    // Apply filters and sorting
    let filtered = cars.filter(car => {
      return (
        car.pricePerDay <= filters.maxPrice &&
        (filters.category === 'all' || car.category.toLowerCase() === filters.category) &&
        (filters.transmission === 'all' || car.features.transmission.toLowerCase() === filters.transmission.toLowerCase()) &&
        (filters.company === 'all' || car.company.toLowerCase() === filters.company.toLowerCase())
      );
    });

    // Sort cars
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.pricePerDay - b.pricePerDay;
        case 'rating':
          return b.rating - a.rating;
        case 'company':
          return a.company.localeCompare(b.company);
        default:
          return 0;
      }
    });

    setFilteredCars(filtered);
  }, [cars, filters, sortBy]);

  const handleBookCar = (car: CarRental) => {
    const booking = {
      id: car.id,
      carType: `${car.make} ${car.model}`,
      pickupLocation: searchData?.pickupLocation || '',
      dropoffLocation: searchData?.dropoffLocation || '',
      pickupDate: searchData?.pickupDate || '',
      dropoffDate: searchData?.dropoffDate || '',
      price: car.totalPrice
    };
    
    setCurrentBooking(booking);
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Finding the best car rentals for you...</p>
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
              <Car className="h-6 w-6 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {searchData?.pickupLocation} → {searchData?.dropoffLocation}
                </h1>
                <p className="text-gray-600">
                  {searchData?.pickupDate} - {searchData?.dropoffDate}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">{filteredCars.length} cars available</p>
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
                <h3 className="font-medium text-gray-900  mb-3">Price per day</h3>
                <input
                  type="range"
                  min="20"
                  max="200"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>$20</span>
                  <span>${filters.maxPrice}</span>
                </div>
              </div>

              {/* Car Category */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Car Category</h3>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="economy">Economy</option>
                  <option value="compact">Compact</option>
                  <option value="mid-size">Mid-size</option>
                  <option value="full-size">Full-size</option>
                </select>
              </div>

              {/* Transmission */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Transmission</h3>
                <select
                  value={filters.transmission}
                  onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
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
                  <option value="rating">Rating (High to Low)</option>
                  <option value="company">Rental Company</option>
                </select>
              </div>
            </div>
          </div>

          {/* Car Results */}
          <div className="lg:col-span-3 space-y-4">
            {filteredCars.map(car => (
              <div key={car.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
                      {/* Car Image */}
                      <div className="w-full md:w-48 h-32 mb-4 md:mb-0">
                        <img
                          src={car.image}
                          alt={`${car.make} ${car.model}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      {/* Car Details */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {car.make} {car.model}
                          </h3>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {car.category}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{car.company}</p>

                        {/* Car Features */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Users className="h-4 w-4" />
                            <span className="text-sm">{car.features.passengers} seats</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Briefcase className="h-4 w-4" />
                            <span className="text-sm">{car.features.luggage} bags</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Settings className="h-4 w-4" />
                            <span className="text-sm">{car.features.transmission}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Fuel className="h-4 w-4" />
                            <span className="text-sm">{car.features.fuel}</span>
                          </div>
                        </div>

                        {/* Additional Info */}
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="flex items-center text-yellow-500">
                            ★ {car.rating}
                          </span>
                          {car.freeCancel && (
                            <span className="text-green-600">Free cancellation</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price and Book Button */}
                  <div className="lg:ml-8 mt-6 lg:mt-0 text-center lg:text-right">
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">${car.pricePerDay}/day</p>
                      <p className="text-2xl font-bold text-gray-900">${car.totalPrice}</p>
                      <p className="text-sm text-gray-600">total</p>
                    </div>
                    <button
                      onClick={() => handleBookCar(car)}
                      className="w-full lg:w-auto bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                    >
                      Book Now
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

export default CarResultsPage;