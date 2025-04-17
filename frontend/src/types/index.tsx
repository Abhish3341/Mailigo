export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  picture?: string;
  isFirstLogin: boolean;
  profileUpdates: {
    count: number;
    lastUpdate?: string;
  };
}

export interface Email {
  _id: string;
  subject: string;
  content: string;
  sender: string;
  recipient: string;
  timestamp: string;
  read: boolean;
  type: 'sent' | 'received';
  emailType: 'onboarding' | 'marketing' | 'transactional' | 'engagement';
  metadata?: Record<string, string>;
}