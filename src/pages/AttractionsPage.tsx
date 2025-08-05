import React, { useState, useEffect } from 'react';
import { MapPin, Star, Clock, DollarSign, Filter, Search } from 'lucide-react';

interface Attraction {
  id: string;
  name: string;
  location: string;
  category: string;
  rating: number;
  reviews: number;
  price: string;
  duration: string;
  image: string;
  description: string;
  highlights: string[];
}

const AttractionsPage: React.FC = () => {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [filteredAttractions, setFilteredAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  // Mock attractions data
  const mockAttractions: Attraction[] = [
    {
      id: '1',
      name: 'Eiffel Tower',
      location: 'Paris, France',
      category: 'Landmark',
      rating: 4.6,
      reviews: 45231,
      price: 'From $29',
      duration: '2-3 hours',
      image: 'https://images.pexels.com/photos/161853/eiffel-tower-paris-france-tower-161853.jpeg',
      description: 'Iconic iron lattice tower and symbol of Paris, offering breathtaking city views.',
      highlights: ['Skip-the-line access', 'Elevator to top', 'City views', 'Photo opportunities']
    },
    {
      id: '2',
      name: 'Louvre Museum',
      location: 'Paris, France',
      category: 'Museum',
      rating: 4.5,
      reviews: 38942,
      price: 'From $17',
      duration: '3-4 hours',
      image: 'https://images.pexels.com/photos/2675266/pexels-photo-2675266.jpeg',
      description: 'World\'s largest art museum featuring the Mona Lisa and countless masterpieces.',
      highlights: ['Mona Lisa', 'Venus de Milo', 'Audio guide', 'Art collections']
    },
    {
      id: '3',
      name: 'Central Park',
      location: 'New York, USA',
      category: 'Park',
      rating: 4.7,
      reviews: 52183,
      price: 'Free',
      duration: '2-6 hours',
      image: 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg',
      description: 'Iconic urban park in Manhattan offering green spaces, lakes, and recreational activities.',
      highlights: ['Bethesda Fountain', 'Strawberry Fields', 'Boat rentals', 'Walking paths']
    },
    {
      id: '4',
      name: 'Tokyo Skytree',
      location: 'Tokyo, Japan',
      category: 'Landmark',
      rating: 4.4,
      reviews: 29847,
      price: 'From $18',
      duration: '1-2 hours',
      image: 'https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg',
      description: 'Tallest structure in Japan offering panoramic views of Tokyo and beyond.',
      highlights: ['Observation decks', 'City panorama', 'Shopping', 'Dining']
    },
    {
      id: '5',
      name: 'British Museum',
      location: 'London, UK',
      category: 'Museum',
      rating: 4.6,
      reviews: 41256,
      price: 'Free',
      duration: '2-4 hours',
      image: 'https://images.pexels.com/photos/6210747/pexels-photo-6210747.jpeg',
      description: 'World-renowned museum showcasing human history, art and culture from around the globe.',
      highlights: ['Rosetta Stone', 'Egyptian mummies', 'Greek sculptures', 'Free admission']
    },
    {
      id: '6',
      name: 'Times Square',
      location: 'New York, USA',
      category: 'Entertainment',
      rating: 4.2,
      reviews: 67891,
      price: 'Free',
      duration: '1-3 hours',
      image: 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg',
      description: 'Bustling commercial intersection known for bright lights, Broadway shows, and energy.',
      highlights: ['Broadway shows', 'Shopping', 'Street performers', 'Restaurants']
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAttractions(mockAttractions);
      setFilteredAttractions(mockAttractions);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = attractions.filter(attraction => {
      const matchesSearch = attraction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           attraction.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || attraction.category.toLowerCase() === selectedCategory;
      const matchesLocation = selectedLocation === 'all' || attraction.location.includes(selectedLocation);
      
      return matchesSearch && matchesCategory && matchesLocation;
    });

    setFilteredAttractions(filtered);
  }, [attractions, searchTerm, selectedCategory, selectedLocation]);

  const categories = ['all', 'landmark', 'museum', 'park', 'entertainment'];
  const locations = ['all', 'Paris', 'New York', 'Tokyo', 'London'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Discovering amazing attractions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Amazing Attractions</h1>
          <p className="text-xl text-gray-600">Explore the world's most popular destinations and hidden gems</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search attractions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location === 'all' ? 'All Locations' : location}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-center">
              <span className="text-gray-600">
                {filteredAttractions.length} attraction{filteredAttractions.length !== 1 ? 's' : ''} found
              </span>
            </div>
          </div>
        </div>

        {/* Attractions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAttractions.map(attraction => (
            <div key={attraction.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={attraction.image}
                  alt={attraction.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {attraction.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-white text-gray-900 px-2 py-1 rounded-full text-sm font-semibold">
                    {attraction.price}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {attraction.name}
                  </h3>
                </div>

                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{attraction.location}</span>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="flex text-yellow-400 mr-2">
                      {Array.from({ length: Math.floor(attraction.rating) }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{attraction.rating}</span>
                    <span className="text-sm text-gray-600 ml-1">({attraction.reviews.toLocaleString()})</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">{attraction.duration}</span>
                  </div>
                </div>

                <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                  {attraction.description}
                </p>

                {/* Highlights */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {attraction.highlights.slice(0, 3).map((highlight, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                      >
                        {highlight}
                      </span>
                    ))}
                    {attraction.highlights.length > 3 && (
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                        +{attraction.highlights.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Book Button */}
                <button className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredAttractions.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No attractions found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttractionsPage;