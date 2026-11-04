import { createContext, useContext, useMemo, useState } from 'react';

const STORAGE_KEY = 'sb_user';

const AuthContext = createContext(null);

function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      login: (nextUser) => {
        setUser(nextUser);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
        } catch {
          // La sesión sigue activa en memoria aunque no se pueda persistir.
        }
      },
      logout: () => {
        setUser(null);
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          // Nada que limpiar si el almacenamiento no está disponible.
        }
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
