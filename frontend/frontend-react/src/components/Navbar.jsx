import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

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
          {isAuthenticated ? (
            <>
              <span className="site-actions__greeting">Hola, {user.name}</span>
              <button type="button" onClick={logout}>
                Salir
              </button>
            </>
          ) : (
            <NavLink to="/login">Ingresar</NavLink>
          )}
        </div>
      </div>
    </header>
  );
}
