import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

export default function App() {
  return (
    <div className="site-layout">
      <Navbar />
      <main className="site-main">
        <h1>Freddy Bakes</h1>
        <p>Pastelería y repostería artesanal</p>
      </main>
      <Footer />
    </div>
  );
}