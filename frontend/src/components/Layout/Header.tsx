import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              Namestation
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;