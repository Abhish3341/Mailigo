import { apiClient } from './api';
import { Email } from '../types';

export const postmarkService = {
  getEmails: async (type: 'inbox' | 'sent'): Promise<Email[]> => {
    return apiClient.get(`/emails/${type}`);
  },
  
  sendEmail: async (data: {
    to: string[];
    subject: string;
    body: string;
  }) => {
    return apiClient.post('/emails/send', data);
  },
};
