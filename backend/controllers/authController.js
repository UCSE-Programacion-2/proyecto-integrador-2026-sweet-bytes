const User = require('../models/User');

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        error: { code: 'BAD_REQUEST', message: 'name, email y password son obligatorios' },
      });
      return;
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'El email ya está registrado' } });
      return;
    }
    if (err.name === 'ValidationError') {
      res.status(400).json({ error: { code: 'BAD_REQUEST', message: err.message } });
      return;
    }
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Error al registrar el usuario' } });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        error: { code: 'BAD_REQUEST', message: 'email y password son obligatorios' },
      });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Credenciales inválidas' } });
      return;
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Credenciales inválidas' } });
      return;
    }

    res.status(200).json({
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Error al iniciar sesión' } });
  }
}

module.exports = { register, login };
