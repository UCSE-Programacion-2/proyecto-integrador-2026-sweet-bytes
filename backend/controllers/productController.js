const Product = require('../models/Product');

async function getProducts(req, res) {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};

    const items = await Product.find(filter);

    res.status(200).json({ items });
  } catch (err) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Error al obtener los productos' } });
  }
}

async function getProductById(req, res) {
  try {
    const item = await Product.findById(req.params.id);

    if (!item) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Producto no encontrado' } });
      return;
    }

    res.status(200).json({ item });
  } catch (err) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Producto no encontrado' } });
  }
}

async function createProduct(req, res) {
  try {
    const { name, price, category } = req.body;

    if (!name || price === undefined || !category) {
      res.status(400).json({
        error: { code: 'BAD_REQUEST', message: 'name, price y category son obligatorios' },
      });
      return;
    }

    const item = await Product.create(req.body);

    res.status(201).json({ item });
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).json({ error: { code: 'BAD_REQUEST', message: err.message } });
      return;
    }
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Error al crear el producto' } });
  }
}

async function updateProduct(req, res) {
  try {
    const item = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Producto no encontrado' } });
      return;
    }

    res.status(200).json({ item });
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).json({ error: { code: 'BAD_REQUEST', message: err.message } });
      return;
    }
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Producto no encontrado' } });
  }
}

async function deleteProduct(req, res) {
  try {
    const item = await Product.findByIdAndDelete(req.params.id);

    if (!item) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Producto no encontrado' } });
      return;
    }

    res.status(200).json({ item });
  } catch (err) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Producto no encontrado' } });
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
