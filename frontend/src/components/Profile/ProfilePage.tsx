import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Password change logic would go here
    console.log('Password change requested');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center mb-8">
        {user?.picture && (
          <img
            src={user.picture}
            alt={user.name}
            className="h-20 w-20 rounded-full mr-4"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user?.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">{user?.email}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Profile Information */}
        <section className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Profile Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                value={user?.name}
                readOnly={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={user?.email}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;