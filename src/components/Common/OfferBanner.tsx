import React, { useState, useEffect } from 'react';
import { X, Tag, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

interface Offer {
  id: string;
  title: string;
  description: string;
  discountValue: number;
  discountType: string;
  validUntil: string;
  promoCode?: string;
  image?: string;
}

const OfferBanner: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [currentOffer, setCurrentOffer] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Mock offers data - replace with API call
    const mockOffers: Offer[] = [
      {
        id: '1',
        title: 'Flash Sale: 30% Off Flights',
        description: 'Book your next adventure with 30% off all international flights',
        discountValue: 30,
        discountType: 'percentage',
        validUntil: '2024-02-15',
        promoCode: 'FLASH30',
        image: 'https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg'
      },
      {
        id: '2',
        title: 'Hotel Special: Stay 3 Nights, Pay 2',
        description: 'Luxury hotels worldwide with amazing deals',
        discountValue: 33,
        discountType: 'percentage',
        validUntil: '2024-02-20',
        promoCode: 'STAY3PAY2'
      },
      {
        id: '3',
        title: 'Car Rental: $50 Off Weekly Rentals',
        description: 'Perfect for road trips and extended stays',
        discountValue: 50,
        discountType: 'fixed',
        validUntil: '2024-02-25',
        promoCode: 'DRIVE50'
      }
    ];

    setOffers(mockOffers);

    // Auto-rotate offers
    const interval = setInterval(() => {
      setCurrentOffer((prev) => (prev + 1) % mockOffers.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // GSAP animation for offer rotation
    if (offers.length > 0) {
      gsap.fromTo('.offer-content', 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [currentOffer, offers]);

  if (!isVisible || offers.length === 0) return null;

  const offer = offers[currentOffer];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="flex items-center space-x-2">
                <Tag className="h-5 w-5" />
                <span className="font-semibold text-sm">LIMITED TIME</span>
              </div>

              <div className="offer-content flex-1">
                <div className="flex items-center space-x-6">
                  <div>
                    <h3 className="font-bold text-lg">{offer.title}</h3>
                    <p className="text-sm opacity-90">{offer.description}</p>
                  </div>

                  {offer.promoCode && (
                    <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                      <span className="text-sm font-mono font-bold">
                        Code: {offer.promoCode}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center space-x-1 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>Ends {new Date(offer.validUntil).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <button className="bg-white text-orange-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                Book Now
              </button>
            </div>

            <button
              onClick={() => setIsVisible(false)}
              className="ml-4 p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Progress indicators */}
          {offers.length > 1 && (
            <div className="flex justify-center space-x-2 mt-3">
              {offers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentOffer(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentOffer ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OfferBanner;