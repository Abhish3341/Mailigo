import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Inbox, Send, PenTool } from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
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
    <aside className="w-64 bg-gray-100 dark:bg-gray-800 min-h-full">
      <nav className="mt-8 px-4">
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
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;