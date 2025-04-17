import React, { useState } from 'react';
import { Email } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import Modal from '../UI/Modal';

interface EmailItemProps {
  email: Email;
  isSent?: boolean;
}

const EmailItem: React.FC<EmailItemProps> = ({ email, isSent = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const timeAgo = email.timestamp ? formatDistanceToNow(new Date(email.timestamp), { addSuffix: true }) : 'Unknown date';

  return (
    <>
      <div 
        className={`p-4 border-b dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
          !email.read && !isSent ? 'bg-blue-50 dark:bg-blue-900/20' : ''
        }`}
        onClick={() => setIsModalOpen(true)}
      >
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={email.subject}
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <div>
              <p><span className="font-medium">{isSent ? 'To:' : 'From:'}</span> {isSent ? email.recipient : email.sender}</p>
              <p><span className="font-medium">Date:</span> {new Date(email.timestamp).toLocaleString()}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs ${
                email.emailType === 'marketing' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300' :
                email.emailType === 'transactional' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                email.emailType === 'engagement' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
              }`}>
                {email.emailType}
              </span>
            </div>
          </div>
          
          <div className="prose dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
              {email.content}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EmailItem;