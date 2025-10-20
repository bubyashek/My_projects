// News page module
import '../styles/main.scss';
import { usersAPI, newsAPI, type News, type User } from './api.js';
import { formatDateTime, getFullName, showNotification, confirmAction } from './utils.js';

declare const bootstrap: any;

let currentUserId: number;
let allNews: (News & { author?: User })[] = [];
let currentFilter: 'all' | 'active' | 'blocked' = 'all';
let addNewsModal: any;
let allUsers: User[] = [];

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
    await loadNews();
    await loadAllUsers();
    
    addNewsModal = new bootstrap.Modal(document.getElementById('addNewsModal'));
    setupEventListeners();
    setupGlobalFunctions();
  } catch (error) {
    console.error('Initialization error:', error);
    showNotification('Ошибка инициализации страницы', 'error');
  }
};

// Load all users for dropdown
const loadAllUsers = async (): Promise<void> => {
  try {
    allUsers = await usersAPI.getAll();
    populateUserDropdown();
  } catch (error) {
    console.error('Error loading users:', error);
  }
};

// Populate user dropdown for adding news
const populateUserDropdown = (): void => {
  const select = document.getElementById('addNewsUser') as HTMLSelectElement;
  if (!select) return;
  
  // Keep the placeholder
  select.innerHTML = '<option value="" disabled selected>Выберите пользователя...</option>';
  
  // Add current user first
  const currentUser = allUsers.find(u => u.id === currentUserId);
  if (currentUser) {
    select.innerHTML += `<option value="${currentUser.id}" selected>${getFullName(currentUser)} (текущий)</option>`;
  }
  
  // Add other users
  allUsers
    .filter(u => u.id !== currentUserId)
    .forEach(user => {
      select.innerHTML += `<option value="${user.id}">${getFullName(user)}</option>`;
    });
};

// Load user info
const loadUser = async (): Promise<void> => {
  try {
    const user = await usersAPI.getById(currentUserId);
    const nameElement = document.getElementById('user-name');
    if (nameElement) {
      nameElement.textContent = `Новости друзей пользователя: ${getFullName(user)}`;
    }
  } catch (error) {
    console.error('Error loading user:', error);
  }
};

// Load friends news
const loadNews = async (): Promise<void> => {
  const container = document.getElementById('news-container');
  if (!container) return;
  
  try {
    const news = await newsAPI.getFriendsNews(currentUserId);
    const users = await usersAPI.getAll();
    
    // Attach author info to each news item
    allNews = news.map(item => ({
      ...item,
      author: users.find(u => u.id === item.userId),
    }));
    
    renderNews();
  } catch (error) {
    console.error('Error loading news:', error);
    container.innerHTML = '<div class="alert alert-danger">Ошибка загрузки новостей</div>';
  }
};


