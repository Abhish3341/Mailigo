import React, { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { debounce } from '../../utils/helpers';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = 'Search emails...' 
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Debounce search to avoid too many API calls
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      onSearch(searchQuery);
      if (searchQuery && !location.pathname.includes('/search')) {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
    }, 300),
    [onSearch, navigate, location.pathname]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    debouncedSearch(newQuery);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
    if (location.pathname.includes('/search')) {
      navigate(-1);
    }
  };

  return (
    <form 
      onSubmit={(e) => e.preventDefault()}
      className={`relative max-w-2xl w-full transition-all duration-200 ${
        isFocused ? 'scale-[1.02]' : 'scale-100'
      }`}
    >
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search 
            className="h-5 w-5 text-gray-400" 
            aria-hidden="true" 
          />
        </div>
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-full 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   shadow-sm transition-all duration-200"
          placeholder={placeholder}
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X 
              className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" 
              aria-hidden="true" 
            />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;