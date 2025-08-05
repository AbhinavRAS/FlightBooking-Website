import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Building2, Star, Wifi, Car, Utensils, Waves, Filter, SortAsc } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';

interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  images: string[];
  amenities: string[];
  description: string;
  cancellation: string;
}

const HotelResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setCurrentBooking } = useBooking();
  const searchData = location.state;

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recommended');
  const [filters, setFilters] = useState({
    maxPrice: 500,
    minRating: 0,
    amenities: [] as string[]
  });

  // Mock hotel data
  const mockHotels: Hotel[] = [
    {
      id: '1',
      name: 'Grand Palace Hotel',
      location: 'Downtown, Paris',
      rating: 4.8,
      reviews: 2847,
      price: 189,
      originalPrice: 249,
      images: ['https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg'],
      amenities: ['wifi', 'parking', 'restaurant', 'pool'],
      description: 'Luxury hotel in the heart of Paris with exceptional service and stunning city views.',
      cancellation: 'Free cancellation until 24 hours before check-in'
    },
    {
      id: '2',
      name: 'Boutique Riverside Inn',
      location: 'Seine River, Paris',
      rating: 4.6,
      reviews: 1923,
      price: 156,
      images: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'],
      amenities: ['wifi', 'restaurant', 'spa'],
      description: 'Charming boutique hotel with river views and personalized service.',
      cancellation: 'Free cancellation until 48 hours before check-in'
    },
    {
      id: '3',
      name: 'Modern City Center Hotel',
      location: 'Champs-Élysées, Paris',
      rating: 4.4,
      reviews: 3156,
      price: 134,
      originalPrice: 168,
      images: ['https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'],
      amenities: ['wifi', 'parking', 'gym'],
      description: 'Contemporary hotel perfect for business and leisure travelers.',
      cancellation: 'Free cancellation until 24 hours before check-in'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setHotels(mockHotels);
      setFilteredHotels(mockHotels);
      setLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    // Apply filters and sorting
    let filtered = hotels.filter(hotel => {
      return (
        hotel.price <= filters.maxPrice &&
        hotel.rating >= filters.minRating
      );
    });

    // Sort hotels
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        case 'reviews':
          return b.reviews - a.reviews;
        default:
          return 0;
      }
    });

    setFilteredHotels(filtered);
  }, [hotels, filters, sortBy]);

  const handleBookHotel = (hotel: Hotel) => {
    const booking = {
      id: hotel.id,
      hotelName: hotel.name,
      location: hotel.location,
      checkIn: searchData?.checkIn || '',
      checkOut: searchData?.checkOut || '',
      guests: searchData?.guests || 2,
      rooms: searchData?.rooms || 1,
      price: hotel.price
    };
    
    setCurrentBooking(booking);
    navigate('/checkout');
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi':
        return <Wifi className="h-4 w-4" />;
      case 'parking':
        return <Car className="h-4 w-4" />;
      case 'restaurant':
        return <Utensils className="h-4 w-4" />;
      case 'pool':
        return <Waves className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Finding the perfect hotels for you...</p>
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
              <Building2 className="h-6 w-6 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{searchData?.destination}</h1>
                <p className="text-gray-600">
                  {searchData?.checkIn} - {searchData?.checkOut} • {searchData?.guests} guest{searchData?.guests > 1 ? 's' : ''} • {searchData?.rooms} room{searchData?.rooms > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">{filteredHotels.length} hotels found</p>
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
                <h3 className="font-medium text-gray-900 mb-3">Price per night</h3>
                <input
                  type="range"
                  min="50"
                  max="500"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>$50</span>
                  <span>${filters.maxPrice}</span>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Minimum Rating</h3>
                <div className="space-y-2">
                  {[0, 3, 4, 4.5].map(rating => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        checked={filters.minRating === rating}
                        onChange={(e) => setFilters({ ...filters, minRating: parseFloat(e.target.value) })}
                        className="mr-2"
                      />
                      <div className="flex items-center">
                        {rating === 0 ? 'Any rating' : (
                          <>
                            {Array.from({ length: Math.floor(rating) }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                            ))}
                            {rating % 1 !== 0 && <Star className="h-4 w-4 text-yellow-400 fill-current opacity-50" />}
                            <span className="ml-1 text-sm">{rating}+</span>
                          </>
                        )}
                      </div>
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
                  <option value="recommended">Recommended</option>
                  <option value="price">Price (Low to High)</option>
                  <option value="rating">Rating (High to Low)</option>
                  <option value="reviews">Most Reviewed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Hotel Results */}
          <div className="lg:col-span-3 space-y-6">
            {filteredHotels.map(hotel => (
              <div key={hotel.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row">
                  {/* Hotel Image */}
                  <div className="md:w-1/3">
                    <img
                      src={hotel.images[0]}
                      alt={hotel.name}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>

                  {/* Hotel Details */}
                  <div className="md:w-2/3 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{hotel.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{hotel.location}</p>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex">
                            {Array.from({ length: Math.floor(hotel.rating) }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{hotel.rating}</span>
                          <span className="text-sm text-gray-600">({hotel.reviews} reviews)</span>
                        </div>
                      </div>

                      <div className="text-right">
                        {hotel.originalPrice && (
                          <p className="text-sm text-gray-500 line-through">${hotel.originalPrice}</p>
                        )}
                        <p className="text-2xl font-bold text-gray-900">${hotel.price}</p>
                        <p className="text-sm text-gray-600">per night</p>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{hotel.description}</p>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-4 mb-4">
                      {hotel.amenities.map(amenity => (
                        <div key={amenity} className="flex items-center space-x-1 text-gray-600">
                          {getAmenityIcon(amenity)}
                          <span className="text-sm capitalize">{amenity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-green-600">{hotel.cancellation}</p>
                      <button
                        onClick={() => handleBookHotel(hotel)}
                        className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                      >
                        Book Now
                      </button>
                    </div>
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

export default HotelResultsPage;