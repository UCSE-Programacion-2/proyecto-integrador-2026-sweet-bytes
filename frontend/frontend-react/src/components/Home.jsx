import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        const response = await fetch(`${apiUrl}/api/products`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Falló la consulta de productos');
        }

        const { items } = await response.json();
        setProducts(items);
      } catch {
        if (!controller.signal.aborted) {
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => controller.abort();
  }, []);

  return (
    <>
      <h1>Freddy Bakes</h1>
      <p>Pastelería y repostería artesanal</p>

      {loading && <p role="status">Cargando productos…</p>}
      {error && <p role="alert">No pudimos cargar los productos.</p>}
      {!loading && !error && products.length === 0 && (
        <p>Por ahora no hay productos disponibles.</p>
      )}

      {products.length > 0 && (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}