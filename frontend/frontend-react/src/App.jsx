import { Link, Route, Routes, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './pages/Login';
import './App.css';



function ProductDetail() {
  const { id } = useParams();

  return (
    <>
      <h1>Detalle del producto</h1>
      <p>Producto {id}</p>
      <Link to="/">Volver al inicio</Link>
    </>
  );
}

function NotFound() {
  return (
    <>
      <h1>Página no encontrada</h1>
      <Link to="/">Volver al inicio</Link>
    </>
  );
}

export default function App() {
  return (
    <div className="site-layout">
      <Navbar />
      <main className="site-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/productos/:id" element={<ProductDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}