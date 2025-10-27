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
const API_BASE = '/api';
// Generic fetch wrapper with error handling
function fetchJSON(url, options) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const response = yield fetch(url, Object.assign(Object.assign({}, options), {
        headers: Object.assign({
          'Content-Type': 'application/json'
        }, options === null || options === void 0 ? void 0 : options.headers)
      }));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return yield response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  });
}
// Users API
export const usersAPI = {
  getAll: () => fetchJSON(`${API_BASE}/users`),
  getById: id => fetchJSON(`${API_BASE}/users/${id}`),
  create: data => fetchJSON(`${API_BASE}/users`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => fetchJSON(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: id => fetchJSON(`${API_BASE}/users/${id}`, {
    method: 'DELETE'
  }),
  getFriends: id => fetchJSON(`${API_BASE}/users/${id}/friends`)
};
// News API
export const newsAPI = {
  getAll: () => fetchJSON(`${API_BASE}/news`),
  getFriendsNews: userId => fetchJSON(`${API_BASE}/users/${userId}/friends-news`),
  create: data => fetchJSON(`${API_BASE}/news`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateStatus: (id, status) => fetchJSON(`${API_BASE}/news/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      status
    })
  }),
  delete: id => fetchJSON(`${API_BASE}/news/${id}`, {
    method: 'DELETE'
  })
};
// Friends API
export const friendsAPI = {
  add: (userId, friendId) => fetchJSON(`${API_BASE}/users/${userId}/friends`, {
    method: 'POST',
    body: JSON.stringify({
      friendId
    })
  }),
  remove: (userId, friendId) => fetchJSON(`${API_BASE}/users/${userId}/friends/${friendId}`, {
    method: 'DELETE'
  })
};