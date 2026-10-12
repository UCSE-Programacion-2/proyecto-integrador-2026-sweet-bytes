// Cliente HTTP centralizado: baseURL, headers y helpers de fetch reutilizables
// por el resto de los módulos (products.js, auth.js, cart.js, admin.js).
(function initApi() {
  const API_BASE_URL = 'http://localhost:4000/api';

  function getCurrentUserId() {
    try {
      const raw = localStorage.getItem('sb_user');
      const user = raw ? JSON.parse(raw) : null;
      return user && user.id ? user.id : null;
    } catch (err) {
      return null;
    }
  }

  async function request(path, { method = 'GET', body, auth = false } = {}) {
    const headers = { 'Content-Type': 'application/json' };

    if (auth) {
      const userId = getCurrentUserId();
      if (userId) headers['x-user-id'] = userId;
    }

    let response;
    try {
      response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    } catch (err) {
      throw new Error('No se pudo conectar con el servidor. ¿Está corriendo el backend?');
    }

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
      const message = data && data.error && data.error.message ? data.error.message : 'Ocurrió un error inesperado';
      throw new Error(message);
    }

    return data;
  }

  const api = {
    getProducts(category) {
      const query = category ? `?category=${encodeURIComponent(category)}` : '';
      return request(`/products${query}`);
    },
    getProduct(id) {
      return request(`/products/${id}`);
    },
    createProduct(payload) {
      return request('/products', { method: 'POST', body: payload, auth: true });
    },
    updateProduct(id, payload) {
      return request(`/products/${id}`, { method: 'PUT', body: payload, auth: true });
    },
    deleteProduct(id) {
      return request(`/products/${id}`, { method: 'DELETE', auth: true });
    },
    register(payload) {
      return request('/auth/register', { method: 'POST', body: payload });
    },
    login(payload) {
      return request('/auth/login', { method: 'POST', body: payload });
    },
    getCart() {
      return request('/cart', { auth: true });
    },
    addCartItem(productId, quantity) {
      return request('/cart/items', { method: 'POST', body: { productId, quantity }, auth: true });
    },
    removeCartItem(productId) {
      return request(`/cart/items/${productId}`, { method: 'DELETE', auth: true });
    },
  };

  window.SweetBytes = window.SweetBytes || {};
  window.SweetBytes.api = api;
})();
