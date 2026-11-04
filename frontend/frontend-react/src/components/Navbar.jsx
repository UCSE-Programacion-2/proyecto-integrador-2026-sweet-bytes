export default function Navbar() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-brand">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="" width="44" height="44" />
          <span>Freddy Bakes</span>
        </div>
        <span className="site-tagline">Pastelería artesanal</span>
      </div>
    </header>
  );
}