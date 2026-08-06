const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  try {
    await mongoose.connect(uri);
    console.log('Conexión a MongoDB exitosa');
  } catch (err) {
    console.error('Error al conectar a MongoDB:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
