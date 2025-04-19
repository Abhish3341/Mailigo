import React, { useState, useEffect } from 'react';
import { Email } from '../../types';
import EmailItem from './EmailItem';
import axiosInstance from '../../utils/axiosConfig';

interface CommunicationHistoryProps {
  type: 'inbox' | 'sent';
}

const CommunicationHistory: React.FC<CommunicationHistoryProps> = ({ type }) => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/communications/${type}`);
        setEmails(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching emails:', err);
        setError('Failed to load emails. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [type]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          {type === 'inbox' ? 'Inbox' : 'Sent'}
        </h2>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {emails.length > 0 ? (
          emails.map((email) => (
            <EmailItem 
              key={email._id} 
              email={email} 
              isSent={type === 'sent'} 
            />
          ))
        ) : (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No emails found.
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunicationHistory;