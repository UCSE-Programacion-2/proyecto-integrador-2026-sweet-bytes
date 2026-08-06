const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../middlewares/AppError');

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  return cart;
}

function buildCartResponse(cart) {
  const items = cart.items
    .filter((cartItem) => cartItem.product)
    .map((cartItem) => ({
      productId: cartItem.product._id,
      quantity: cartItem.quantity,
      price: cartItem.product.price,
      subtotal: cartItem.product.price * cartItem.quantity,
    }));

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  return { items, total };
}

async function requireExistingUser(userId) {
  if (!userId) {
    throw new AppError(401, 'UNAUTHORIZED', 'Falta identificar al usuario (header x-user-id)');
  }

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    throw new AppError(401, 'UNAUTHORIZED', 'Usuario inválido');
  }

  if (!user) {
    throw new AppError(401, 'UNAUTHORIZED', 'Usuario inválido');
  }
}

const getCart = asyncHandler(async (req, res) => {
  const userId = req.header('x-user-id');
  await requireExistingUser(userId);

  const cart = await getOrCreateCart(userId);
  await cart.populate('items.product');

  res.status(200).json(buildCartResponse(cart));
});

const addItem = asyncHandler(async (req, res) => {
  const userId = req.header('x-user-id');
  await requireExistingUser(userId);

  const { productId, quantity = 1 } = req.body;

  if (!productId || !Number.isInteger(quantity) || quantity < 1) {
    throw new AppError(400, 'BAD_REQUEST', 'productId es obligatorio y quantity debe ser un entero positivo');
  }

  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
    throw new AppError(400, 'BAD_REQUEST', 'El producto no existe');
  }

  if (!product) {
    throw new AppError(400, 'BAD_REQUEST', 'El producto no existe');
  }

  const cart = await getOrCreateCart(userId);
  const existingItem = cart.items.find((item) => item.product.toString() === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  await cart.populate('items.product');

  res.status(200).json(buildCartResponse(cart));
});

const removeItem = asyncHandler(async (req, res) => {
  const userId = req.header('x-user-id');

  if (!userId) {
    throw new AppError(400, 'BAD_REQUEST', 'Falta identificar al usuario (header x-user-id)');
  }

  const { productId } = req.params;
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new AppError(404, 'NOT_FOUND', 'Carrito no encontrado');
  }

  const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

  if (itemIndex === -1) {
    throw new AppError(404, 'NOT_FOUND', 'El ítem no está en el carrito');
  }

  cart.items.splice(itemIndex, 1);
  await cart.save();
  await cart.populate('items.product');

  res.status(200).json(buildCartResponse(cart));
});

module.exports = { getCart, addItem, removeItem };
