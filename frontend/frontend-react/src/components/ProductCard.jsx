import { Link } from 'react-router-dom';

const formatPrice = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
});

export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <h2>{product.name}</h2>
      <p>{formatPrice.format(product.price)}</p>
      <Link to={`/productos/${product._id}`}>Ver detalle</Link>
    </article>
  );
}