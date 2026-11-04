import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const formatPrice = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

export default function Navbar() {
  const { items, removeItem, totalItems, totalPrice } = useCart();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="site-brand">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Freddy Bakes" width="44" height="44" />
          <span>Freddy Bakes</span>
        </Link>

        <nav className="site-nav" aria-label="Navegación principal">
          <NavLink to="/" end>
            Productos
          </NavLink>
          <a href="/#nosotros">Nosotros</a>
          <a href="/#contacto">Contacto</a>
        </nav>

        <div className="site-actions">
          <NavLink to="/login">Ingresar</NavLink>

          <details className="cart-menu">
            <summary>
              Mi Carrito
              {totalItems > 0 && (
                <span className="cart-menu__count" data-testid="cart-count">
                  {totalItems}
                </span>
              )}
            </summary>
            <div className="cart-menu__panel">
              {items.length === 0 ? (
                <p>Tu carrito está vacío.</p>
              ) : (
                <>
                  <ul>
                    {items.map((item) => (
                      <li key={item.id}>
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <button type="button" onClick={() => removeItem(item.id)}>
                          Quitar
                        </button>
                      </li>
                    ))}
                  </ul>
                  <p>
                    <strong>Total: {formatPrice.format(totalPrice)}</strong>
                  </p>
                </>
              )}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
