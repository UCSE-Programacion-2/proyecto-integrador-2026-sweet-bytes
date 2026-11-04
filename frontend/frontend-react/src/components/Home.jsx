import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        const response = await fetch(`${apiUrl}/api/products`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Falló la consulta de productos');
        }

        const { items } = await response.json();
        setProducts(items);
      } catch {
        if (!controller.signal.aborted) {
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => controller.abort();
  }, []);

    return (
    <div className="store-home">
      <section className="home-hero">
        <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Freddy Bakes" />
        <p className="home-label">Hecho con amor</p>
        <h1>
          De nuestro horno<br />
          <em>a tu mesa</em>
        </h1>
        <p className="home-intro">
          Repostería casera preparada por encargos con ingredientes de 1ra calidad
          y elaboración propia en el día, porque lo mejor siempre vale la pena.
        </p>
        <div className="home-actions">
          <a href="#productos">Ver el menú</a>
          <a href="#contacto">Contactanos</a>
        </div>
      </section>

      <section id="productos" className="home-section">
        <h2>Lo que hacemos</h2>
        <p>Preparados por encargo, con ingredientes frescos y recetas con alma.</p>

        {loading && <p role="status">Cargando productos…</p>}
        {error && <p role="alert">No pudimos cargar los productos.</p>}
        {!loading && !error && products.length === 0 && (
          <p>Por ahora no hay productos disponibles.</p>
        )}

        {products.length > 0 && (
          <div className="product-grid">
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section id="nosotros" className="home-section home-about">
        <div className="home-about__inner">
          <div>
            <p className="home-label">Quiénes somos</p>
            <h2>Una pasión que <em>se convirtió</em> en sabor</h2>
            <p>
              Freddy Bakes nació de las ganas de compartir lo que más nos gusta
              hacer: hornear con amor y creatividad. Cada receta está pensada
              para que cada bocado sea una experiencia especial.
            </p>
            <p>
              Trabajamos con ingredientes frescos y de calidad. Preparamos todo
              por encargo para que llegue a tus manos recién salido del horno.
            </p>
            <p className="home-label">100% artesanal · 6+ productos únicos · Con amor</p>
          </div>
          <div className="home-about__photos">
            {['06', '04', '07', '03'].map((number) => (
              <img
                key={number}
                src={`${import.meta.env.BASE_URL}assets/img/Producto${number}.jpeg`}
                alt=""
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" className="home-section home-contact">
        <p className="home-label">Freddy Bakes</p>
        <h2>Contactanos</h2>
        <p>Pastelería y repostería artesanal por encargo en San Salvador de Jujuy.</p>
      </section>
    </div>
  );
}