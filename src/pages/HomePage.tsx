import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plane, Building2, Car, MapPin, TrendingUp, Shield, Clock, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useOffers } from '../hooks/useApi';
import { fadeInUp, staggerAnimation, parallaxEffect, countUp } from '../utils/animations';
import gsap from 'gsap';
import { getCurrentDateTimeLocal, isPastDate, isReturnBeforeDeparture, validateFutureDate } from '../utils/dateUtils';

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('flights');
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [hotelDestination, setHotelDestination] = useState('');
  const [carLocation, setCarLocation] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const navigate = useNavigate();
  const { formatPrice } = useLanguage();
  const { offers } = useOffers();
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const [minDateTime, setMinDateTime] = useState(getCurrentDateTimeLocal());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update minDateTime every minute to keep it current
  useEffect(() => {
    const timer = setInterval(() => {
      setMinDateTime(getCurrentDateTimeLocal());
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(timer);
  }, []);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (activeTab === 'flights') {
      if (!from.trim()) errors.from = 'Departure city is required';
      if (!to.trim()) errors.to = 'Destination city is required';

      // Enhanced departure date validation
      const departureValidation = validateFutureDate(departureDate);
      if (!departureValidation.isValid) {
        errors.departureDate = departureValidation.message;
      }

      // Enhanced return date validation
      if (returnDate) {
        if (isPastDate(returnDate)) {
          errors.returnDate = 'Return date must be in the future';
        } else if (departureDate && isReturnBeforeDeparture(departureDate, returnDate)) {
          errors.returnDate = 'Return date must be after departure date';
        }
      }
    } else if (activeTab === 'hotels') {
      if (!hotelDestination.trim()) errors.hotelDestination = 'Destination is required';
      
      if (!checkInDate) {
        errors.checkInDate = 'Check-in date and time are required';
      } else if (isPastDate(checkInDate)) {
        errors.checkInDate = 'Check-in must be in the future';
      }
      
      if (checkOutDate) {
        if (isPastDate(checkOutDate)) {
          errors.checkOutDate = 'Check-out date must be in the future';
        } else if (checkInDate && isReturnBeforeDeparture(checkInDate, checkOutDate)) {
          errors.checkOutDate = 'Check-out date must be after check-in date';
        }
      }
    } else if (activeTab === 'cars') {
      if (!carLocation.trim()) errors.carLocation = 'Pick-up location is required';
      
      if (!pickupDate) {
        errors.pickupDate = 'Pick-up date and time are required';
      } else if (isPastDate(pickupDate)) {
        errors.pickupDate = 'Pick-up must be in the future';
      }
      
      if (dropoffDate) {
        if (isPastDate(dropoffDate)) {
          errors.dropoffDate = 'Drop-off date must be in the future';
        } else if (pickupDate && isReturnBeforeDeparture(pickupDate, dropoffDate)) {
          errors.dropoffDate = 'Drop-off date must be after pick-up date';
        }
      }
    } else if (activeTab === 'attractions') {
      if (!searchQuery.trim() && !location) {
        errors.searchQuery = 'Please enter a search term or select a location';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      if (activeTab === 'flights') {
        navigate(`/flights/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&departureDate=${encodeURIComponent(departureDate)}&returnDate=${encodeURIComponent(returnDate)}`);
      } else if (activeTab === 'hotels') {
        navigate(`/hotels/search?destination=${encodeURIComponent(hotelDestination)}&checkInDate=${encodeURIComponent(checkInDate)}&checkOutDate=${encodeURIComponent(checkOutDate)}`);
      } else if (activeTab === 'attractions') {
        const params = new URLSearchParams();
        if (searchQuery) params.append('q', searchQuery);
        if (location) params.append('location', location);
        navigate(`/attractions?${params.toString()}`);
      } else if (activeTab === 'cars') {
        navigate(`/cars/search?location=${encodeURIComponent(carLocation)}&pickupDate=${encodeURIComponent(pickupDate)}&dropoffDate=${encodeURIComponent(dropoffDate)}`);
      }
      setIsSubmitting(false);
    }, 500);
  };

  const handleDepartureDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setDepartureDate(selectedDate);
    
    // If return date exists and is before the new departure date, clear it
    if (returnDate && isReturnBeforeDeparture(selectedDate, returnDate)) {
      setReturnDate('');
    }
  };

  const handleReturnDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReturnDate(e.target.value);
  };

  useEffect(() => {
    // GSAP animations
    const tl = gsap.timeline();
    
    tl.fromTo('.hero-title', 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
    )
    .fromTo('.hero-subtitle',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.5'
    )
    .fromTo('.search-widget',
      { opacity: 0, y: 40, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.7)' },
      '-=0.3'
    );

    // Parallax effect for hero background
    if (heroRef.current) {
      parallaxEffect(heroRef.current, 0.3);
    }

    // Animate stats when in view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          countUp('.stat-number-1', 2500000, 2);
          countUp('.stat-number-2', 150, 1.5);
          countUp('.stat-number-3', 98, 1.8);
          countUp('.stat-number-4', 24, 1.2);
        }
      });
    });

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const destinations = [
    { 
      name: 'Paris', 
      country: 'France', 
      image: 'https://images.pexels.com/photos/161853/eiffel-tower-paris-france-tower-161853.jpeg', 
      price: 299,
      description: 'City of Light and Romance'
    },
    { 
      name: 'Tokyo', 
      country: 'Japan', 
      image: 'https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg', 
      price: 459,
      description: 'Modern metropolis meets tradition'
    },
    { 
      name: 'New York', 
      country: 'USA', 
      image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg', 
      price: 199,
      description: 'The city that never sleeps'
    },
    { 
      name: 'London', 
      country: 'UK', 
      image: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg', 
      price: 349,
      description: 'Royal heritage and modern culture'
    }
  ];

  const stats = [
    { number: '2.5M+', label: 'Happy Travelers', className: 'stat-number-1' },
    { number: '150+', label: 'Countries', className: 'stat-number-2' },
    { number: '98%', label: 'Satisfaction Rate', className: 'stat-number-3' },
    { number: '24/7', label: 'Support', className: 'stat-number-4' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-800 overflow-hidden"
      >
        <div className="absolute inset-0 bg-black opacity-40 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center transform scale-110"
          style={{ backgroundImage: 'url(https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg)' }}
        ></div>
        
        <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="hero-title text-5xl md:text-6xl font-bold mb-6">
            Your Journey Begins Here
          </h1>
          <p className="hero-subtitle text-xl md:text-2xl mb-8 opacity-90">
            Discover the world with unbeatable deals on flights, hotels, and car rentals
          </p>

          {/* Search Widget */}
          <div className="search-widget bg-white rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { id: 'flights', icon: Plane, label: 'Flights' },
                { id: 'hotels', icon: Building2, label: 'Hotels' },
                { id: 'cars', icon: Car, label: 'Cars' },
                { id: 'attractions', icon: MapPin, label: 'Attractions' }
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeTab === id
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:bg-gray-100 hover:scale-105'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="space-y-4">
              {activeTab === 'flights' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                    <input 
                      type="text" 
                      placeholder="New York" 
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 ${
                        formErrors.from ? 'border-red-500' : ''
                      }`}
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      required
                    />
                    {formErrors.from && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.from}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                    <input 
                      type="text" 
                      placeholder="Paris" 
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 ${
                        formErrors.to ? 'border-red-500' : ''
                      }`}
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      required
                    />
                    {formErrors.to && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.to}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Departure</label>
                    <input 
                      type="datetime-local" 
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        formErrors.departureDate ? 'border-red-500' : ''
                      }`}
                      min={minDateTime}
                      value={departureDate}
                      onChange={(e) => {
                        setDepartureDate(e.target.value);
                        // Clear any existing errors when user starts typing
                        if (formErrors.departureDate) {
                          setFormErrors(prev => ({
                            ...prev,
                            departureDate: ''
                          }));
                        }
                      }}
                      required
                    />
                    {formErrors.departureDate && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.departureDate}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Return (Optional)</label>
                    <input 
                      type="datetime-local" 
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        formErrors.returnDate ? 'border-red-500' : ''
                      }`}
                      min={departureDate || minDateTime}
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      disabled={!departureDate}
                    />
                    {formErrors.returnDate && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.returnDate}</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'hotels' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                    <input 
                      type="text" 
                      placeholder="Paris, France" 
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 ${
                        formErrors.hotelDestination ? 'border-red-500' : ''
                      }`}
                      value={hotelDestination}
                      onChange={(e) => setHotelDestination(e.target.value)}
                      required
                    />
                    {formErrors.hotelDestination && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.hotelDestination}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                    <input 
                      type="datetime-local" 
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        formErrors.checkInDate ? 'border-red-500' : ''
                      }`}
                      min={minDateTime}
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      required
                    />
                    {formErrors.checkInDate && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.checkInDate}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                    <input 
                      type="datetime-local" 
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        formErrors.checkOutDate ? 'border-red-500' : ''
                      }`}
                      min={checkInDate || minDateTime}
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      required
                    />
                    {formErrors.checkOutDate && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.checkOutDate}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                    <select className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                      <option>1 Room, 2 Adults</option>
                      <option>1 Room, 1 Adult</option>
                      <option>2 Rooms, 4 Adults</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'attractions' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search Attractions</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Search by attraction, city, or category" 
                        className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 ${
                          formErrors.searchQuery ? 'border-red-500' : ''
                        }`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                    {formErrors.searchQuery && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.searchQuery}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <select 
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    >
                      <option value="">Any Location</option>
                      <option>Paris, France</option>
                      <option>New York, USA</option>
                      <option>Tokyo, Japan</option>
                      <option>Rome, Italy</option>
                      <option>Barcelona, Spain</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'cars' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pick-up Location</label>
                    <input 
                      type="text" 
                      placeholder="New York Airport" 
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 ${
                        formErrors.carLocation ? 'border-red-500' : ''
                      }`}
                      value={carLocation}
                      onChange={(e) => setCarLocation(e.target.value)}
                      required
                    />
                    {formErrors.carLocation && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.carLocation}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pick-up Date</label>
                    <input 
                      type="datetime-local" 
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        formErrors.pickupDate ? 'border-red-500' : ''
                      }`}
                      min={minDateTime}
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      required
                    />
                    {formErrors.pickupDate && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.pickupDate}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Drop-off Date</label>
                    <input 
                      type="datetime-local" 
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        formErrors.dropoffDate ? 'border-red-500' : ''
                      }`}
                      min={pickupDate || minDateTime}
                      value={dropoffDate}
                      onChange={(e) => setDropoffDate(e.target.value)}
                      required
                    />
                    {formErrors.dropoffDate && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.dropoffDate}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Car Type</label>
                    <select className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                      <option>Economy</option>
                      <option>Compact</option>
                      <option>Mid-size</option>
                      <option>Full-size</option>
                      <option>Luxury</option>
                    </select>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className={`w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-8 rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    <span>Search {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-4xl md:text-5xl font-bold text-blue-600 mb-2 ${stat.className}`}>
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose TravelWise?</h2>
            <p className="text-xl text-gray-600">Experience the difference with our premium travel services</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 bg-white group hover:scale-105"
            >
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Best Prices Guaranteed</h3>
              <p className="text-gray-600">We compare millions of deals to ensure you get the best prices on flights, hotels, and car rentals.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 bg-white group hover:scale-105"
            >
              <div className="bg-gradient-to-br from-green-100 to-green-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Booking</h3>
              <p className="text-gray-600">Your data is protected with bank-level security encryption and secure payment processing.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 bg-white group hover:scale-105"
            >
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Our dedicated support team is available around the clock to assist you with any travel needs.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Popular Destinations</h2>
            <p className="text-xl text-gray-600">Discover amazing places around the world</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination, index) => (
              <motion.div
                key={destination.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-orange-600 shadow-lg">
                    From {formatPrice(destination.price)}
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-semibold">{destination.name}</h3>
                    <p className="text-sm opacity-90">{destination.country}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 text-sm mb-3">{destination.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">4.8 (2.1k reviews)</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers */}
      {offers.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Special Offers</h2>
              <p className="text-xl text-blue-100">Limited time deals you don't want to miss</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {offers.slice(0, 3).map((offer: any, index: any) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-4 inline-block">
                      {offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `$${offer.discountValue} OFF`}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{offer.title}</h3>
                    <p className="text-gray-600 mb-4">{offer.description}</p>
                    {offer.promoCode && (
                      <div className="bg-gray-100 px-3 py-2 rounded-lg mb-4">
                        <span className="text-sm font-mono font-bold">Code: {offer.promoCode}</span>
                      </div>
                    )}
                    <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300">
                      Claim Offer
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-xl text-gray-300 mb-8">Get exclusive deals and travel tips delivered to your inbox</p>
          
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
            />
            <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-r-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-semibold">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;