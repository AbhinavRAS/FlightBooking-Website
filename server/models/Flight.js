import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
  airline: {
    name: { type: String, required: true },
    code: { type: String, required: true },
    logo: String
  },
  flightNumber: {
    type: String,
    required: true
  },
  aircraft: {
    type: String,
    model: String
  },
  departure: {
    airport: {
      code: { type: String, required: true },
      name: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true }
    },
    terminal: String,
    gate: String,
    time: { type: Date, required: true }
  },
  arrival: {
    airport: {
      code: { type: String, required: true },
      name: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true }
    },
    terminal: String,
    gate: String,
    time: { type: Date, required: true }
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  stops: [{
    airport: {
      code: String,
      name: String,
      city: String
    },
    duration: Number, // layover duration in minutes
    terminal: String
  }],
  pricing: {
    economy: {
      available: { type: Number, default: 0 },
      price: { type: Number, required: true },
      currency: { type: String, default: 'USD' }
    },
    premiumEconomy: {
      available: { type: Number, default: 0 },
      price: Number,
      currency: { type: String, default: 'USD' }
    },
    business: {
      available: { type: Number, default: 0 },
      price: Number,
      currency: { type: String, default: 'USD' }
    },
    first: {
      available: { type: Number, default: 0 },
      price: Number,
      currency: { type: String, default: 'USD' }
    }
  },
  amenities: [{
    type: String,
    enum: ['wifi', 'meals', 'entertainment', 'power', 'lounge']
  }],
  baggage: {
    carry: {
      included: { type: Boolean, default: true },
      weight: Number, // in kg
      dimensions: String
    },
    checked: {
      included: { type: Boolean, default: false },
      weight: Number,
      price: Number
    }
  },
  cancellationPolicy: {
    refundable: { type: Boolean, default: false },
    changeFee: Number,
    cancellationFee: Number
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for efficient searching
flightSchema.index({ 'departure.airport.code': 1, 'arrival.airport.code': 1, 'departure.time': 1 });
flightSchema.index({ 'departure.time': 1 });
flightSchema.index({ 'pricing.economy.price': 1 });

export default mongoose.model('Flight', flightSchema);