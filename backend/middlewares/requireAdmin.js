const User = require('../models/User');

async function requireAdmin(req, res, next) {
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

    if (user.role !== 'admin') {
      res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Requiere rol admin' } });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Usuario inválido' } });
  }
}

module.exports = requireAdmin;
