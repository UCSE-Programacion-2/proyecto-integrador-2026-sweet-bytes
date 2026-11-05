import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const formatPrice = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

function newOrderCode() {
  return `FB-${Date.now().toString(36).toUpperCase()}`;
}

export default function Checkout() {
  const { user, isAuthenticated } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [order, setOrder] = useState(null);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  function handleSubmit(event) {
    event.preventDefault();
    setOrder({
      code: newOrderCode(),
      name,
      items,
      total: totalPrice,
    });
    clearCart();
  }

  if (order) {
    return (
      <section className="checkout">
        <h1>¡Gracias por tu compra, {order.name}!</h1>
        <p role="status">
          Pedido <strong>{order.code}</strong> confirmado. Esta compra es simulada: no se realizó
          ningún cobro.
        </p>
        <ul className="checkout__summary">
          {order.items.map((item) => (
            <li key={item.id}>
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatPrice.format(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <p>
          <strong>Total: {formatPrice.format(order.total)}</strong>
        </p>
        <Link to="/">Volver al inicio</Link>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="checkout">
        <h1>Finalizar compra</h1>
        <p>Tu carrito está vacío.</p>
        <Link to="/">Ver productos</Link>
      </section>
    );
  }

  return (
    <section className="checkout">
      <h1>Finalizar compra</h1>

      <ul className="checkout__summary">
        {items.map((item) => (
          <li key={item.id}>
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>{formatPrice.format(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>
      <p>
        <strong>Total: {formatPrice.format(totalPrice)}</strong>
      </p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="checkout-name">Nombre</label>
        <input
          id="checkout-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />

        <label htmlFor="checkout-phone">Teléfono</label>
        <input
          id="checkout-phone"
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          required
        />

        <label htmlFor="checkout-address">Dirección de entrega</label>
        <input
          id="checkout-address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          required
        />

        <button type="submit">Confirmar compra</button>
      </form>
      <p className="checkout__note">Compra simulada: no se realiza ningún cobro.</p>
    </section>
  );
}
