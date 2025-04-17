import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Welcome, {user?.name}
      </h1>
    </div>
  );
};

export default Dashboard;