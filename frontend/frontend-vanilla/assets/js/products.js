// Renderiza el listado de productos (Home y Catálogo) a partir de la API,
// reemplazando las tarjetas hardcodeadas del Sprint 1.
(function initProducts() {
  const { api } = window.SweetBytes;

  const priceFormatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  });

  function formatPrice(value) {
    return priceFormatter.format(value);
  }

  function productCardHTML(product) {
    const image = product.image || 'assets/img/logo.png';
    const description = product.description || '';

    return `
      <article class="card bg-white rounded-[1.6rem] overflow-hidden border border-cream-dk shadow-sm">
        <div class="img-wrap h-56">
          <img src="${image}" alt="${product.name}" class="w-full h-full object-cover">
        </div>
        <div class="p-6">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-display text-[1.15rem] font-bold text-brown">${product.name}</h3>
            <span class="tag bg-amber-50 text-amber-700">${product.category}</span>
          </div>
          <p class="text-brown-md/55 text-[.82rem] leading-relaxed mb-5">${description}</p>
          <div class="pt-4 border-t border-cream-dk flex items-center justify-between">
            <span class="text-lg font-bold text-brown-md">${formatPrice(product.price)}</span>
            <a href="detalle.html?id=${product._id}" class="bg-brown/5 hover:bg-caramel hover:text-white text-caramel text-[.8rem] font-semibold px-4 py-2 rounded-full transition-all">Ver Detalle</a>
          </div>
        </div>
      </article>
    `;
  }

  function renderMessage(container, message) {
    container.innerHTML = `<p class="col-span-full text-center text-brown-md/50 text-sm py-10">${message}</p>`;
  }

  async function loadProductsInto(container) {
    const limit = Number(container.dataset.limit) || null;
    const category = container.dataset.category || '';

    renderMessage(container, 'Cargando productos...');

    try {
      const { items } = await api.getProducts(category);
      const products = limit ? items.slice(0, limit) : items;

      if (!products.length) {
        renderMessage(container, 'No hay productos disponibles en esta categoría.');
        return;
      }

      container.innerHTML = products.map(productCardHTML).join('');
    } catch (err) {
      renderMessage(container, err.message);
    }
  }

  function wireCategoryFilters(container) {
    const buttons = document.querySelectorAll('[data-category-filter]');
    if (!buttons.length) return;

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        buttons.forEach((btn) => btn.classList.remove('text-caramel', 'font-semibold'));
        button.classList.add('text-caramel', 'font-semibold');
        container.dataset.category = button.dataset.categoryFilter;
        loadProductsInto(container);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const grids = document.querySelectorAll('[data-products-grid]');
    grids.forEach((grid) => {
      loadProductsInto(grid);
      wireCategoryFilters(grid);
    });
  });
})();
