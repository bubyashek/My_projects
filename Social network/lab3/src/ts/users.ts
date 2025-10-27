// Users page module
import '../styles/main.scss';
import { usersAPI, type User } from './api.js';
import { 
  formatDate, 
  getStatusLabel, 
  getRoleLabel, 
  getFullName,
  showNotification,
  confirmAction,
} from './utils.js';

// Declare Bootstrap Modal type
declare const bootstrap: any;

let editModal: any;
let addModal: any;
let currentUsers: User[] = [];
let filteredUsers: User[] = [];

// Initialize page
const init = async (): Promise<void> => {
  try {
    await loadUsers();
    setupEventListeners();
    setupFilterListeners();
    editModal = new bootstrap.Modal(document.getElementById('editUserModal'));
    addModal = new bootstrap.Modal(document.getElementById('addUserModal'));
  } catch (error) {
    console.error('Initialization error:', error);
    showNotification('Ошибка инициализации страницы', 'error');
  }
};

// Load all users
const loadUsers = async (): Promise<void> => {
  const container = document.getElementById('users-container');
  if (!container) return;
  
  try {
    currentUsers = await usersAPI.getAll();
    filteredUsers = [...currentUsers];
    renderUsers(filteredUsers);
  } catch (error) {
    console.error('Error loading users:', error);
    container.innerHTML = '<div class="alert alert-danger">Ошибка загрузки пользователей</div>';
  }
};

// Sort users by priority: admin > user, then active > unconfirmed > blocked
const sortUsers = (users: User[]): User[] => {
  return [...users].sort((a, b) => {
    // Role priority (admin = 0, user = 1)
    const roleOrder = { admin: 0, user: 1 };
    const roleA = roleOrder[a.role as keyof typeof roleOrder] ?? 2;
    const roleB = roleOrder[b.role as keyof typeof roleOrder] ?? 2;
    
    if (roleA !== roleB) {
      return roleA - roleB;
    }
    
    // Status priority (active = 0, unconfirmed = 1, blocked = 2)
    const statusOrder = { active: 0, unconfirmed: 1, blocked: 2 };
    const statusA = statusOrder[a.status as keyof typeof statusOrder] ?? 3;
    const statusB = statusOrder[b.status as keyof typeof statusOrder] ?? 3;
    
    return statusA - statusB;
  });
};

// Render users list
const renderUsers = (users: User[]): void => {
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
const attachUserEventListeners = (): void => {
  // Edit buttons
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const userId = parseInt((e.target as HTMLElement).dataset.userId || '0');
      openEditModal(userId);
    });
  });
  
  // Delete buttons
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const userId = parseInt((e.target as HTMLElement).dataset.userId || '0');
      await deleteUser(userId);
    });
  });
};

// Open edit modal
const openEditModal = (userId: number): void => {
  const user = currentUsers.find(u => u.id === userId);
  if (!user) return;
  
  // Populate form
  (document.getElementById('editUserId') as HTMLInputElement).value = user.id.toString();
  (document.getElementById('editFirstName') as HTMLInputElement).value = user.firstName;
  (document.getElementById('editLastName') as HTMLInputElement).value = user.lastName;
  (document.getElementById('editMiddleName') as HTMLInputElement).value = user.middleName;
  (document.getElementById('editEmail') as HTMLInputElement).value = user.email;
  (document.getElementById('editDateOfBirth') as HTMLInputElement).value = user.dateOfBirth;
  (document.getElementById('editRole') as HTMLSelectElement).value = user.role;
  (document.getElementById('editStatus') as HTMLSelectElement).value = user.status;
  (document.getElementById('editPhoto') as HTMLInputElement).value = user.photo;
  
  editModal.show();
};

// Setup form event listeners
const setupEventListeners = (): void => {
  const editForm = document.getElementById('editUserForm');
  if (editForm) {
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await saveUser();
    });
  }
  
  const addForm = document.getElementById('addUserForm');
  if (addForm) {
    addForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await addUser();
    });
  }
};

