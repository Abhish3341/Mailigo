import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Welcome, {user?.firstname} {user?.lastname}
      </h1>
      <div className="text-gray-600 dark:text-gray-300">
        Start composing emails or check your inbox to get started.
      </div>
    </div>
  );
};

export default Dashboard;