import React, { useState } from 'react';
import { Email } from '../../types';
import { formatRelativeTime } from '../../utils/helpers';
import Modal from '../UI/Modal';
import axiosInstance from '../../utils/axiosConfig';

interface EmailItemProps {
  email: Email;
  isSent?: boolean;
}

const EmailItem: React.FC<EmailItemProps> = ({ email, isSent = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRead, setIsRead] = useState(email.read);

  const handleClick = async () => {
    if (!isSent && !isRead) {
      try {
        const response = await axiosInstance.put(`/communications/${email._id}/read`);
        if (response.data) {
          setIsRead(true);
        }
      } catch (error) {
        console.error('Error marking email as read:', error);
      }
    }
    setIsModalOpen(true);
  };

  const getEmailTypeBadgeStyles = (type: string) => {
    switch (type) {
      case 'marketing':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-900/10 dark:text-purple-400 ring-1 ring-purple-600/10 dark:ring-purple-400/20';
      case 'transactional':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-900/10 dark:text-blue-400 ring-1 ring-blue-600/10 dark:ring-blue-400/20';
      case 'engagement':
        return 'bg-green-50 text-green-700 dark:bg-green-900/10 dark:text-green-400 ring-1 ring-green-600/10 dark:ring-green-400/20';
      case 'onboarding':
        return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/10 dark:text-yellow-400 ring-1 ring-yellow-600/10 dark:ring-yellow-400/20';
      default:
        return 'bg-gray-50 text-gray-700 dark:bg-gray-900/10 dark:text-gray-400 ring-1 ring-gray-600/10 dark:ring-gray-400/20';
    }
  };

  return (
    <>
      <div 
        className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 ${
          !isRead && !isSent ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
        }`}
        onClick={handleClick}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <h3 className="font-medium text-gray-900 dark:text-white truncate">
                {isSent ? `To: ${email.recipient}` : `From: ${email.sender}`}
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {formatRelativeTime(email.timestamp)}
              </span>
            </div>
            <h4 className={`text-sm mt-1 ${!isRead && !isSent ? 'font-semibold' : 'font-medium'} text-gray-800 dark:text-gray-200`}>
              {email.subject}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {email.content}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getEmailTypeBadgeStyles(email.emailType)}`}>
              {email.emailType}
            </span>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={email.subject}
      >
        <div className="space-y-4">
          <div className="flex justify-between items-start text-sm text-gray-500 dark:text-gray-400">
            <div>
              <p><span className="font-medium">{isSent ? 'To:' : 'From:'}</span> {isSent ? email.recipient : email.sender}</p>
              <p><span className="font-medium">Date:</span> {new Date(email.timestamp).toLocaleString()}</p>
            </div>
            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getEmailTypeBadgeStyles(email.emailType)}`}>
              {email.emailType}
            </span>
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