// Render news with current filter
const renderNews = (): void => {
  const container = document.getElementById('news-container');
  if (!container) return;
  
  const filteredNews = allNews
    .filter(item => {
      if (currentFilter === 'all') return true;
      return item.status === currentFilter;
    })
    .sort((a, b) => {
      // Sort by createdAt date, newest first
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  
  if (filteredNews.length === 0) {
    container.innerHTML = '<div class="alert alert-info">Новостей не найдено</div>';
    return;
  }
  
  container.innerHTML = filteredNews.map(item => `
    <div class="news-card" data-news-id="${item.id}" data-status="${item.status}">
      <div class="news-header">
        <div class="news-author">
          ${item.author ? `
            <img src="${item.author.photo}" alt="${getFullName(item.author)}" class="news-author-avatar">
            <div class="author-info">
              <div class="author-name">${getFullName(item.author)}</div>
              <div class="news-date">${formatDateTime(item.createdAt)}</div>
            </div>
          ` : '<div>Автор неизвестен</div>'}
        </div>
        <div class="news-status-controls">
          <span class="badge-status ${item.status}">${item.status === 'active' ? 'Активна' : 'Заблокирована'}</span>
        </div>
      </div>
      <h3 class="news-title">${item.title}</h3>
      ${item.image ? `<div class="news-image"><img src="${item.image}" alt="${item.title}"></div>` : ''}
      <p class="news-content">${item.content}</p>
      <div class="news-actions">
        <button class="btn btn-sm ${item.status === 'active' ? 'btn-warning' : 'btn-success'}" 
                onclick="toggleNewsStatus(${item.id}, '${item.status === 'active' ? 'blocked' : 'active'}')">
          <i class="fas fa-${item.status === 'active' ? 'ban' : 'check'}"></i>
          ${item.status === 'active' ? 'Заблокировать' : 'Активировать'}
        </button>
        <button class="btn btn-sm btn-danger" onclick="deleteNews(${item.id})">
          <i class="fas fa-trash-alt"></i>
          Удалить
        </button>
      </div>
    </div>
  `).join('');
};


// Toggle news status
const toggleNewsStatus = async (newsId: number, status: 'active' | 'blocked'): Promise<void> => {
  const action = status === 'blocked' ? 'заблокировать' : 'активировать';
  const confirmed = await confirmAction(`Вы уверены, что хотите ${action} эту новость?`);
  if (!confirmed) return;
  
  try {
    await newsAPI.updateStatus(newsId, status);
    showNotification(`Новость успешно ${status === 'blocked' ? 'заблокирована' : 'активирована'}`, 'success');
    await loadNews();
  } catch (error) {
    console.error('Error updating news status:', error);
    showNotification('Ошибка изменения статуса новости', 'error');
  }
};


// Filter news
const filterNews = (): void => {
  const select = document.getElementById('filterNewsStatus') as HTMLSelectElement;
  if (!select) return;
  
  currentFilter = select.value as 'all' | 'active' | 'blocked';
  renderNews();
};

// Setup event listeners
const setupEventListeners = (): void => {
  const addForm = document.getElementById('addNewsForm');
  if (addForm) {
    addForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await addNews();
    });
  }
};

// Add news
const addNews = async (): Promise<void> => {
  const userId = parseInt((document.getElementById('addNewsUser') as HTMLSelectElement).value);
  const title = (document.getElementById('addNewsTitle') as HTMLInputElement).value;
  const content = (document.getElementById('addNewsContent') as HTMLTextAreaElement).value;
  const image = (document.getElementById('addNewsImage') as HTMLInputElement).value;
  const status = (document.getElementById('addNewsStatus') as HTMLSelectElement).value as 'active' | 'blocked';
  
  try {
    const newsData: any = {
      userId,
      title,
      content,
      status,
      createdAt: new Date().toISOString()
    };
    
    // Add image only if provided
    if (image && image.trim() !== '') {
      newsData.image = image;
    }
    
    await newsAPI.create(newsData);
    
    showNotification('Новость успешно создана', 'success');
    addNewsModal.hide();
    
    // Reset form
    (document.getElementById('addNewsForm') as HTMLFormElement).reset();
    populateUserDropdown();
    
    await loadNews();
  } catch (error) {
    console.error('Error creating news:', error);
    showNotification('Ошибка создания новости', 'error');
  }
};

// Delete news
const deleteNews = async (newsId: number): Promise<void> => {
  const confirmed = await confirmAction('Вы уверены, что хотите удалить эту новость?');
  if (!confirmed) return;
  
  try {
    await newsAPI.delete(newsId);
    showNotification('Новость успешно удалена', 'success');
    await loadNews();
  } catch (error) {
    console.error('Error deleting news:', error);
    showNotification('Ошибка удаления новости', 'error');
  }
};

// Make functions available globally
const setupGlobalFunctions = (): void => {
  (window as any).toggleNewsStatus = toggleNewsStatus;
  (window as any).filterNews = filterNews;
  (window as any).deleteNews = deleteNews;
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

