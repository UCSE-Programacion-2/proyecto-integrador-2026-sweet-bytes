import { useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import AdminRoute from './components/AdminRoute';
import Admin from './pages/Admin';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import ProductDetail from './pages/ProductDetail';
import Register from './pages/Register';
import './App.css';



function NotFound() {
  return (
    <>
      <h1>Página no encontrada</h1>
      <Link to="/">Volver al inicio</Link>
    </>
  );
}

function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return undefined;
    }

    // Los productos cargan después y empujan el contenido: se reintenta unos instantes.
    const scrollToTarget = () =>
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'auto' });
    const timers = [0, 400, 1000].map((delay) => setTimeout(scrollToTarget, delay));

    return () => timers.forEach(clearTimeout);
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <div className="site-layout">
      <ScrollToHash />
      <Navbar />
      <main className="site-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
          <Route path="/productos/:id" element={<ProductDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}