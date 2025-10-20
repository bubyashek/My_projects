// API module for making HTTP requests
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  email: string;
  photo: string;
  role: 'admin' | 'user';
  status: 'active' | 'blocked' | 'unconfirmed';
}

export interface News {
  id: number;
  userId: number;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
  status: 'active' | 'blocked';
}


const API_BASE = '/api';

// Generic fetch wrapper with error handling
async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// Users API
export const usersAPI = {
  getAll: (): Promise<User[]> => fetchJSON(`${API_BASE}/users`),
  
  getById: (id: number): Promise<User> => fetchJSON(`${API_BASE}/users/${id}`),
  
  create: (data: Partial<User>): Promise<User> =>
    fetchJSON(`${API_BASE}/users`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: number, data: Partial<User>): Promise<User> =>
    fetchJSON(`${API_BASE}/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: number): Promise<{ message: string }> =>
    fetchJSON(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
    }),
  
  getFriends: (id: number): Promise<User[]> =>
    fetchJSON(`${API_BASE}/users/${id}/friends`),
  
};

// News API
export const newsAPI = {
  getAll: (): Promise<News[]> => fetchJSON(`${API_BASE}/news`),
  
  getFriendsNews: (userId: number): Promise<News[]> =>
    fetchJSON(`${API_BASE}/users/${userId}/friends-news`),
  
  create: (data: Partial<News>): Promise<News> =>
    fetchJSON(`${API_BASE}/news`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  updateStatus: (id: number, status: 'active' | 'blocked'): Promise<News> =>
    fetchJSON(`${API_BASE}/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
  
  delete: (id: number): Promise<{ message: string }> =>
    fetchJSON(`${API_BASE}/news/${id}`, {
      method: 'DELETE',
    }),
};


// Friends API
export const friendsAPI = {
  add: (userId: number, friendId: number): Promise<{ message: string }> =>
    fetchJSON(`${API_BASE}/users/${userId}/friends`, {
      method: 'POST',
      body: JSON.stringify({ friendId }),
    }),
  
  remove: (userId: number, friendId: number): Promise<{ message: string }> =>
    fetchJSON(`${API_BASE}/users/${userId}/friends/${friendId}`, {
      method: 'DELETE',
    }),
};

