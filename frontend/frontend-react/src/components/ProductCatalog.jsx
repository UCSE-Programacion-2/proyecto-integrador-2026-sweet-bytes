import { useMemo, useState } from 'react';
import ProductCard from './ProductCard';

const PREVIEW_LIMIT = 6;

function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

export default function ProductCatalog({ products }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [showAll, setShowAll] = useState(false);

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))].sort(),
    [products],
  );

  const filtered = useMemo(() => {
    const needle = normalize(query);
    return products.filter((product) => {
      const matchesCategory = !category || product.category === category;
      const matchesQuery =
        !needle || normalize(`${product.name} ${product.description}`).includes(needle);
      return matchesCategory && matchesQuery;
    });
  }, [products, query, category]);

  const isFiltering = Boolean(query || category);
  const visible = isFiltering || showAll ? filtered : filtered.slice(0, PREVIEW_LIMIT);

  return (
    <>
      <form className="catalog-filters" role="search" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="catalog-search" className="visually-hidden">
          Buscar productos
        </label>
        <input
          id="catalog-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar un producto…"
        />

        <label htmlFor="catalog-category" className="visually-hidden">
          Categoría
        </label>
        <select
          id="catalog-category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categories.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </form>

      {visible.length === 0 ? (
        <p role="status">No encontramos productos con esa búsqueda.</p>
      ) : (
        <div className="product-grid">
          {visible.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {!isFiltering && filtered.length > PREVIEW_LIMIT && (
        <p className="home-more">
          <button type="button" onClick={() => setShowAll((current) => !current)}>
            {showAll ? 'Ver menos' : 'Ver catálogo completo →'}
          </button>
        </p>
      )}
    </>
  );
}
