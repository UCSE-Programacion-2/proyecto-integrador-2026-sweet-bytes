const User = require('../models/User');
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../middlewares/AppError');

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new AppError(400, 'BAD_REQUEST', 'name, email y password son obligatorios');
  }

  let user;
  try {
    user = await User.create({ name, email, password });
  } catch (err) {
    if (err.code === 11000) {
      throw new AppError(400, 'BAD_REQUEST', 'El email ya está registrado');
    }
    if (err.name === 'ValidationError') {
      throw new AppError(400, 'BAD_REQUEST', err.message);
    }
    throw err;
  }

  res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError(400, 'BAD_REQUEST', 'email y password son obligatorios');
  }

  const user = await User.findOne({ email });
  const isMatch = user && (await user.comparePassword(password));

  if (!isMatch) {
    throw new AppError(401, 'UNAUTHORIZED', 'Credenciales inválidas');
  }

  res.status(200).json({
    user: { id: user._id, name: user.name, role: user.role },
  });
});

module.exports = { register, login };
