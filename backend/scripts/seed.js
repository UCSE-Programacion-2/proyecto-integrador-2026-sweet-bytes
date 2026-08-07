require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');

const products = [
  {
    name: 'Budín de Vainilla',
    price: 2500,
    category: 'Budines',
    description: 'Budín casero de vainilla, suave y esponjoso.',
    image: 'assets/img/Producto01.jpeg',
    attributes: { stock: 30 },
  },
  {
    name: 'Budín de Limón',
    price: 2500,
    category: 'Budines',
    description: 'Budín de limón con un toque cítrico y glaseado.',
    image: 'assets/img/Producto02.jpeg',
    attributes: { stock: 30 },
  },
  {
    name: 'Budín de Carrot Cake',
    price: 2500,
    category: 'Budines',
    description: 'Budín de zanahoria con especias y frosting de queso crema.',
    image: 'assets/img/Producto03.jpeg',
    attributes: { stock: 25 },
  },
  {
    name: 'Cinnamon Rolls',
    price: 2500,
    category: 'Individuales',
    description: 'Rollos de canela clásicos con glaseado de vainilla.',
    image: 'assets/img/Producto04.jpeg',
    attributes: { stock: 40 },
  },
  {
    name: 'Alfajores de Maicena',
    price: 1800,
    category: 'Individuales',
    description: 'Alfajores de maicena rellenos de dulce de leche.',
    image: 'assets/img/Producto05.jpeg',
    attributes: { stock: 50 },
  },
  {
    name: 'Torta de Frutos Rojos',
    price: 50000,
    category: 'Tortas',
    description: 'Torta con crema chantilly y frutos rojos frescos.',
    image: 'assets/img/Producto06.jpeg',
    attributes: { stock: 10 },
  },
  {
    name: 'Lemon Pie',
    price: 40000,
    category: 'Pastelería Fina',
    description: 'Tarta de limón con merengue tostado.',
    image: 'assets/img/Producto07.jpeg',
    attributes: { stock: 12 },
  },
  {
    name: 'Torta de Chocolate',
    price: 45000,
    category: 'Tortas',
    description: 'Torta húmeda de chocolate con ganache.',
    image: 'assets/img/Producto06.jpeg',
    attributes: { stock: 10 },
  },
  {
    name: 'Medialunas de Manteca (docena)',
    price: 3200,
    category: 'Individuales',
    description: 'Docena de medialunas de manteca recién horneadas.',
    image: 'assets/img/Producto04.jpeg',
    attributes: { stock: 35 },
  },
  {
    name: 'Tarta de Manzana',
    price: 38000,
    category: 'Pastelería Fina',
    description: 'Tarta de manzana con canela y masa quebrada.',
    image: 'assets/img/Producto07.jpeg',
    attributes: { stock: 15 },
  },
];

async function seed() {
  await connectDB();

  await Product.deleteMany({});
  await Product.insertMany(products);

  console.log(`Se cargaron ${products.length} productos de prueba`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Error al cargar los datos de prueba:', err.message);
  process.exit(1);
});
