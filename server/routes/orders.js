const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createOrder,
  getUserOrders,
  getOrder,
  updateOrderStatus
} = require('../controllers/orderController');

// Create new order
router.post('/', protect, createOrder);

// Get user's orders
router.get('/', protect, getUserOrders);

// Get single order
router.get('/:id', protect, getOrder);

// Update order status
router.patch('/:id/status', protect, updateOrderStatus);

module.exports = router;