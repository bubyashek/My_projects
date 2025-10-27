var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
// News page module
// SCSS import removed for Gulp build
import { usersAPI, newsAPI } from './api.js';
import { formatDateTime, getFullName, showNotification, confirmAction } from './utils.js';
let currentUserId;
let allNews = [];
let currentFilter = 'all';
let addNewsModal;
let allUsers = [];
// Initialize page
const init = () => __awaiter(void 0, void 0, void 0, function* () {
  try {
    // Get user ID from URL
    const pathParts = window.location.pathname.split('/');
    currentUserId = parseInt(pathParts[pathParts.length - 1]);
    if (isNaN(currentUserId)) {
      showNotification('Неверный ID пользователя', 'error');
      return;
    }
    yield loadUser();
    yield loadNews();
    yield loadAllUsers();
    addNewsModal = new bootstrap.Modal(document.getElementById('addNewsModal'));
    setupEventListeners();
    setupGlobalFunctions();
  } catch (error) {
    console.error('Initialization error:', error);
    showNotification('Ошибка инициализации страницы', 'error');
  }
});
// Load all users for dropdown
const loadAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
  try {
    allUsers = yield usersAPI.getAll();
    populateUserDropdown();
  } catch (error) {
    console.error('Error loading users:', error);
  }
});
// Populate user dropdown for adding news
const populateUserDropdown = () => {
  const select = document.getElementById('addNewsUser');
  if (!select) return;
  // Keep the placeholder
  select.innerHTML = '<option value="" disabled selected>Выберите пользователя...</option>';
  // Add current user first
  const currentUser = allUsers.find(u => u.id === currentUserId);
  if (currentUser) {
    select.innerHTML += `<option value="${currentUser.id}" selected>${getFullName(currentUser)} (текущий)</option>`;
  }
  // Add other users
  allUsers.filter(u => u.id !== currentUserId).forEach(user => {
    select.innerHTML += `<option value="${user.id}">${getFullName(user)}</option>`;
  });
};
// Load user info
const loadUser = () => __awaiter(void 0, void 0, void 0, function* () {
  try {
    const user = yield usersAPI.getById(currentUserId);
    const nameElement = document.getElementById('user-name');
    if (nameElement) {
      nameElement.textContent = `Новости друзей пользователя: ${getFullName(user)}`;
    }
  } catch (error) {
    console.error('Error loading user:', error);
  }
});
// Load friends news
const loadNews = () => __awaiter(void 0, void 0, void 0, function* () {
  const container = document.getElementById('news-container');
  if (!container) return;
  try {
    const news = yield newsAPI.getFriendsNews(currentUserId);
    const users = yield usersAPI.getAll();
    // Attach author info to each news item
    allNews = news.map(item => Object.assign(Object.assign({}, item), {
      author: users.find(u => u.id === item.userId)
    }));
    renderNews();
  } catch (error) {
    console.error('Error loading news:', error);
    container.innerHTML = '<div class="alert alert-danger">Ошибка загрузки новостей</div>';
  }
});
// Render news with current filter
const renderNews = () => {
  const container = document.getElementById('news-container');
  if (!container) return;
  const filteredNews = allNews.filter(item => {
    if (currentFilter === 'all') return true;
    return item.status === currentFilter;
  }).sort((a, b) => {
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
const toggleNewsStatus = (newsId, status) => __awaiter(void 0, void 0, void 0, function* () {
  const action = status === 'blocked' ? 'заблокировать' : 'активировать';
  const confirmed = yield confirmAction(`Вы уверены, что хотите ${action} эту новость?`);
  if (!confirmed) return;
  try {
    yield newsAPI.updateStatus(newsId, status);
    showNotification(`Новость успешно ${status === 'blocked' ? 'заблокирована' : 'активирована'}`, 'success');
    yield loadNews();
  } catch (error) {
    console.error('Error updating news status:', error);
    showNotification('Ошибка изменения статуса новости', 'error');
  }
});
// Filter news
const filterNews = () => {
  const select = document.getElementById('filterNewsStatus');
  if (!select) return;
  currentFilter = select.value;
  renderNews();
};
// Setup event listeners
const setupEventListeners = () => {
  const addForm = document.getElementById('addNewsForm');
  if (addForm) {
    addForm.addEventListener('submit', e => __awaiter(void 0, void 0, void 0, function* () {
      e.preventDefault();
      yield addNews();
    }));
  }
};
// Add news
const addNews = () => __awaiter(void 0, void 0, void 0, function* () {
  const userId = parseInt(document.getElementById('addNewsUser').value);
  const title = document.getElementById('addNewsTitle').value;
  const content = document.getElementById('addNewsContent').value;
  const image = document.getElementById('addNewsImage').value;
  const status = document.getElementById('addNewsStatus').value;
  try {
    const newsData = {
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
    yield newsAPI.create(newsData);
    showNotification('Новость успешно создана', 'success');
    addNewsModal.hide();
    // Reset form
    document.getElementById('addNewsForm').reset();
    populateUserDropdown();
    yield loadNews();
  } catch (error) {
    console.error('Error creating news:', error);
    showNotification('Ошибка создания новости', 'error');
  }
});
// Delete news
const deleteNews = newsId => __awaiter(void 0, void 0, void 0, function* () {
  const confirmed = yield confirmAction('Вы уверены, что хотите удалить эту новость?');
  if (!confirmed) return;
  try {
    yield newsAPI.delete(newsId);
    showNotification('Новость успешно удалена', 'success');
    yield loadNews();
  } catch (error) {
    console.error('Error deleting news:', error);
    showNotification('Ошибка удаления новости', 'error');
  }
});
// Make functions available globally
const setupGlobalFunctions = () => {
  window.toggleNewsStatus = toggleNewsStatus;
  window.filterNews = filterNews;
  window.deleteNews = deleteNews;
  window.goBackToUsers = () => {
    const isWebpack = window.location.pathname.includes('webpack');
    window.location.href = isWebpack ? '/webpack-users' : '/users';
  };
  window.viewFriends = userId => {
    const isWebpack = window.location.pathname.includes('webpack');
    window.location.href = isWebpack ? `/webpack-friends/${userId}` : `/friends/${userId}`;
  };
  window.viewNews = userId => {
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