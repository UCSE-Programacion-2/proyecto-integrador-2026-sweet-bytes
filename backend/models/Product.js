const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    category: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    image: {
      type: String,
      trim: true,
      default: '',
    },
    attributes: {
      color: { type: String, trim: true },
      talle: { type: String, trim: true },
      stock: { type: Number, min: 0, default: 0 },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Product', productSchema);
