import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Inbox, Send, PenTool, Menu, X, User, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../UI/ThemeToggle';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(true);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: <Home size={20} />,
    },
    {
      label: 'Inbox',
      path: '/inbox',
      icon: <Inbox size={20} />,
    },
    {
      label: 'Sent',
      path: '/sent',
      icon: <Send size={20} />,
    },
    {
      label: 'Compose',
      path: '/compose',
      icon: <PenTool size={20} />,
    },
  ];

  return (
    <aside className={`bg-gray-100 dark:bg-gray-800 min-h-full flex flex-col transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'}`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 hover:bg-gray-200 dark:hover:bg-gray-700 lg:hidden"
      >
        {isExpanded ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 mt-4 px-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {isExpanded && item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Controls at Bottom */}
      <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
        {user && (
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => navigate('/profile')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 ${
                isActive('/profile') ? 'bg-blue-100 dark:bg-blue-900' : ''
              }`}
            >
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <User size={20} />
              )}
              {isExpanded && (
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user.name}
                </span>
              )}
            </button>
            <div className="flex items-center justify-between px-4">
              <ThemeToggle />
              <button
                onClick={logout}
                className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {isExpanded ? 'Logout' : ''}
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;