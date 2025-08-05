// server/routes/airports.ts
import { Router } from 'express';
import Amadeus from 'amadeus';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();

// Initialise Amadeus SDK once
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

// Define the type for Amadeus location data
interface AmadeusLocation {
  name: string;
  iataCode: string;
  address: {
    cityName: string;
    countryName: string;
  };
}

/**
 * GET /api/airports?q=del
 * Returns up to 10 matching airports & cities
 */
router.get('/airports', async (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';

  if (!q || q.length < 3) {
    return res.json([]);          // too short → return empty list
  }

  try {
    const { data } = await amadeus.referenceData.locations.get({
      keyword: q,
      subType: 'CITY,AIRPORT',
      'page[limit]': 10,
    });

    // Shape the data for your frontend
    const results = data.map((loc: AmadeusLocation) => ({
      label: `${loc.name} (${loc.iataCode})`,
      iataCode: loc.iataCode,
      city: loc.address.cityName,
      country: loc.address.countryName,
    }));

    res.json(results);
  } catch (err) {
    if (err instanceof Error) {
      console.error('Amadeus error:', err.message);
    } else {
      console.error('Amadeus error:', err);
    }
    res.status(500).json({ error: 'Failed to fetch airports' });
  }
});

export default router;
