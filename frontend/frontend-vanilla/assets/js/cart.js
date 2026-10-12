// Carrito de compras: persistido en localStorage, con render dinámico
// en carrito.html y badge de cantidad en la navegación.
(function initCart() {
  const { api } = window.SweetBytes;
  const STORAGE_KEY = 'sb_cart';

  const priceFormatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  });

  function getItems() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  }

  function saveItems(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    updateBadge();
  }

  function addItem(productId, quantity = 1) {
    const items = getItems();
    const existing = items.find((item) => item.productId === productId);

    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({ productId, quantity });
    }

    saveItems(items);
  }

  function updateQuantity(productId, quantity) {
    let items = getItems();

    if (quantity <= 0) {
      items = items.filter((item) => item.productId !== productId);
    } else {
      const existing = items.find((item) => item.productId === productId);
      if (existing) existing.quantity = quantity;
    }

    saveItems(items);
  }

  function removeItem(productId) {
    const items = getItems().filter((item) => item.productId !== productId);
    saveItems(items);
  }

  function clear() {
    saveItems([]);
  }

  function getCount() {
    return getItems().reduce((sum, item) => sum + item.quantity, 0);
  }

  function updateBadge() {
    const count = getCount();
    document.querySelectorAll('[data-cart-count]').forEach((badge) => {
      badge.textContent = count;
      badge.classList.toggle('hidden', count === 0);
    });
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className =
      'fixed bottom-6 right-6 bg-brown text-cream text-sm font-medium px-5 py-3 rounded-full shadow-lg z-50';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  }

  function wireAddToCartButton() {
    const button = document.querySelector('[data-add-to-cart]');
    if (!button) return;

    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      if (!productId) return;

      const quantity = window.SweetBytes.productDetail?.getQuantity() || 1;
      addItem(productId, quantity);
      showToast('Se agregó al carrito');
    });
  }

  function cartRowHTML(item, product) {
    const subtotal = product.price * item.quantity;

    return `
      <div class="flex items-center gap-4 pb-4 border-b border-cream-dk" data-cart-row data-product-id="${item.productId}">
        <img src="${product.image || 'assets/img/logo.png'}" class="w-16 h-16 rounded-xl object-cover">
        <div class="flex-1">
          <h3 class="font-semibold text-[.95rem]">${product.name}</h3>
          <div class="flex items-center gap-2 mt-1">
            <button type="button" data-cart-decrease class="w-6 h-6 rounded-full border border-car-light text-brown-md hover:text-caramel">-</button>
            <span class="text-xs text-brown-md/60 w-6 text-center">${item.quantity}</span>
            <button type="button" data-cart-increase class="w-6 h-6 rounded-full border border-car-light text-brown-md hover:text-caramel">+</button>
            <button type="button" data-cart-remove class="text-[.7rem] text-brown-md/40 hover:text-red-500 ml-2">Eliminar</button>
          </div>
        </div>
        <p class="font-bold text-[.95rem] text-right">${priceFormatter.format(subtotal)}</p>
      </div>
    `;
  }

  async function renderCartPage() {
    const itemsContainer = document.querySelector('[data-cart-items]');
    const subtotalEl = document.querySelector('[data-cart-subtotal]');
    const totalEl = document.querySelector('[data-cart-total]');
    const checkoutLink = document.querySelector('[data-cart-checkout]');
    if (!itemsContainer) return;

    const items = getItems();

    if (!items.length) {
      itemsContainer.innerHTML = '<p class="text-center text-brown-md/50 text-sm py-10">Tu carrito está vacío.</p>';
      if (subtotalEl) subtotalEl.textContent = priceFormatter.format(0);
      if (totalEl) totalEl.textContent = priceFormatter.format(0);
      checkoutLink?.classList.add('pointer-events-none', 'opacity-50');
      return;
    }

    checkoutLink?.classList.remove('pointer-events-none', 'opacity-50');

    let products;
    try {
      products = await Promise.all(items.map((item) => api.getProduct(item.productId).then((res) => res.item)));
    } catch (err) {
      itemsContainer.innerHTML = `<p class="text-center text-red-500 text-sm py-10">${err.message}</p>`;
      return;
    }

    let total = 0;
    itemsContainer.innerHTML = items
      .map((item, index) => {
        const product = products[index];
        total += product.price * item.quantity;
        return cartRowHTML(item, product);
      })
      .join('');

    if (subtotalEl) subtotalEl.textContent = priceFormatter.format(total);
    if (totalEl) totalEl.textContent = priceFormatter.format(total);

    itemsContainer.querySelectorAll('[data-cart-row]').forEach((row) => {
      const productId = row.dataset.productId;
      const item = items.find((i) => i.productId === productId);

      row.querySelector('[data-cart-increase]').addEventListener('click', () => {
        updateQuantity(productId, item.quantity + 1);
        renderCartPage();
      });
      row.querySelector('[data-cart-decrease]').addEventListener('click', () => {
        updateQuantity(productId, item.quantity - 1);
        renderCartPage();
      });
      row.querySelector('[data-cart-remove]').addEventListener('click', () => {
        removeItem(productId);
        renderCartPage();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateBadge();
    wireAddToCartButton();
    renderCartPage();
  });

  window.SweetBytes.cart = {
    getItems,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    getCount,
  };
})();
