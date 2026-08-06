const express = require('express');
const { getCart, addItem, removeItem } = require('../controllers/cartController');

const router = express.Router();

router.get('/', getCart);
router.post('/items', addItem);
router.delete('/items/:productId', removeItem);

module.exports = router;
