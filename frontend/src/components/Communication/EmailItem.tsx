import React from 'react';
import { Email } from '../../types';
import { formatDistanceToNow, format } from 'date-fns';

interface EmailItemProps {
  email: Email;
  isSent?: boolean;
}

const EmailItem: React.FC<EmailItemProps> = ({ email, isSent = false }) => {
  const timeAgo = formatDistanceToNow(new Date(email.createdAt), { addSuffix: true });

  return (
    <div className={`p-4 border-b dark:border-gray-700 ${!email.read && !isSent ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
      <div className="flex justify-between">
        <h3 className="font-medium text-gray-900 dark:text-white">
          {isSent ? `To: ${email.to.join(', ')}` : `From: ${email.from}`}
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">{timeAgo}</span>
      </div>
      <div className="mt-1">
        <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
          {email.subject}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 truncate">
          {email.body}
        </p>
      </div>
    </div>
  );
};

export default EmailItem;