// Add new user
const addUser = async (): Promise<void> => {
  const userData: Partial<User> = {
    firstName: (document.getElementById('addFirstName') as HTMLInputElement).value,
    lastName: (document.getElementById('addLastName') as HTMLInputElement).value,
    middleName: (document.getElementById('addMiddleName') as HTMLInputElement).value,
    email: (document.getElementById('addEmail') as HTMLInputElement).value,
    dateOfBirth: (document.getElementById('addDateOfBirth') as HTMLInputElement).value,
    role: (document.getElementById('addRole') as HTMLSelectElement).value as 'admin' | 'user',
    status: (document.getElementById('addStatus') as HTMLSelectElement).value as User['status'],
    photo: (document.getElementById('addPhoto') as HTMLInputElement).value,
  };
  
  try {
    await usersAPI.create(userData);
    showNotification('Пользователь успешно добавлен', 'success');
    addModal.hide();
    
    // Reset form
    (document.getElementById('addUserForm') as HTMLFormElement).reset();
    
    await loadUsers();
  } catch (error) {
    console.error('Error creating user:', error);
    showNotification('Ошибка добавления пользователя', 'error');
  }
};

// Save user changes
const saveUser = async (): Promise<void> => {
  const userId = parseInt((document.getElementById('editUserId') as HTMLInputElement).value);
  
  const updatedData: Partial<User> = {
    firstName: (document.getElementById('editFirstName') as HTMLInputElement).value,
    lastName: (document.getElementById('editLastName') as HTMLInputElement).value,
    middleName: (document.getElementById('editMiddleName') as HTMLInputElement).value,
    email: (document.getElementById('editEmail') as HTMLInputElement).value,
    dateOfBirth: (document.getElementById('editDateOfBirth') as HTMLInputElement).value,
    role: (document.getElementById('editRole') as HTMLSelectElement).value as 'admin' | 'user',
    status: (document.getElementById('editStatus') as HTMLSelectElement).value as User['status'],
    photo: (document.getElementById('editPhoto') as HTMLInputElement).value,
  };
  
  try {
    await usersAPI.update(userId, updatedData);
    showNotification('Пользователь успешно обновлён', 'success');
    editModal.hide();
    await loadUsers();
  } catch (error) {
    console.error('Error updating user:', error);
    showNotification('Ошибка обновления пользователя', 'error');
  }
};

// Delete user
const deleteUser = async (userId: number): Promise<void> => {
  const confirmed = await confirmAction('Вы уверены, что хотите удалить этого пользователя?');
  if (!confirmed) return;
  
  try {
    await usersAPI.delete(userId);
    showNotification('Пользователь успешно удалён', 'success');
    await loadUsers();
  } catch (error) {
    console.error('Error deleting user:', error);
    showNotification('Ошибка удаления пользователя', 'error');
  }
};

// Make functions available globally for inline onclick handlers
(window as any).viewFriends = (userId: number) => {
  // Check if we're in webpack build by looking at current path
  const isWebpack = window.location.pathname.includes('webpack');
  window.location.href = isWebpack ? `/webpack-friends/${userId}` : `/friends/${userId}`;
};

(window as any).viewNews = (userId: number) => {
  // Check if we're in webpack build by looking at current path
  const isWebpack = window.location.pathname.includes('webpack');
  window.location.href = isWebpack ? `/webpack-news/${userId}` : `/news/${userId}`;
};

// Filter functionality
const applyFilters = (): void => {
  const roleFilter = (document.getElementById('filterRole') as HTMLSelectElement)?.value || '';
  const statusFilter = (document.getElementById('filterStatus') as HTMLSelectElement)?.value || '';
  const searchFilter = (document.getElementById('filterSearch') as HTMLInputElement)?.value.toLowerCase() || '';
  
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

const clearFilters = (): void => {
  const roleFilter = document.getElementById('filterRole') as HTMLSelectElement;
  const statusFilter = document.getElementById('filterStatus') as HTMLSelectElement;
  const searchFilter = document.getElementById('filterSearch') as HTMLInputElement;
  
  if (roleFilter) roleFilter.value = '';
  if (statusFilter) statusFilter.value = '';
  if (searchFilter) searchFilter.value = '';
  
  filteredUsers = [...currentUsers];
  renderUsers(filteredUsers);
};

const setupFilterListeners = (): void => {
  // Make filter functions available globally
  (window as any).applyFilters = applyFilters;
  (window as any).clearFilters = clearFilters;
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

