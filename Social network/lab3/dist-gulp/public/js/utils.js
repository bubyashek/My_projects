// Utility functions using ES6+ features
// Format date to readable string
export const formatDate = dateString => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
// Format datetime to readable string
export const formatDateTime = dateString => {
  const date = new Date(dateString);
  return date.toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
// Get status label in Russian
export const getStatusLabel = status => {
  const labels = {
    active: 'Активный',
    blocked: 'Заблокирован',
    unconfirmed: 'Не подтверждён'
  };
  return labels[status] || status;
};
// Get role label in Russian
export const getRoleLabel = role => {
  const labels = {
    admin: 'Администратор',
    user: 'Пользователь'
  };
  return labels[role] || role;
};
// Show notification using Bootstrap toast or alert
export const showNotification = (message, type = 'success') => {
  const alertClass = type === 'error' ? 'danger' : type;
  const alert = document.createElement('div');
  alert.className = `alert alert-${alertClass} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
  alert.style.zIndex = '9999';
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  document.body.appendChild(alert);
  setTimeout(() => {
    alert.remove();
  }, 3000);
};
// Debounce function for performance
export const debounce = (func, wait) => {
  let timeout = null;
  return (...args) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
// Get full name from user object
export const getFullName = user => {
  const parts = [user.lastName, user.firstName];
  if (user.middleName) parts.push(user.middleName);
  return parts.join(' ');
};
// Navigate to page
export const navigateTo = path => {
  window.location.href = path;
};
// Get URL parameter
export const getUrlParameter = name => {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
};
// Confirm action with modal
// Custom confirmation modal
let confirmModal;
let confirmResolve = null;
const initConfirmModal = () => {
  var _a, _b, _c;
  if (confirmModal) return;
  // Create modal HTML
  const modalHTML = `
    <div class="modal fade" id="confirmModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content confirm-modal-content">
          <div class="modal-header confirm-modal-header">
            <h5 class="modal-title">
              <i class="fas fa-exclamation-triangle me-2"></i>
              Подтверждение действия
            </h5>
          </div>
          <div class="modal-body confirm-modal-body">
            <p id="confirmModalMessage"></p>
          </div>
          <div class="modal-footer confirm-modal-footer">
            <button type="button" class="btn btn-secondary" id="confirmModalCancel">
              <i class="fas fa-times me-2"></i>
              Отмена
            </button>
            <button type="button" class="btn btn-danger" id="confirmModalConfirm">
              <i class="fas fa-check me-2"></i>
              Подтвердить
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  // Add to body if not exists
  if (!document.getElementById('confirmModal')) {
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }
  // Initialize Bootstrap modal
  if (typeof window.bootstrap !== 'undefined') {
    confirmModal = new window.bootstrap.Modal(document.getElementById('confirmModal'));
  }
  // Setup event listeners
  (_a = document.getElementById('confirmModalCancel')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    confirmModal === null || confirmModal === void 0 ? void 0 : confirmModal.hide();
    if (confirmResolve) {
      confirmResolve(false);
      confirmResolve = null;
    }
  });
  (_b = document.getElementById('confirmModalConfirm')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
    confirmModal === null || confirmModal === void 0 ? void 0 : confirmModal.hide();
    if (confirmResolve) {
      confirmResolve(true);
      confirmResolve = null;
    }
  });
  // Handle backdrop click
  (_c = document.getElementById('confirmModal')) === null || _c === void 0 ? void 0 : _c.addEventListener('hidden.bs.modal', () => {
    if (confirmResolve) {
      confirmResolve(false);
      confirmResolve = null;
    }
  });
};
// Confirm action with custom modal
export const confirmAction = message => {
  return new Promise(resolve => {
    initConfirmModal();
    const messageElement = document.getElementById('confirmModalMessage');
    if (messageElement) {
      messageElement.textContent = message;
    }
    confirmResolve = resolve;
    confirmModal === null || confirmModal === void 0 ? void 0 : confirmModal.show();
  });
};