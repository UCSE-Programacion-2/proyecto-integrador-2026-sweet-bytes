// Backoffice: conecta el CRUD visual del panel admin con los endpoints
// reales de productos (POST/PUT/DELETE), protegido por rol admin.
(function initAdmin() {
  const { api, auth } = window.SweetBytes;

  const priceFormatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  });

  let editingId = null;

  function requireAdminOrRedirect() {
    const user = auth.getCurrentUser();
    if (!user || user.role !== 'admin') {
      window.location.href = 'login.html';
      return null;
    }
    return user;
  }

  function productRowHTML(product) {
    return `
      <tr class="hover:bg-cream/50 transition-colors" data-product-row data-product-id="${product._id}">
        <td class="py-4 px-6 font-medium">${product.name}</td>
        <td class="py-4 px-6 text-brown-md/50 text-xs">${product.category}</td>
        <td class="py-4 px-6 font-mono font-semibold">${priceFormatter.format(product.price)}</td>
        <td class="py-4 px-6">
          <div class="flex items-center justify-center gap-3">
            <button type="button" data-edit-product class="text-xs font-semibold text-caramel hover:underline">Editar</button>
            <button type="button" data-delete-product class="text-xs font-semibold text-brown-md hover:underline">Eliminar</button>
          </div>
        </td>
      </tr>
    `;
  }

  async function loadProducts() {
    const tbody = document.querySelector('[data-products-table]');
    if (!tbody) return;

    try {
      const { items } = await api.getProducts();
      tbody.innerHTML = items.map(productRowHTML).join('');
      wireRowActions(items);
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="4" class="py-6 px-6 text-center text-red-500 text-sm">${err.message}</td></tr>`;
    }
  }

  function wireRowActions(items) {
    document.querySelectorAll('[data-product-row]').forEach((row) => {
      const productId = row.dataset.productId;
      const product = items.find((item) => item._id === productId);

      row.querySelector('[data-edit-product]').addEventListener('click', () => {
        fillFormForEdit(product);
      });

      row.querySelector('[data-delete-product]').addEventListener('click', () => {
        confirmAndDelete(product);
      });
    });
  }

  function getForm() {
    return document.querySelector('[data-product-form]');
  }

  function fillFormForEdit(product) {
    const form = getForm();
    if (!form) return;

    editingId = product._id;
    form.querySelector('[name="name"]').value = product.name;
    form.querySelector('[name="price"]').value = product.price;
    form.querySelector('[name="category"]').value = product.category;
    form.querySelector('[name="description"]').value = product.description || '';
    form.querySelector('[name="image"]').value = product.image || '';

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.textContent = 'Actualizar producto';

    document.getElementById('nuevo-producto')?.scrollIntoView({ behavior: 'smooth' });
  }

  function resetForm() {
    const form = getForm();
    if (!form) return;

    editingId = null;
    form.reset();
    form.querySelector('button[type="submit"]').textContent = 'Guardar Producto';
  }

  async function confirmAndDelete(product) {
    const result = await Swal.fire({
      title: `¿Eliminar "${product.name}"?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#C97D4E',
    });

    if (!result.isConfirmed) return;

    try {
      await api.deleteProduct(product._id);
      Swal.fire({ title: 'Eliminado', icon: 'success', timer: 1500, showConfirmButton: false });
      loadProducts();
    } catch (err) {
      Swal.fire({ title: 'Error', text: err.message, icon: 'error' });
    }
  }

  function wireForm() {
    const form = getForm();
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const payload = {
        name: form.querySelector('[name="name"]').value.trim(),
        price: Number(form.querySelector('[name="price"]').value),
        category: form.querySelector('[name="category"]').value,
        description: form.querySelector('[name="description"]').value.trim(),
        image: form.querySelector('[name="image"]').value.trim(),
      };

      try {
        if (editingId) {
          await api.updateProduct(editingId, payload);
          Swal.fire({ title: 'Producto actualizado', icon: 'success', timer: 1500, showConfirmButton: false });
        } else {
          await api.createProduct(payload);
          Swal.fire({ title: 'Producto creado', icon: 'success', timer: 1500, showConfirmButton: false });
        }

        resetForm();
        loadProducts();
      } catch (err) {
        Swal.fire({ title: 'Error', text: err.message, icon: 'error' });
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!requireAdminOrRedirect()) return;

    loadProducts();
    wireForm();
  });
})();
