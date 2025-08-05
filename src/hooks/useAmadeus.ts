import { useState, useCallback } from 'react';
import Amadeus from 'amadeus';

interface LocationSuggestion {
  type: 'airport' | 'city';
  name: string;
  iataCode: string;
  cityName?: string;
  countryCode?: string;
}

const amadeus = new Amadeus({
  clientId: 'nXxy2gDlFupkff2SeeEl0GiGGIZVYzKb',
  clientSecret: '67lnAbODTnImSMrA'
});

export const useAmadeus = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchLocations = useCallback(async (keyword: string): Promise<LocationSuggestion[]> => {
    if (!keyword || keyword.length < 2) return [];
    
    setIsLoading(true);
    setError(null);

    try {
      // Search for both airports and cities
      const [airportsResponse, citiesResponse] = await Promise.all([
        amadeus.referenceData.locations.get({
          keyword,
          subType: 'AIRPORT',
          'page[limit]': 5
        }),
        amadeus.referenceData.locations.get({
          keyword,
          subType: 'CITY',
          'page[limit]': 5
        })
      ]);

      // Process airport results
      const airportResults = (airportsResponse.data?.data || []).map((loc: any) => ({
        type: 'airport' as const,
        name: loc.name,
        iataCode: loc.iataCode,
        cityName: loc.address?.cityName,
        countryCode: loc.address?.countryCode
      }));

      // Process city results
      const cityResults = (citiesResponse.data?.data || []).map((loc: any) => ({
        type: 'city' as const,
        name: loc.name,
        iataCode: loc.iataCode,
        countryCode: loc.address?.countryCode
      }));

      // Combine and deduplicate results
      const allResults = [...airportResults, ...cityResults];
      return Array.from(
        new Map(allResults.map(item => [item.iataCode, item])).values()
      );
    } catch (err: any) {
      console.error('Error searching locations:', err);
      setError(err.message || 'Failed to search locations');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    searchLocations,
    isLoading,
    error
  };
};

export default useAmadeus;
