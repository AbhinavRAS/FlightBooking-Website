import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import debounce, { DebouncedFunc } from 'lodash.debounce';

interface AirportResult {
  label: string;
  iataCode: string;
  city: string;
  country: string;
}

interface AirportSearchProps {
  onSelect: (result: AirportResult) => void;
}

const AirportSearch: React.FC<AirportSearchProps> = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AirportResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions: DebouncedFunc<(q: string) => Promise<void>> = debounce(
    async (q: string) => {
      if (!q || q.length < 3) {
        setResults([]);
        return;
      }

      try {
        const res = await axios.get(`/api/airports?q=${encodeURIComponent(q)}`);
        if (res.data && Array.isArray(res.data)) {
          setResults(res.data);
          setShowDropdown(true);
        } else {
          console.error('Invalid response format from API');
          setResults([]);
        }
      } catch (err: any) {
        console.error('❌ Failed to fetch airports:', err.response?.data || err.message);
        setResults([]);
      }
    },
    300
  );

  useEffect(() => {
    fetchSuggestions(query);
    return () => fetchSuggestions.cancel();
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        placeholder="Enter city or airport"
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        className="w-full px-4 py-2 border rounded shadow-sm"
      />

      {showDropdown && results.length > 0 && (
        <ul className="absolute z-10 bg-white border mt-1 rounded max-h-60 overflow-y-auto shadow-lg w-full">
          {results.map((item, idx) => (
            <li
              key={idx}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
              onClick={() => {
                setQuery(item.label);
                setShowDropdown(false);
                onSelect(item);
              }}
            >
              {item.label} – {item.city}, {item.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AirportSearch;
