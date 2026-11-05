export const API_URL = import.meta.env.VITE_API_URL;

export async function loginRequest(email, password) {
  let response;
  try {
    response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error('No pudimos conectar con el servidor. Intentá de nuevo.');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.error?.message || 'No pudimos iniciar sesión. Intentá de nuevo.');
  }

  return data.user;
}

async function adminRequest(path, user, { method = 'GET', body } = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('No pudimos conectar con el servidor. Intentá de nuevo.');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.error?.message || 'Ocurrió un error inesperado.');
  }

  return data;
}

export async function fetchProducts() {
  const response = await fetch(`${API_URL}/api/products`);
  if (!response.ok) {
    throw new Error('No pudimos cargar los productos.');
  }
  const { items } = await response.json();
  return items;
}

export const createProduct = (user, payload) =>
  adminRequest('/api/products', user, { method: 'POST', body: payload });

export const updateProduct = (user, id, payload) =>
  adminRequest(`/api/products/${id}`, user, { method: 'PUT', body: payload });

export const deleteProduct = (user, id) =>
  adminRequest(`/api/products/${id}`, user, { method: 'DELETE' });
