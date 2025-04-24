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
  const [selectedDate, setSelectedDate] = useState<string>('all');

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get(`/communications/${type}`);
        setEmails(response.data);
      } catch (err: any) {
        console.error('Error fetching emails:', err);
        setError('Failed to load emails. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [type]);

  const filterEmailsByDate = (emails: Email[]) => {
    if (selectedDate === 'all') return emails;

    const now = new Date();
    const filterDate = new Date();

    switch (selectedDate) {
      case 'today':
        filterDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      default:
        return emails;
    }

    return emails.filter(email => new Date(email.timestamp) >= filterDate);
  };

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

  const filteredEmails = filterEmailsByDate(emails).sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            {type === 'inbox' ? 'Inbox' : 'Sent'}
          </h2>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
        </div>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {filteredEmails.length > 0 ? (
          filteredEmails.map((email) => (
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