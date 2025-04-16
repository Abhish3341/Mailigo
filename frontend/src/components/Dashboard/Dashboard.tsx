import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Users, Settings, BarChart } from 'lucide-react';

const Dashboard: React.FC = () => {
  const cards = [
    {
      title: 'Communication',
      description: 'Manage all your email communications',
      icon: <Mail className="h-6 w-6" />,
      link: '/inbox',
      stats: '150+ emails',
    },
    {
      title: 'Analytics',
      description: 'View detailed communication analytics',
      icon: <BarChart className="h-6 w-6" />,
      link: '/analytics',
      stats: 'Real-time data',
    },
    {
      title: 'Contacts',
      description: 'Manage your contact list',
      icon: <Users className="h-6 w-6" />,
      link: '/contacts',
      stats: '50+ contacts',
    },
    {
      title: 'Settings',
      description: 'Configure your account settings',
      icon: <Settings className="h-6 w-6" />,
      link: '/settings',
      stats: 'Account & preferences',
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Dashboard
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                {card.icon}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {card.stats}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {card.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {card.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;