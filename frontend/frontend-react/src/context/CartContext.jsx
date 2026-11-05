import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'sb_cart';

const CartContext = createContext(null);

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadItems);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Sin almacenamiento disponible: el carrito sigue funcionando en memoria.
    }
  }, [items]);

  const value = useMemo(() => {
    const addItem = (product) => {
      setItems((current) => {
        const existing = current.find((item) => item.id === product._id);
        if (existing) {
          return current.map((item) =>
            item.id === product._id ? { ...item, quantity: item.quantity + 1 } : item,
          );
        }
        return [
          ...current,
          { id: product._id, name: product.name, price: product.price, quantity: 1 },
        ];
      });
    };

    const decrementItem = (id) => {
      setItems((current) =>
        current.flatMap((item) => {
          if (item.id !== id) return [item];
          return item.quantity > 1 ? [{ ...item, quantity: item.quantity - 1 }] : [];
        }),
      );
    };

    const removeItem = (id) => {
      setItems((current) => current.filter((item) => item.id !== id));
    };

    const clearCart = () => setItems([]);

    return {
      items,
      addItem,
      decrementItem,
      removeItem,
      clearCart,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
}
