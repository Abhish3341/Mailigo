import React from 'react';
import SearchBar from '../UI/SearchBar';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const handleSearch = (query: string) => {
    console.log('Searching:', query);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <div className="flex-1 flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <img 
                src="/namestation-logo.svg" 
                alt="Namestation" 
                className="h-8 w-8"
              />
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
                Namestation
              </span>
            </Link>
          </div>
          <div className="flex-1 max-w-2xl">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search..."
            />
          </div>
          <div className="flex-1" /> {/* This empty div helps center the search bar */}
        </div>
      </div>
    </header>
  );
};

export default Header;