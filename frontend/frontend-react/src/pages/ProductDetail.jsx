import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { fetchProduct } from '../services/api';

const formatPrice = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    setProduct(null);

    fetchProduct(id)
      .then((item) => {
        if (!cancelled) setProduct(item);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  function handleAdd() {
    addItem(product);
    setAdded(true);
  }

  return (
    <section className="product-detail">
      <Link to="/" className="product-detail__back">
        ← Volver al catálogo
      </Link>

      {loading && <p role="status">Cargando producto…</p>}
      {error && <p role="alert">{error}</p>}

      {product && (
        <div className="product-detail__grid">
          <img
            src={`${import.meta.env.BASE_URL}${product.image || 'logo.png'}`}
            alt={product.name}
          />
          <div>
            <span className="product-card__category">{product.category}</span>
            <h1>{product.name}</h1>
            <p className="product-detail__price">{formatPrice.format(product.price)}</p>
            <p>{product.description}</p>
            <button type="button" className="product-card__add" onClick={handleAdd}>
              Agregar al carrito
            </button>
            {added && <p role="status">Se agregó al carrito.</p>}
          </div>
        </div>
      )}
    </section>
  );
}
