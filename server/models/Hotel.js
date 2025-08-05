import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: String,
    country: { type: String, required: true },
    zipCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  rating: {
    stars: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    reviewCount: {
      type: Number,
      default: 0
    }
  },
  images: [{
    url: String,
    caption: String,
    isPrimary: { type: Boolean, default: false }
  }],
  amenities: [{
    type: String,
    enum: [
      'wifi', 'parking', 'pool', 'gym', 'spa', 'restaurant', 
      'bar', 'room-service', 'concierge', 'business-center',
      'pet-friendly', 'airport-shuttle', 'laundry', 'ac'
    ]
  }],
  roomTypes: [{
    name: { type: String, required: true },
    description: String,
    maxOccupancy: { type: Number, required: true },
    bedType: String,
    size: Number, // in sq meters
    amenities: [String],
    images: [String],
    pricing: {
      basePrice: { type: Number, required: true },
      currency: { type: String, default: 'USD' },
      taxesIncluded: { type: Boolean, default: false }
    },
    availability: [{
      date: Date,
      available: Number,
      price: Number
    }]
  }],
  policies: {
    checkIn: {
      from: String, // "15:00"
      to: String    // "23:00"
    },
    checkOut: {
      from: String, // "07:00"
      to: String    // "12:00"
    },
    cancellation: {
      freeCancellation: { type: Boolean, default: false },
      deadline: Number, // hours before check-in
      penalty: Number   // percentage or fixed amount
    },
    children: String,
    pets: String,
    smoking: { type: Boolean, default: false }
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for efficient searching
hotelSchema.index({ 'location.city': 1, 'location.country': 1 });
hotelSchema.index({ 'location.coordinates': '2dsphere' });
hotelSchema.index({ 'rating.average': -1 });
hotelSchema.index({ 'roomTypes.pricing.basePrice': 1 });

export default mongoose.model('Hotel', hotelSchema);