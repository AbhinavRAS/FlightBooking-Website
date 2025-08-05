import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['flight', 'hotel', 'car', 'package', 'general'],
    required: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed', 'bogo'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true
  },
  conditions: {
    minimumAmount: Number,
    maximumDiscount: Number,
    destinations: [String],
    airlines: [String],
    hotels: [String],
    carCompanies: [String],
    bookingDates: {
      start: Date,
      end: Date
    },
    travelDates: {
      start: Date,
      end: Date
    },
    advanceBooking: Number, // days
    membershipLevels: [String]
  },
  promoCode: {
    type: String,
    unique: true,
    sparse: true
  },
  usageLimit: {
    total: Number,
    perUser: { type: Number, default: 1 }
  },
  usageCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  validFrom: {
    type: Date,
    required: true
  },
  validUntil: {
    type: Date,
    required: true
  },
  image: String,
  priority: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
offerSchema.index({ type: 1, isActive: 1 });
offerSchema.index({ promoCode: 1 });
offerSchema.index({ validFrom: 1, validUntil: 1 });

export default mongoose.model('Offer', offerSchema);