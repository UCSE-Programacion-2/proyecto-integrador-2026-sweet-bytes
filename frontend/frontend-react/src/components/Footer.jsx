export default function Footer() {
  return (
    <footer className="site-footer">
      <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Freddy Bakes" width="56" height="56" />
      <strong>Freddy Bakes</strong>
      <p>Hecho con amor · Todo por encargo</p>
      <small>© 2025 Freddy Bakes. Todos los derechos reservados.</small>
    </footer>
  );
}
