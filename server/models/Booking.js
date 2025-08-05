import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['flight', 'hotel', 'car', 'package'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'refunded'],
    default: 'pending'
  },
  bookingReference: {
    type: String,
    unique: true,
    required: true
  },
  
  // Flight booking details
  flight: {
    outbound: {
      flightId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight' },
      flightNumber: String,
      departure: {
        airport: String,
        time: Date
      },
      arrival: {
        airport: String,
        time: Date
      },
      class: String,
      seatNumbers: [String]
    },
    return: {
      flightId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight' },
      flightNumber: String,
      departure: {
        airport: String,
        time: Date
      },
      arrival: {
        airport: String,
        time: Date
      },
      class: String,
      seatNumbers: [String]
    }
  },

  // Hotel booking details
  hotel: {
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
    hotelName: String,
    roomType: String,
    checkIn: Date,
    checkOut: Date,
    nights: Number,
    rooms: Number,
    guests: {
      adults: Number,
      children: Number
    }
  },

  // Car rental details
  car: {
    carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
    make: String,
    model: String,
    category: String,
    pickupLocation: String,
    dropoffLocation: String,
    pickupDate: Date,
    dropoffDate: Date,
    days: Number
  },

  passengers: [{
    type: {
      type: String,
      enum: ['adult', 'child', 'infant']
    },
    title: String,
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    nationality: String,
    passportNumber: String,
    passportExpiry: Date
  }],

  pricing: {
    subtotal: { type: Number, required: true },
    taxes: { type: Number, default: 0 },
    fees: { type: Number, default: 0 },
    discounts: { type: Number, default: 0 },
    total: { type: Number, required: true },
    currency: { type: String, default: 'USD' }
  },

  payment: {
    method: String,
    transactionId: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    paidAt: Date
  },

  contact: {
    email: String,
    phone: String
  },

  specialRequests: String,
  
  cancellation: {
    isCancelled: { type: Boolean, default: false },
    cancelledAt: Date,
    reason: String,
    refundAmount: Number,
    refundStatus: {
      type: String,
      enum: ['pending', 'processed', 'failed']
    }
  }
}, {
  timestamps: true
});

// Generate booking reference
bookingSchema.pre('save', function(next) {
  if (!this.bookingReference) {
    const prefix = this.type.toUpperCase().substring(0, 2);
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.bookingReference = `TW-${prefix}-${timestamp}${random}`;
  }
  next();
});

// Indexes
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ bookingReference: 1 });
bookingSchema.index({ status: 1 });

export default mongoose.model('Booking', bookingSchema);