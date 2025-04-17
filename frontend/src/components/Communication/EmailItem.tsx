import React from 'react';
import { Email } from '../../types';
import { formatDistanceToNow } from 'date-fns';

interface EmailItemProps {
  email: Email;
  isSent?: boolean;
}

const EmailItem: React.FC<EmailItemProps> = ({ email, isSent = false }) => {
  const timeAgo = email.timestamp ? formatDistanceToNow(new Date(email.timestamp), { addSuffix: true }) : 'Unknown date';

  return (
    <div className={`p-4 border-b dark:border-gray-700 ${!email.read && !isSent ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
      <div className="flex justify-between">
        <h3 className="font-medium text-gray-900 dark:text-white">
          {isSent ? `To: ${email.recipient}` : `From: ${email.sender}`}
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">{timeAgo}</span>
      </div>
      <div className="mt-1">
        <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
          {email.subject}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 truncate">
          {email.content}
        </p>
      </div>
    </div>
  );
};

export default EmailItem;