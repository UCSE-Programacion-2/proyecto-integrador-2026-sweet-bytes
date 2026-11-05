import { useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const formatPrice = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { items, addItem, decrementItem, removeItem, totalItems, totalPrice } = useCart();
  const cartMenu = useRef(null);
  const location = useLocation();

  useEffect(() => {
    function closeOnOutsideClick(event) {
      if (cartMenu.current?.open && !cartMenu.current.contains(event.target)) {
        cartMenu.current.open = false;
      }
    }

    document.addEventListener('click', closeOnOutsideClick);
    return () => document.removeEventListener('click', closeOnOutsideClick);
  }, []);

  useEffect(() => {
    if (cartMenu.current) cartMenu.current.open = false;
  }, [location.pathname]);

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
          <Link to="/#nosotros">Nosotros</Link>
          <Link to="/#contacto">Contacto</Link>
        </nav>

        <div className="site-actions">
          {isAuthenticated ? (
            <>
              <span className="site-actions__greeting">Hola, {user.name}</span>
              {isAdmin && <NavLink to="/admin">Admin</NavLink>}
              <button type="button" onClick={logout}>
                Salir
              </button>
            </>
          ) : (
            <NavLink to="/login">Ingresar</NavLink>
          )}

          <details className="cart-menu" ref={cartMenu}>
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
                        <span className="cart-menu__name">{item.name}</span>
                        <span className="cart-menu__qty">
                          <button
                            type="button"
                            aria-label={`Quitar una unidad de ${item.name}`}
                            onClick={() => decrementItem(item.id)}
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            aria-label={`Agregar una unidad de ${item.name}`}
                            onClick={() => addItem({ _id: item.id, name: item.name, price: item.price })}
                          >
                            +
                          </button>
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
                  <Link to="/checkout" className="cart-menu__checkout">
                    Finalizar compra
                  </Link>
                </>
              )}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
