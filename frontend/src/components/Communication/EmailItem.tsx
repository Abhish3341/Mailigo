import React, { useState } from 'react';
import { Email } from '../../types';
import { formatRelativeTime } from '../../utils/helpers';
import Modal from '../UI/Modal';
import axiosInstance from '../../utils/axiosConfig';

interface EmailItemProps {
  email: Email;
  isSent?: boolean;
  onReadStatusChange?: (emailId: string) => void;
}

const EmailItem: React.FC<EmailItemProps> = ({ email, isSent = false, onReadStatusChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRead, setIsRead] = useState(email.read);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleClick = async () => {
    if (!isSent && !isRead && !isUpdating) {
      try {
        setIsUpdating(true);
        const response = await axiosInstance.put(`/communications/${email._id}/read`);
        if (response.data) {
          setIsRead(true);
          onReadStatusChange?.(email._id);
        }
      } catch (error) {
        console.error('Error marking email as read:', error);
      } finally {
        setIsUpdating(false);
      }
    }
    setIsModalOpen(true);
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