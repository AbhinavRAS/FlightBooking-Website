import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add auth token, API key, and API secret to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('travelwise_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Add API key and secret to all requests
  config.headers['X-API-Key'] = 'nXxy2gDlFupkff2SeeEl0GiGGIZVYzKb';
  config.headers['X-API-Secret'] = '67lnAbODTnImSMrA';
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('travelwise_token');
      localStorage.removeItem('travelwise_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const useApi = () => {
  return api;
};

export const useFetch = <T>(url: string, dependencies: any[] = []) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(url);
        setData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: () => setLoading(true) };
};

export const useFlightSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchFlights = async (searchParams: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/flights/search', { params: searchParams });
      setResults(response.data.flights);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Search failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, searchFlights };
};

interface OffersResponse {
  offers: any[]; // You can replace 'any' with a more specific type for your offers
}

export const useOffers = (type?: string) => {
  const { data, loading, error } = useFetch<OffersResponse>(`/offers${type ? `?type=${type}` : ''}`, [type]);
  return { offers: data?.offers || [], loading, error };
};

export default api;