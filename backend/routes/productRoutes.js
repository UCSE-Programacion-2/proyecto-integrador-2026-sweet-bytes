const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const requireAdmin = require('../middlewares/requireAdmin');

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', requireAdmin, createProduct);
router.put('/:id', requireAdmin, updateProduct);
router.delete('/:id', requireAdmin, deleteProduct);

module.exports = router;
