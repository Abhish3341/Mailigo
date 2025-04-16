export interface User {
    id: string;
    email: string;
    name: string;
    picture?: string;
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