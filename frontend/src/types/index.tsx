export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  picture?: string;
  isFirstLogin: boolean;
}

export interface Email {
  id: string;
  subject: string;
  body: string;
  from: string;
  to: string[];
  createdAt: string;
  read: boolean;
}