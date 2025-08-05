import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Plane className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">TravelWise</span>
            </div>
            <p className="text-gray-300 mb-4">
              Your trusted travel partner for flights, hotels, and car rentals worldwide. 
              Discover amazing destinations at the best prices.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Youtube className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link to="/flights/search" className="text-gray-300 hover:text-white transition-colors">Flight Booking</Link></li>
              <li><Link to="/hotels/search" className="text-gray-300 hover:text-white transition-colors">Hotel Reservations</Link></li>
              <li><Link to="/cars/search" className="text-gray-300 hover:text-white transition-colors">Car Rentals</Link></li>
              <li><Link to="/attractions" className="text-gray-300 hover:text-white transition-colors">Tourist Attractions</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-white transition-colors">Travel Insurance</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-gray-300 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-white transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">support@travelwise.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">123 Travel St, Adventure City, AC 12345</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 TravelWise. All rights reserved. | Powered by advanced booking technology
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;