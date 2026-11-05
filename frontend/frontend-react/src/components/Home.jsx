import { useEffect, useState } from 'react';
import ProductCatalog from './ProductCatalog';
import { API_URL } from '../services/api';

const MARQUEE_ITEMS = [
  'Budín de Vainilla',
  'Cinnamon Rolls',
  'Budín Marmolado',
  'Carrot Cake',
  'Budín de Banana',
  'Dulce de Leche',
  'Budín de Limón',
  'Budín de Manzana',
];

function Marquee() {
  return (
    <div className="home-marquee" aria-hidden="true">
      <div className="home-marquee__track">
        {[0, 1].map((copy) => (
          <span key={copy}>
            {MARQUEE_ITEMS.map((name) => (
              <span key={name}>✦ {name}</span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        const response = await fetch(`${API_URL}/api/products`, {
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

      <Marquee />

      <section id="productos" className="home-section">
        <h2>Lo que hacemos</h2>
        <p>Preparados por encargo, con ingredientes frescos y recetas con alma.</p>

        {loading && <p role="status">Cargando productos…</p>}
        {error && <p role="alert">No pudimos cargar los productos.</p>}
        {!loading && !error && products.length === 0 && (
          <p>Por ahora no hay productos disponibles.</p>
        )}

        {products.length > 0 && <ProductCatalog products={products} />}
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
              Trabajamos con ingredientes frescos y de calidad, preparando todo
              por encargo para garantizar que llegue a tus manos recién salido
              del horno, en su punto justo.
            </p>
            <dl className="home-stats">
              <div>
                <dt>100%</dt>
                <dd>Artesanal</dd>
              </div>
              <div>
                <dt>6+</dt>
                <dd>Productos únicos</dd>
              </div>
              <div>
                <dt>♥</dt>
                <dd>Con amor</dd>
              </div>
            </dl>
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
        <p className="home-label">Hacé tu pedido</p>
        <h2>
          ¿Se te antojó <em>algo rico?</em>
        </h2>
        <p className="home-intro">
          Escribinos con anticipación y preparamos lo que quieras. Pedidos
          personalizados para eventos también disponibles.
        </p>
        <div className="home-actions home-social">
          <a href="https://wa.me/5493884087882" className="home-social__whatsapp">
            WhatsApp
          </a>
          <a href="https://www.instagram.com/freddy.rolls/" className="home-social__instagram">
            Instagram
          </a>
        </div>
      </section>
    </div>
  );
}