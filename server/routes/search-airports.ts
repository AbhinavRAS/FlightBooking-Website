import express from 'express';
import Amadeus from 'amadeus';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

interface AmadeusLocation {
  name: string;
  iataCode: string;
  address: {
    cityName: string;
    countryName: string;
  };
}

router.get('/search-airports', async (req, res) => {
  const query = req.query.q as string | undefined;

  if (!query || typeof query !== 'string' || query.length < 3) {
    return res.json([]);
  }

  try {
    const { data } = await amadeus.referenceData.locations.get({
      keyword: query,
      subType: 'CITY,AIRPORT',
      'page[limit]': 10,
    });

    const results = data.map((loc: AmadeusLocation) => ({
      label: `${loc.name} (${loc.iataCode})`,
      iataCode: loc.iataCode,
      city: loc.address.cityName,
      country: loc.address.countryName,
    }));

    res.json(results);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error 
      ? err.message 
      : typeof err === 'object' && err !== null && 'response' in err 
        ? (err as { response: { body?: any } }).response?.body 
        : 'An unknown error occurred';
    
    console.error('Amadeus API error:', errorMessage);
    res.status(500).json({ error: 'Failed to fetch airports from Amadeus API' });
  }
});

export default router;
