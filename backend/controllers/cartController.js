const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');

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

async function getCart(req, res) {
  try {
    const userId = req.header('x-user-id');

    if (!userId) {
      res.status(401).json({
        error: { code: 'UNAUTHORIZED', message: 'Falta identificar al usuario (header x-user-id)' },
      });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Usuario inválido' } });
      return;
    }

    const cart = await getOrCreateCart(userId);
    await cart.populate('items.product');

    res.status(200).json(buildCartResponse(cart));
  } catch (err) {
    res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Usuario inválido' } });
  }
}

async function addItem(req, res) {
  try {
    const userId = req.header('x-user-id');

    if (!userId) {
      res.status(401).json({
        error: { code: 'UNAUTHORIZED', message: 'Falta identificar al usuario (header x-user-id)' },
      });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Usuario inválido' } });
      return;
    }

    const { productId, quantity = 1 } = req.body;

    if (!productId || !Number.isInteger(quantity) || quantity < 1) {
      res.status(400).json({
        error: { code: 'BAD_REQUEST', message: 'productId es obligatorio y quantity debe ser un entero positivo' },
      });
      return;
    }

    const product = await Product.findById(productId);

    if (!product) {
      res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'El producto no existe' } });
      return;
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
  } catch (err) {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'No se pudo agregar el ítem al carrito' } });
  }
}

async function removeItem(req, res) {
  try {
    const userId = req.header('x-user-id');

    if (!userId) {
      res.status(400).json({
        error: { code: 'BAD_REQUEST', message: 'Falta identificar al usuario (header x-user-id)' },
      });
      return;
    }

    const { productId } = req.params;
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Carrito no encontrado' } });
      return;
    }

    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

    if (itemIndex === -1) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'El ítem no está en el carrito' } });
      return;
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();
    await cart.populate('items.product');

    res.status(200).json(buildCartResponse(cart));
  } catch (err) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'El ítem no está en el carrito' } });
  }
}

module.exports = { getCart, addItem, removeItem };
