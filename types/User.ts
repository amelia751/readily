export interface User {
    email: string;
    role: 'user' | 'admin';
    createdAt: Date;
    updatedAt: Date;
  }
  