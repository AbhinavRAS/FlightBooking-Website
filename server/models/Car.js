import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  make: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['economy', 'compact', 'mid-size', 'full-size', 'luxury', 'suv', 'convertible'],
    required: true
  },
  features: {
    passengers: { type: Number, required: true },
    doors: { type: Number, required: true },
    luggage: { type: Number, required: true },
    transmission: {
      type: String,
      enum: ['automatic', 'manual'],
      required: true
    },
    fuelType: {
      type: String,
      enum: ['gasoline', 'diesel', 'hybrid', 'electric'],
      required: true
    },
    airConditioning: { type: Boolean, default: true },
    gps: { type: Boolean, default: false },
    bluetooth: { type: Boolean, default: false }
  },
  images: [{
    url: String,
    isPrimary: { type: Boolean, default: false }
  }],
  rentalCompany: {
    name: { type: String, required: true },
    logo: String,
    rating: { type: Number, min: 0, max: 5 },
    contact: {
      phone: String,
      email: String
    }
  },
  locations: [{
    name: { type: String, required: true },
    address: String,
    city: { type: String, required: true },
    country: { type: String, required: true },
    airport: { type: Boolean, default: false },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    hours: {
      weekdays: { open: String, close: String },
      weekends: { open: String, close: String }
    }
  }],
  pricing: {
    dailyRate: { type: Number, required: true },
    weeklyRate: Number,
    monthlyRate: Number,
    currency: { type: String, default: 'USD' },
    deposit: Number,
    mileageLimit: Number, // per day
    extraMileageFee: Number // per mile/km
  },
  policies: {
    minimumAge: { type: Number, default: 21 },
    youngDriverFee: Number, // for drivers under 25
    additionalDriverFee: Number,
    cancellation: {
      free: { type: Boolean, default: true },
      deadline: Number // hours before pickup
    },
    fuel: {
      policy: {
        type: String,
        enum: ['full-to-full', 'full-to-empty', 'same-to-same'],
        default: 'full-to-full'
      }
    }
  },
  availability: [{
    location: String,
    date: Date,
    available: Number
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for efficient searching
carSchema.index({ category: 1, 'locations.city': 1 });
carSchema.index({ 'pricing.dailyRate': 1 });
carSchema.index({ 'rentalCompany.name': 1 });

export default mongoose.model('Car', carSchema);