import express from 'express';
import Offer from '../models/Offer.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get active offers
router.get('/', async (req, res) => {
  try {
    const { type, limit = 10 } = req.query;
    
    let query = {
      isActive: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() }
    };

    if (type && type !== 'all') {
      query.type = type;
    }

    const offers = await Offer.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .limit(parseInt(limit));

    res.json({ offers });
  } catch (error) {
    console.error('Get offers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Validate promo code
router.post('/validate-promo', authenticateToken, async (req, res) => {
  try {
    const { promoCode, bookingType, amount } = req.body;

    const offer = await Offer.findOne({
      promoCode: promoCode.toUpperCase(),
      isActive: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() }
    });

    if (!offer) {
      return res.status(404).json({ message: 'Invalid or expired promo code' });
    }

    // Check usage limits
    if (offer.usageLimit.total && offer.usageCount >= offer.usageLimit.total) {
      return res.status(400).json({ message: 'Promo code usage limit exceeded' });
    }

    // Check type compatibility
    if (offer.type !== 'general' && offer.type !== bookingType) {
      return res.status(400).json({ message: 'Promo code not valid for this booking type' });
    }

    // Check minimum amount
    if (offer.conditions.minimumAmount && amount < offer.conditions.minimumAmount) {
      return res.status(400).json({ 
        message: `Minimum booking amount of $${offer.conditions.minimumAmount} required` 
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (offer.discountType === 'percentage') {
      discountAmount = (amount * offer.discountValue) / 100;
      if (offer.conditions.maximumDiscount) {
        discountAmount = Math.min(discountAmount, offer.conditions.maximumDiscount);
      }
    } else if (offer.discountType === 'fixed') {
      discountAmount = offer.discountValue;
    }

    res.json({
      valid: true,
      offer: {
        title: offer.title,
        discountType: offer.discountType,
        discountValue: offer.discountValue,
        discountAmount: Math.round(discountAmount * 100) / 100
      }
    });
  } catch (error) {
    console.error('Validate promo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured offers
router.get('/featured', async (req, res) => {
  try {
    const offers = await Offer.find({
      isActive: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() },
      priority: { $gte: 5 }
    })
    .sort({ priority: -1 })
    .limit(6);

    res.json({ offers });
  } catch (error) {
    console.error('Get featured offers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;