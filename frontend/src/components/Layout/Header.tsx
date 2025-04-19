import React from 'react';
import SearchBar from '../UI/SearchBar';
import { Link } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { loading } = useAuth();
  
  const handleSearch = (query: string) => {
    console.log('Searching:', query);
  };

  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1 max-w-2xl mx-auto">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search..."
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;