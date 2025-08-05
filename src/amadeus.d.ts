declare module 'amadeus' {
  export interface AmadeusOptions {
    clientId: string;
    clientSecret: string;
    hostname?: string;
    customAppId?: string;
    customAppVersion?: string;
    port?: number;
    ssl?: boolean;
    lang?: string;
    logLevel?: 'silent' | 'warn' | 'debug';
  }

  export interface Location {
    type: string;
    subType: string;
    name: string;
    detailedName: string;
    id: string;
    self: {
      href: string;
      methods: string[];
    };
    iataCode: string;
    address: {
      cityName: string;
      cityCode: string;
      countryName: string;
      countryCode: string;
      regionCode: string;
    };
  }

  export interface ReferenceDataResponse {
    data: {
      data: Location[];
    };
  }

  export interface AmadeusInstance {
    referenceData: {
      locations: {
        get(options: {
          keyword: string;
          subType: 'AIRPORT' | 'CITY';
          'page[limit]': number;
        }): Promise<ReferenceDataResponse>;
      };
    };
  }

  class AmadeusClass {
    constructor(options: AmadeusOptions);
    initialize(options: AmadeusOptions): AmadeusInstance;
  }

  const Amadeus: {
    new (options: AmadeusOptions): AmadeusInstance;
  };
  
  export default Amadeus;
}