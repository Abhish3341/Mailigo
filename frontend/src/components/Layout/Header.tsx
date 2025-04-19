import React, { useState } from 'react';
import SearchBar from '../UI/SearchBar';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../utils/axiosConfig';

const Header: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axiosInstance.get(`/api/communications/search?q=${encodeURIComponent(query)}`);
      setSearchResults(response.data);
      
      // If we have results and we're not already on the search page, navigate there
      if (response.data.length > 0 && !location.pathname.includes('/search')) {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1 max-w-2xl mx-auto">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search emails..."
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;