// Lee el ID de producto desde el query param de la URL y renderiza
// su información real consultando /api/products/:id.
(function initProductDetail() {
  const { api } = window.SweetBytes;

  const priceFormatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  });

  function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }

  let quantity = 1;

  function renderProduct(product) {
    document.querySelector('[data-detail-image]').src = product.image || 'assets/img/logo.png';
    document.querySelector('[data-detail-image]').alt = product.name;
    document.querySelector('[data-detail-category]').textContent = product.category;
    document.querySelector('[data-detail-name]').textContent = product.name;
    document.querySelector('[data-detail-price]').textContent = priceFormatter.format(product.price);
    document.querySelector('[data-detail-description]').textContent =
      product.description || 'Producto artesanal preparado por encargo.';

    const addButton = document.querySelector('[data-add-to-cart]');
    if (addButton) {
      addButton.dataset.productId = product._id;
    }
  }

  function renderError(message) {
    const main = document.querySelector('main');
    if (main) {
      main.innerHTML = `<p class="text-center text-brown-md/60 py-20">${message}</p>`;
    }
  }

  function wireQuantityControls() {
    const quantityLabel = document.querySelector('[data-quantity]');
    const decreaseBtn = document.querySelector('[data-quantity-decrease]');
    const increaseBtn = document.querySelector('[data-quantity-increase]');

    if (!quantityLabel) return;

    function renderQuantity() {
      quantityLabel.textContent = quantity;
    }

    decreaseBtn?.addEventListener('click', () => {
      quantity = Math.max(1, quantity - 1);
      renderQuantity();
    });

    increaseBtn?.addEventListener('click', () => {
      quantity += 1;
      renderQuantity();
    });
  }

  function getQuantity() {
    return quantity;
  }

  document.addEventListener('DOMContentLoaded', async () => {
    wireQuantityControls();

    const id = getProductIdFromUrl();
    if (!id) {
      renderError('No se especificó ningún producto.');
      return;
    }

    try {
      const { item } = await api.getProduct(id);
      renderProduct(item);
    } catch (err) {
      renderError(err.message);
    }
  });

  window.SweetBytes.productDetail = { getQuantity };
})();
