import express from 'express';
import Flight from '../models/Flight.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Search flights
router.get('/search', async (req, res) => {
  try {
    const {
      from,
      to,
      departDate,
      returnDate,
      passengers = 1,
      class: travelClass = 'economy',
      maxPrice,
      stops,
      airlines
    } = req.query;

    // Build search query
    let query = {
      'departure.airport.code': from,
      'arrival.airport.code': to,
      'departure.time': {
        $gte: new Date(departDate),
        $lt: new Date(new Date(departDate).getTime() + 24 * 60 * 60 * 1000)
      },
      isActive: true
    };

    // Add filters
    if (maxPrice) {
      query[`pricing.${travelClass}.price`] = { $lte: parseFloat(maxPrice) };
    }

    if (stops === 'nonstop') {
      query.stops = { $size: 0 };
    } else if (stops === '1stop') {
      query.stops = { $size: 1 };
    }

    if (airlines) {
      const airlineList = airlines.split(',');
      query['airline.code'] = { $in: airlineList };
    }

    // Execute search
    const flights = await Flight.find(query)
      .sort({ [`pricing.${travelClass}.price`]: 1 })
      .limit(50);

    // Filter by availability
    const availableFlights = flights.filter(flight => {
      const classInfo = flight.pricing[travelClass];
      return classInfo && classInfo.available >= passengers;
    });

    res.json({
      flights: availableFlights,
      total: availableFlights.length,
      searchParams: req.query
    });
  } catch (error) {
    console.error('Flight search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get flight details
router.get('/:id', async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    res.json({ flight });
  } catch (error) {
    console.error('Get flight error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get popular destinations
router.get('/destinations/popular', async (req, res) => {
  try {
    const destinations = await Flight.aggregate([
      { $match: { isActive: true } },
      { $group: { 
        _id: '$arrival.airport.city',
        country: { $first: '$arrival.airport.country' },
        airport: { $first: '$arrival.airport.code' },
        count: { $sum: 1 },
        minPrice: { $min: '$pricing.economy.price' }
      }},
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({ destinations });
  } catch (error) {
    console.error('Popular destinations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get airlines
router.get('/airlines/list', async (req, res) => {
  try {
    const airlines = await Flight.aggregate([
      { $match: { isActive: true } },
      { $group: {
        _id: '$airline.code',
        name: { $first: '$airline.name' },
        logo: { $first: '$airline.logo' }
      }},
      { $sort: { name: 1 } }
    ]);

    res.json({ airlines });
  } catch (error) {
    console.error('Get airlines error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;