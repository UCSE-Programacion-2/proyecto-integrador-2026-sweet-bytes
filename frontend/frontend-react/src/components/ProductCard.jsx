import { Link } from 'react-router-dom';

const formatPrice = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

export default function ProductCard({ product }) {
  const image = product.image || 'logo.png';

  return (
    <article className="product-card">
      <img
        className="product-card__image"
        src={`${import.meta.env.BASE_URL}${image}`}
        alt={product.name}
        loading="lazy"
      />

      <div className="product-card__body">
        <div className="product-card__heading">
          <h2>{product.name}</h2>
          <span className="product-card__category">{product.category}</span>
        </div>

        <p className="product-card__description">{product.description}</p>

        <div className="product-card__actions">
          <strong>{formatPrice.format(product.price)}</strong>
          <Link to={`/productos/${product._id}`}>Ver detalle</Link>
        </div>
      </div>
    </article>
  );
}