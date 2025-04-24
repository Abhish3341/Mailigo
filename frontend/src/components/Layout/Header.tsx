import React from 'react';
import SearchBar from '../UI/SearchBar';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../utils/axiosConfig';

const Header: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      if (location.pathname.includes('/search')) {
        navigate(-1);
      }
      return;
    }

    try {
      const response = await axiosInstance.get(`/communications/search?q=${encodeURIComponent(query)}`);
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