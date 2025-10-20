// Utility functions using ES6+ features

// Format date to readable string
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Format datetime to readable string
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Get status label in Russian
export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    active: 'Активный',
    blocked: 'Заблокирован',
    unconfirmed: 'Не подтверждён',
  };
  return labels[status] || status;
};

// Get role label in Russian
export const getRoleLabel = (role: string): string => {
  const labels: Record<string, string> = {
    admin: 'Администратор',
    user: 'Пользователь',
  };
  return labels[role] || role;
};

// Show notification using Bootstrap toast or alert
export const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success'): void => {
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
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Get full name from user object
export const getFullName = (user: { firstName: string; lastName: string; middleName?: string }): string => {
  const parts = [user.lastName, user.firstName];
  if (user.middleName) parts.push(user.middleName);
  return parts.join(' ');
};

// Navigate to page
export const navigateTo = (path: string): void => {
  window.location.href = path;
};

// Get URL parameter
export const getUrlParameter = (name: string): string | null => {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
};

// Confirm action with modal
// Custom confirmation modal
let confirmModal: any;
let confirmResolve: ((value: boolean) => void) | null = null;

const initConfirmModal = (): void => {
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
  if (typeof (window as any).bootstrap !== 'undefined') {
    confirmModal = new (window as any).bootstrap.Modal(document.getElementById('confirmModal'));
  }
  
  // Setup event listeners
  document.getElementById('confirmModalCancel')?.addEventListener('click', () => {
    confirmModal?.hide();
    if (confirmResolve) {
      confirmResolve(false);
      confirmResolve = null;
    }
  });
  
  document.getElementById('confirmModalConfirm')?.addEventListener('click', () => {
    confirmModal?.hide();
    if (confirmResolve) {
      confirmResolve(true);
      confirmResolve = null;
    }
  });
  
  // Handle backdrop click
  document.getElementById('confirmModal')?.addEventListener('hidden.bs.modal', () => {
    if (confirmResolve) {
      confirmResolve(false);
      confirmResolve = null;
    }
  });
};

// Confirm action with custom modal
export const confirmAction = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    initConfirmModal();
    
    const messageElement = document.getElementById('confirmModalMessage');
    if (messageElement) {
      messageElement.textContent = message;
    }
    
    confirmResolve = resolve;
    confirmModal?.show();
  });
};

