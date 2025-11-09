const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  updateQuantity,
  processOrder
} = require('../controllers/productController');

// Get all products
router.get('/', getProducts);

// Get single product
router.get('/:id', getProductById);

// Update product quantity
router.put('/:id/quantity', updateQuantity);

// Process order and update quantities
router.post('/order', processOrder);

module.exports = router;