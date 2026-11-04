import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-brand">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="" width="44" height="44" />
          <span>Freddy Bakes</span>
        </div>

        <nav className="site-nav" aria-label="Navegación principal">
          <NavLink to="/" end>
            Inicio
          </NavLink>
          <NavLink to="/login">Ingresar</NavLink>
        </nav>
      </div>
    </header>
  );
}