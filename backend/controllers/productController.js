const Product = require('../models/Product');
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../middlewares/AppError');

const getProducts = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const filter = category ? { category } : {};

  const items = await Product.find(filter);

  res.status(200).json({ items });
});

const getProductById = asyncHandler(async (req, res) => {
  let item;
  try {
    item = await Product.findById(req.params.id);
  } catch (err) {
    throw new AppError(404, 'NOT_FOUND', 'Producto no encontrado');
  }

  if (!item) {
    throw new AppError(404, 'NOT_FOUND', 'Producto no encontrado');
  }

  res.status(200).json({ item });
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, price, category } = req.body;

  if (!name || price === undefined || !category) {
    throw new AppError(400, 'BAD_REQUEST', 'name, price y category son obligatorios');
  }

  let item;
  try {
    item = await Product.create(req.body);
  } catch (err) {
    if (err.name === 'ValidationError') {
      throw new AppError(400, 'BAD_REQUEST', err.message);
    }
    throw err;
  }

  res.status(201).json({ item });
});

const updateProduct = asyncHandler(async (req, res) => {
  let item;
  try {
    item = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      throw new AppError(400, 'BAD_REQUEST', err.message);
    }
    throw new AppError(404, 'NOT_FOUND', 'Producto no encontrado');
  }

  if (!item) {
    throw new AppError(404, 'NOT_FOUND', 'Producto no encontrado');
  }

  res.status(200).json({ item });
});

const deleteProduct = asyncHandler(async (req, res) => {
  let item;
  try {
    item = await Product.findByIdAndDelete(req.params.id);
  } catch (err) {
    throw new AppError(404, 'NOT_FOUND', 'Producto no encontrado');
  }

  if (!item) {
    throw new AppError(404, 'NOT_FOUND', 'Producto no encontrado');
  }

  res.status(200).json({ item });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
