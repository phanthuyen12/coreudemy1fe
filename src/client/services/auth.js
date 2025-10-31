const API_BASE_URL = 'http://localhost:3000';

async function request(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.message || data?.error || 'Yêu cầu không thành công';
    throw new Error(message);
  }
  return data;
}

export async function loginApi(credentials) {
  return request('/auth/login', credentials);
}

export async function registerApi(payload) {
  return request('/auth/register', payload);
}

export const authStorage = {
  getToken: () => localStorage.getItem('auth_token'),
  setToken: (token) => localStorage.setItem('auth_token', token),
  clear: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('userProfile'); // Xóa luôn cache thông tin user khi logout
  },
};













