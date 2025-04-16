import React, { useState, useEffect } from 'react';
import { Email } from '../../types';
import EmailItem from './EmailItem';

interface CommunicationHistoryProps {
  type: 'inbox' | 'sent';
}

const CommunicationHistory: React.FC<CommunicationHistoryProps> = ({ type }) => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in a real app, this would fetch from the API
    const mockEmails: Email[] = [
      {
        id: '1',
        subject: 'Welcome to TensorGo Platform',
        body: 'Thank you for signing up to our platform. We are excited to have you on board!',
        from: 'support@tensorgo.com',
        to: ['testuser@example.com'],
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        read: true,
      },
      {
        id: '2',
        subject: 'Your account verification',
        body: 'Please verify your email address to activate all features of your account.',
        from: 'noreply@tensorgo.com',
        to: ['testuser@example.com'],
        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        read: false,
      },
      {
        id: '3',
        subject: 'New feature announcement',
        body: 'We are excited to announce our new AI-powered features for the platform.',
        from: 'marketing@tensorgo.com',
        to: ['testuser@example.com'],
        createdAt: new Date(Date.now() - 180000).toISOString(), // 3 minutes ago
        read: false,
      },
    ];

    const sentEmails: Email[] = [
      {
        id: '4',
        subject: 'Regarding project timeline',
        body: 'I wanted to discuss the project timeline and next steps...',
        from: 'testuser@example.com',
        to: ['manager@company.com'],
        createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        read: true,
      },
      {
        id: '5',
        subject: 'Question about the API documentation',
        body: 'I have a few questions about the API documentation...',
        from: 'testuser@example.com',
        to: ['support@tensorgo.com'],
        createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        read: true,
      },
    ];

    setTimeout(() => {
      setEmails(type === 'inbox' ? mockEmails : sentEmails);
      setLoading(false);
    }, 800);
  }, [type]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
            <EmailItem key={email.id} email={email} isSent={type === 'sent'} />
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