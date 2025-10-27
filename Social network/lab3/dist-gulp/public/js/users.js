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
// Users page module
// SCSS import removed for Gulp build
import { usersAPI } from './api.js';
import { formatDate, getStatusLabel, getRoleLabel, getFullName, showNotification, confirmAction } from './utils.js';
let editModal;
let addModal;
let currentUsers = [];
let filteredUsers = [];
// Initialize page
const init = () => __awaiter(void 0, void 0, void 0, function* () {
  try {
    yield loadUsers();
    setupEventListeners();
    setupFilterListeners();
    editModal = new bootstrap.Modal(document.getElementById('editUserModal'));
    addModal = new bootstrap.Modal(document.getElementById('addUserModal'));
  } catch (error) {
    console.error('Initialization error:', error);
    showNotification('Ошибка инициализации страницы', 'error');
  }
});
// Load all users
const loadUsers = () => __awaiter(void 0, void 0, void 0, function* () {
  const container = document.getElementById('users-container');
  if (!container) return;
  try {
    currentUsers = yield usersAPI.getAll();
    filteredUsers = [...currentUsers];
    renderUsers(filteredUsers);
  } catch (error) {
    console.error('Error loading users:', error);
    container.innerHTML = '<div class="alert alert-danger">Ошибка загрузки пользователей</div>';
  }
});
// Sort users by priority: admin > user, then active > unconfirmed > blocked
const sortUsers = users => {
  return [...users].sort((a, b) => {
    var _a, _b, _c, _d;
    // Role priority (admin = 0, user = 1)
    const roleOrder = {
      admin: 0,
      user: 1
    };
    const roleA = (_a = roleOrder[a.role]) !== null && _a !== void 0 ? _a : 2;
    const roleB = (_b = roleOrder[b.role]) !== null && _b !== void 0 ? _b : 2;
    if (roleA !== roleB) {
      return roleA - roleB;
    }
    // Status priority (active = 0, unconfirmed = 1, blocked = 2)
    const statusOrder = {
      active: 0,
      unconfirmed: 1,
      blocked: 2
    };
    const statusA = (_c = statusOrder[a.status]) !== null && _c !== void 0 ? _c : 3;
    const statusB = (_d = statusOrder[b.status]) !== null && _d !== void 0 ? _d : 3;
    return statusA - statusB;
  });
};
// Render users list
const renderUsers = users => {
  const container = document.getElementById('users-container');
  if (!container) return;
  if (users.length === 0) {
    container.innerHTML = '<div class="alert alert-info">Пользователей не найдено</div>';
    return;
  }
  // Sort users before rendering
  const sortedUsers = sortUsers(users);
  container.innerHTML = sortedUsers.map(user => `
    <div class="user-card" data-user-id="${user.id}" data-status="${user.status}">
      <img src="${user.photo}" alt="${getFullName(user)}" class="user-avatar">
      <div class="user-info">
        <div class="user-name">${getFullName(user)}</div>
        <div class="user-email">
          <i class="fas fa-envelope"></i> ${user.email}
        </div>
        <div class="user-birth">
          <i class="fas fa-birthday-cake"></i> Дата рождения: ${formatDate(user.dateOfBirth)}
        </div>
        <div class="user-badges">
          <span class="badge-role ${user.role}">${getRoleLabel(user.role)}</span>
          <span class="badge-status ${user.status}">${getStatusLabel(user.status)}</span>
        </div>
      </div>
      <div class="user-actions">
        <button class="btn btn-primary btn-edit" data-user-id="${user.id}">
          <i class="fas fa-edit"></i> Редактировать
        </button>
        <button class="btn btn-info" onclick="viewFriends(${user.id})">
          <i class="fas fa-user-friends"></i> Друзья
        </button>
        <button class="btn btn-success" onclick="viewNews(${user.id})">
          <i class="fas fa-newspaper"></i> Новости
        </button>
        <button class="btn btn-danger btn-delete" data-user-id="${user.id}">
          <i class="fas fa-trash-alt"></i> Удалить
        </button>
      </div>
    </div>
  `).join('');
  attachUserEventListeners();
};
// Attach event listeners to user cards
const attachUserEventListeners = () => {
  // Edit buttons
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', e => {
      const userId = parseInt(e.target.dataset.userId || '0');
      openEditModal(userId);
    });
  });
  // Delete buttons
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', e => __awaiter(void 0, void 0, void 0, function* () {
      const userId = parseInt(e.target.dataset.userId || '0');
      yield deleteUser(userId);
    }));
  });
};
// Open edit modal
const openEditModal = userId => {
  const user = currentUsers.find(u => u.id === userId);
  if (!user) return;
  // Populate form
  document.getElementById('editUserId').value = user.id.toString();
  document.getElementById('editFirstName').value = user.firstName;
  document.getElementById('editLastName').value = user.lastName;
  document.getElementById('editMiddleName').value = user.middleName;
  document.getElementById('editEmail').value = user.email;
  document.getElementById('editDateOfBirth').value = user.dateOfBirth;
  document.getElementById('editRole').value = user.role;
  document.getElementById('editStatus').value = user.status;
  document.getElementById('editPhoto').value = user.photo;
  editModal.show();
};
// Setup form event listeners
const setupEventListeners = () => {
  const editForm = document.getElementById('editUserForm');
  if (editForm) {
    editForm.addEventListener('submit', e => __awaiter(void 0, void 0, void 0, function* () {
      e.preventDefault();
      yield saveUser();
    }));
  }
  const addForm = document.getElementById('addUserForm');
  if (addForm) {
    addForm.addEventListener('submit', e => __awaiter(void 0, void 0, void 0, function* () {
      e.preventDefault();
      yield addUser();
    }));
  }
};
// Add new user
const addUser = () => __awaiter(void 0, void 0, void 0, function* () {
  const userData = {
    firstName: document.getElementById('addFirstName').value,
    lastName: document.getElementById('addLastName').value,
    middleName: document.getElementById('addMiddleName').value,
    email: document.getElementById('addEmail').value,
    dateOfBirth: document.getElementById('addDateOfBirth').value,
    role: document.getElementById('addRole').value,
    status: document.getElementById('addStatus').value,
    photo: document.getElementById('addPhoto').value
  };
  try {
    yield usersAPI.create(userData);
    showNotification('Пользователь успешно добавлен', 'success');
    addModal.hide();
    // Reset form
    document.getElementById('addUserForm').reset();
    yield loadUsers();
  } catch (error) {
    console.error('Error creating user:', error);
    showNotification('Ошибка добавления пользователя', 'error');
  }
});
// Save user changes
const saveUser = () => __awaiter(void 0, void 0, void 0, function* () {
  const userId = parseInt(document.getElementById('editUserId').value);
  const updatedData = {
    firstName: document.getElementById('editFirstName').value,
    lastName: document.getElementById('editLastName').value,
    middleName: document.getElementById('editMiddleName').value,
    email: document.getElementById('editEmail').value,
    dateOfBirth: document.getElementById('editDateOfBirth').value,
    role: document.getElementById('editRole').value,
    status: document.getElementById('editStatus').value,
    photo: document.getElementById('editPhoto').value
  };
  try {
    yield usersAPI.update(userId, updatedData);
    showNotification('Пользователь успешно обновлён', 'success');
    editModal.hide();
    yield loadUsers();
  } catch (error) {
    console.error('Error updating user:', error);
    showNotification('Ошибка обновления пользователя', 'error');
  }
});
// Delete user
const deleteUser = userId => __awaiter(void 0, void 0, void 0, function* () {
  const confirmed = yield confirmAction('Вы уверены, что хотите удалить этого пользователя?');
  if (!confirmed) return;
  try {
    yield usersAPI.delete(userId);
    showNotification('Пользователь успешно удалён', 'success');
    yield loadUsers();
  } catch (error) {
    console.error('Error deleting user:', error);
    showNotification('Ошибка удаления пользователя', 'error');
  }
});
// Make functions available globally for inline onclick handlers
window.viewFriends = userId => {
  // Check if we're in webpack build by looking at current path
  const isWebpack = window.location.pathname.includes('webpack');
  window.location.href = isWebpack ? `/webpack-friends/${userId}` : `/friends/${userId}`;
};
window.viewNews = userId => {
  // Check if we're in webpack build by looking at current path
  const isWebpack = window.location.pathname.includes('webpack');
  window.location.href = isWebpack ? `/webpack-news/${userId}` : `/news/${userId}`;
};
// Filter functionality
const applyFilters = () => {
  var _a, _b, _c;
  const roleFilter = ((_a = document.getElementById('filterRole')) === null || _a === void 0 ? void 0 : _a.value) || '';
  const statusFilter = ((_b = document.getElementById('filterStatus')) === null || _b === void 0 ? void 0 : _b.value) || '';
  const searchFilter = ((_c = document.getElementById('filterSearch')) === null || _c === void 0 ? void 0 : _c.value.toLowerCase()) || '';
  filteredUsers = currentUsers.filter(user => {
    // Role filter
    if (roleFilter && user.role !== roleFilter) return false;
    // Status filter
    if (statusFilter && user.status !== statusFilter) return false;
    // Search filter
    if (searchFilter) {
      const fullName = getFullName(user).toLowerCase();
      const email = user.email.toLowerCase();
      if (!fullName.includes(searchFilter) && !email.includes(searchFilter)) {
        return false;
      }
    }
    return true;
  });
  renderUsers(filteredUsers);
};
const clearFilters = () => {
  const roleFilter = document.getElementById('filterRole');
  const statusFilter = document.getElementById('filterStatus');
  const searchFilter = document.getElementById('filterSearch');
  if (roleFilter) roleFilter.value = '';
  if (statusFilter) statusFilter.value = '';
  if (searchFilter) searchFilter.value = '';
  filteredUsers = [...currentUsers];
  renderUsers(filteredUsers);
};
const setupFilterListeners = () => {
  // Make filter functions available globally
  window.applyFilters = applyFilters;
  window.clearFilters = clearFilters;
};
// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}