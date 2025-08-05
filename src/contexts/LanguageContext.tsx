import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import i18n from '../i18n/config';

type Currency = {
  code: string;
  symbol: string;
  name: string;
  rate: number;
};

type LanguageContextType = {
  language: string;
  currency: Currency;
  setLanguage: (lang: string) => void;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

type LanguageProviderProps = {
  children: ReactNode;
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<string>('en');
  const [currency, setCurrencyState] = useState<Currency>({
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    rate: 1
  });

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('currency', JSON.stringify(newCurrency));
  };

  const formatPrice = (price: number): string => {
    return `${currency.symbol}${(price * currency.rate).toFixed(2)}`;
  };

  useEffect(() => {
    // Load saved language and currency from localStorage
    const savedLanguage = localStorage.getItem('language');
    const savedCurrency = localStorage.getItem('currency');
    
    if (savedLanguage) {
      setLanguageState(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    }
    
    if (savedCurrency) {
      try {
        setCurrencyState(JSON.parse(savedCurrency));
      } catch (error) {
        console.error('Error parsing saved currency:', error);
      }
    }
  }, []);

  const value = {
    language,
    currency,
    setLanguage,
    setCurrency,
    formatPrice,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
