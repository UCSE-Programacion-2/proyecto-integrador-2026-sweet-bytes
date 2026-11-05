import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createProduct, deleteProduct, fetchProducts, updateProduct } from '../services/api';

const CATEGORIES = ['Budines', 'Tortas', 'Individuales', 'Pastelería Fina'];
const EMPTY_FORM = { name: '', price: '', category: CATEGORIES[0], description: '', image: '' };

const formatPrice = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

export default function Admin() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [message, setMessage] = useState('');
  const [confirmingId, setConfirmingId] = useState(null);

  const loadProducts = useCallback(async () => {
    setLoadError('');
    try {
      setProducts(await fetchProducts());
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormError('');
  }

  function startEdit(product) {
    setEditingId(product._id);
    setMessage('');
    setFormError('');
    setForm({
      name: product.name,
      price: String(product.price),
      category: product.category,
      description: product.description || '',
      image: product.image || '',
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError('');
    setMessage('');
    setSubmitting(true);

    const payload = { ...form, price: Number(form.price) };

    try {
      if (editingId) {
        await updateProduct(user, editingId, payload);
        setMessage('Producto actualizado.');
      } else {
        await createProduct(user, payload);
        setMessage('Producto creado.');
      }
      resetForm();
      await loadProducts();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    setMessage('');
    setLoadError('');
    try {
      await deleteProduct(user, id);
      setConfirmingId(null);
      if (editingId === id) resetForm();
      setMessage('Producto eliminado.');
      await loadProducts();
    } catch (err) {
      setConfirmingId(null);
      setLoadError(err.message);
    }
  }

  let submitLabel = 'Crear producto';
  if (submitting) submitLabel = 'Guardando…';
  else if (editingId) submitLabel = 'Guardar cambios';

  return (
    <section className="admin-page">
      <h1>Panel de administración</h1>
      <p className="admin-page__intro">Gestioná los productos de Freddy Bakes.</p>

      {message && (
        <p role="status" className="admin-page__message">
          {message}
        </p>
      )}

      <div className="admin-page__grid">
        <form className="admin-form" onSubmit={handleSubmit}>
          <h2>{editingId ? 'Editar producto' : 'Nuevo producto'}</h2>

          <label htmlFor="admin-name">Nombre</label>
          <input
            id="admin-name"
            name="name"
            value={form.name}
            onChange={updateField}
            placeholder="Ej: Torta de Frutos Rojos"
            required
          />

          <label htmlFor="admin-price">Precio</label>
          <input
            id="admin-price"
            name="price"
            type="number"
            min="0"
            value={form.price}
            onChange={updateField}
            placeholder="Ej: 8500"
            required
          />

          <label htmlFor="admin-category">Categoría</label>
          <select id="admin-category" name="category" value={form.category} onChange={updateField}>
            {[...new Set([...CATEGORIES, form.category])].map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>

          <label htmlFor="admin-description">Descripción</label>
          <textarea
            id="admin-description"
            name="description"
            rows="3"
            value={form.description}
            onChange={updateField}
          />

          <label htmlFor="admin-image">Imagen (ruta)</label>
          <input
            id="admin-image"
            name="image"
            value={form.image}
            onChange={updateField}
            placeholder="assets/img/Producto01.jpeg"
          />

          {formError && <p role="alert">{formError}</p>}

          <div className="admin-form__actions">
            <button type="submit" disabled={submitting}>
              {submitLabel}
            </button>
            {editingId && (
              <button type="button" className="admin-secondary" onClick={resetForm}>
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="admin-list">
          <h2>Productos ({products.length})</h2>

          {loading && <p role="status">Cargando productos…</p>}
          {loadError && <p role="alert">{loadError}</p>}

          {!loading && !loadError && products.length === 0 && <p>Todavía no hay productos.</p>}

          {products.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{formatPrice.format(product.price)}</td>
                    <td className="admin-list__actions">
                      {confirmingId === product._id ? (
                        <>
                          <span>¿Eliminar?</span>
                          <button type="button" onClick={() => handleDelete(product._id)}>
                            Sí
                          </button>
                          <button
                            type="button"
                            className="admin-secondary"
                            onClick={() => setConfirmingId(null)}
                          >
                            No
                          </button>
                        </>
                      ) : (
                        <>
                          <button type="button" onClick={() => startEdit(product)}>
                            Editar
                          </button>
                          <button
                            type="button"
                            className="admin-secondary"
                            onClick={() => setConfirmingId(product._id)}
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}
