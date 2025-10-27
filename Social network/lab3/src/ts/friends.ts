// Friends page module
import '../styles/main.scss';
import { usersAPI, friendsAPI, type User } from './api.js';
import { getFullName, showNotification, confirmAction } from './utils.js';

declare const bootstrap: any;

let currentUserId: number;
let currentFriends: User[] = [];
let allUsers: User[] = [];
let addFriendModal: any;

// Initialize page
const init = async (): Promise<void> => {
  try {
    // Get user ID from URL
    const pathParts = window.location.pathname.split('/');
    currentUserId = parseInt(pathParts[pathParts.length - 1]);
    
    if (isNaN(currentUserId)) {
      showNotification('Неверный ID пользователя', 'error');
      return;
    }
    
    await loadUser();
    await loadFriends();
    await loadAllUsers();
    
    addFriendModal = new bootstrap.Modal(document.getElementById('addFriendModal'));
    setupGlobalFunctions();
  } catch (error) {
    console.error('Initialization error:', error);
    showNotification('Ошибка инициализации страницы', 'error');
  }
};

// Load user info
const loadUser = async (): Promise<void> => {
  try {
    const user = await usersAPI.getById(currentUserId);
    const nameElement = document.getElementById('user-name');
    if (nameElement) {
      nameElement.textContent = `Друзья пользователя: ${getFullName(user)}`;
    }
  } catch (error) {
    console.error('Error loading user:', error);
    showNotification('Ошибка загрузки информации о пользователе', 'error');
  }
};

// Load all users for search
const loadAllUsers = async (): Promise<void> => {
  try {
    allUsers = await usersAPI.getAll();
  } catch (error) {
    console.error('Error loading users:', error);
  }
};

// Load friends list
const loadFriends = async (): Promise<void> => {
  const container = document.getElementById('friends-container');
  if (!container) return;
  
  try {
    currentFriends = await usersAPI.getFriends(currentUserId);
    renderFriends(currentFriends);
  } catch (error) {
    console.error('Error loading friends:', error);
    container.innerHTML = '<div class="alert alert-danger">Ошибка загрузки списка друзей</div>';
  }
};

// Render friends list
const renderFriends = (friends: User[]): void => {
  const container = document.getElementById('friends-container');
  if (!container) return;
  
  if (friends.length === 0) {
    container.innerHTML = '<div class="alert alert-info">У этого пользователя пока нет друзей</div>';
    return;
  }
  
  container.innerHTML = friends.map(friend => `
    <div class="friend-card" data-status="${friend.status}">
      <img src="${friend.photo}" alt="${getFullName(friend)}" class="friend-avatar">
      <div class="friend-info">
        <div class="friend-name">${getFullName(friend)}</div>
        <div class="friend-email">
          <i class="fas fa-envelope"></i> ${friend.email}
        </div>
        <div class="friend-badges">
          <span class="badge-status ${friend.status}">${getStatusLabel(friend.status)}</span>
        </div>
      </div>
      <div class="friend-actions">
        <button class="btn btn-success btn-sm" onclick="viewNews(${friend.id})">
          <i class="fas fa-newspaper"></i> Новости
        </button>
        <button class="btn btn-danger btn-sm" onclick="removeFriend(${friend.id})">
          <i class="fas fa-user-times"></i> Удалить
        </button>
      </div>
    </div>
  `).join('');
};

// Get status label
const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    active: 'Активный',
    blocked: 'Заблокирован',
    unconfirmed: 'Не подтверждён',
  };
  return labels[status] || status;
};

// Search users for adding as friends
const searchUsers = (): void => {
  const searchInput = (document.getElementById('searchFriend') as HTMLInputElement);
  const query = searchInput?.value.toLowerCase() || '';
  const container = document.getElementById('available-users');
  
  if (!container) return;
  
  if (query.length < 2) {
    container.innerHTML = '<p class="text-muted">Введите минимум 2 символа для поиска...</p>';
    return;
  }
  
  // Filter users: exclude current user and already friends
  const friendIds = currentFriends.map(f => f.id);
  const availableUsers = allUsers.filter(user => {
    if (user.id === currentUserId) return false;
    if (friendIds.includes(user.id)) return false;
    
    const fullName = getFullName(user).toLowerCase();
    const email = user.email.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });
  
  if (availableUsers.length === 0) {
    container.innerHTML = '<p class="text-muted">Пользователи не найдены</p>';
    return;
  }
  
  container.innerHTML = availableUsers.map(user => `
    <div class="user-search-item">
      <img src="${user.photo}" alt="${getFullName(user)}" class="user-search-avatar">
      <div class="user-search-info">
        <div class="user-search-name">${getFullName(user)}</div>
        <div class="user-search-email">${user.email}</div>
      </div>
      <button class="btn btn-primary btn-sm" onclick="addFriend(${user.id})">
        <i class="fas fa-plus"></i> Добавить
      </button>
    </div>
  `).join('');
};

// Add friend
const addFriend = async (friendId: number): Promise<void> => {
  try {
    await friendsAPI.add(currentUserId, friendId);
    showNotification('Друг успешно добавлен', 'success');
    addFriendModal.hide();
    
    // Clear search
    (document.getElementById('searchFriend') as HTMLInputElement).value = '';
    (document.getElementById('available-users') as HTMLElement).innerHTML = '<p class="text-muted">Начните вводить для поиска пользователей...</p>';
    
    await loadFriends();
  } catch (error) {
    console.error('Error adding friend:', error);
    showNotification('Ошибка добавления друга', 'error');
  }
};

// Remove friend
const removeFriend = async (friendId: number): Promise<void> => {
  const confirmed = await confirmAction('Вы уверены, что хотите удалить этого друга?');
  if (!confirmed) return;
  
  try {
    await friendsAPI.remove(currentUserId, friendId);
    showNotification('Друг успешно удалён', 'success');
    await loadFriends();
  } catch (error) {
    console.error('Error removing friend:', error);
    showNotification('Ошибка удаления друга', 'error');
  }
};

// Setup global functions
const setupGlobalFunctions = (): void => {
  (window as any).searchUsers = searchUsers;
  (window as any).addFriend = addFriend;
  (window as any).removeFriend = removeFriend;
  (window as any).goBackToUsers = () => {
    const isWebpack = window.location.pathname.includes('webpack');
    window.location.href = isWebpack ? '/webpack-users' : '/users';
  };
  (window as any).viewFriends = (userId: number) => {
    const isWebpack = window.location.pathname.includes('webpack');
    window.location.href = isWebpack ? `/webpack-friends/${userId}` : `/friends/${userId}`;
  };
  (window as any).viewNews = (userId: number) => {
    const isWebpack = window.location.pathname.includes('webpack');
    window.location.href = isWebpack ? `/webpack-news/${userId}` : `/news/${userId}`;
  };
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

