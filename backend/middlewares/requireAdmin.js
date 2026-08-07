const User = require('../models/User');
const asyncHandler = require('./asyncHandler');
const AppError = require('./AppError');

const requireAdmin = asyncHandler(async (req, res, next) => {
  const userId = req.header('x-user-id');

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

  if (user.role !== 'admin') {
    throw new AppError(403, 'FORBIDDEN', 'Requiere rol admin');
  }

  req.user = user;
  next();
});

module.exports = requireAdmin;
