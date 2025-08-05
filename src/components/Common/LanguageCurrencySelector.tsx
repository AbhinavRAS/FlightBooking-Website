import React, { useState } from 'react';
import { Globe, DollarSign, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface Currency {
  code: string;
  symbol: string;
  name: string;
}

interface LanguageContext {
  language: string;
  currency: Currency;
  setLanguage: (language: string) => void;
  setCurrency: (currency: Currency) => void;
  availableLanguages?: Language[];
  availableCurrencies?: Currency[];
}

// Default languages and currencies in case they're not provided by the context
const defaultLanguages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

const defaultCurrencies: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
];

const LanguageCurrencySelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'language' | 'currency'>('language');
  const {
    language = 'en',
    currency = { code: 'USD', symbol: '$', name: 'US Dollar' },
    setLanguage,
    setCurrency,
    availableLanguages = defaultLanguages,
    availableCurrencies = defaultCurrencies,
  } = useLanguage() as unknown as LanguageContext;

  const currentLanguage = availableLanguages?.find((lang: Language) => lang.code === language) || defaultLanguages[0];
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">
          {currentLanguage?.flag} {currency?.symbol || '$'}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-50">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('language')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'language'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Globe className="h-4 w-4 inline mr-2" />
              Language
            </button>
            <button
              onClick={() => setActiveTab('currency')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'currency'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <DollarSign className="h-4 w-4 inline mr-2" />
              Currency
            </button>
          </div>

          {/* Content */}
          <div className="max-h-64 overflow-y-auto">
            {activeTab === 'language' ? (
              <div className="p-2">
                {availableLanguages.map((lang: Language) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left hover:bg-gray-50 transition-colors ${
                      language === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="font-medium">{lang.name}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-2">
                {availableCurrencies.map((curr: Currency) => (
                  <button
                    key={curr.code}
                    onClick={() => {
                      setCurrency(curr);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-left hover:bg-gray-50 transition-colors ${
                      currency.code === curr.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-lg">{curr.symbol}</span>
                      <div>
                        <div className="font-medium">{curr.code}</div>
                        <div className="text-xs text-gray-500">{curr.name}</div>
                      </div>
                    </div>
                    {currency.code === curr.code && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageCurrencySelector;