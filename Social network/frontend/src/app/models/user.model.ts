export interface User {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
  photo: string;
  friends: number[];
  createdAt: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  dateOfBirth?: string;
}

export interface Post {
  id: number;
  userId: number;
  content: string;
  createdAt: string;
  image?: string;
  status?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  email: string;
}

