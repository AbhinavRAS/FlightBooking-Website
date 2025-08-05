import Amadeus from 'amadeus';
import dotenv from 'dotenv';
dotenv.config();

console.log('Initializing Amadeus client...');

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID!,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET!,
  logLevel: 'debug',
});

async function testAmadeusConnection() {
  try {
    console.log('\n=== Testing Amadeus API ===');

    const response = await amadeus.referenceData.locations.get({
      keyword: 'LON',
      subType: 'AIRPORT',
      'page[limit]': 2,
    });

    console.log('\n✅ API Response:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error: any) {
    console.error('\n❌ Error occurred:', error.message);
    if (error.response) {
      console.error('Status Code:', error.response.status);
      console.error('Details:', JSON.stringify(error.response.body, null, 2));
    }
  }
}

testAmadeusConnection();
