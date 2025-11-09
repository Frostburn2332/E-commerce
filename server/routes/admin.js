const express = require('express');
const router = express.Router();
const { login, checkAdminRole } = require('../controllers/adminController');
const Order = require('../models/NewOrder');

// Admin login route
router.post('/login', login);

// Get all orders with pagination and filtering
router.get('/orders', checkAdminRole, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    // Build query
    const query = {};
    if (status) {
      query.status = status;
    }
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Execute query with pagination
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.product', 'name price image')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Get total count
    const total = await Order.countDocuments(query);

    res.json({
      orders,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalOrders: total
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// Get order details by ID
router.get('/orders/:id', checkAdminRole, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name price image');

    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      message: 'Error fetching order details',
      error: error.message
    });
  }
});

// Update order status
router.patch('/orders/:id/status', checkAdminRole, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    order.status = status;
    await order.save();

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      message: 'Error updating order status',
      error: error.message
    });
  }
});

// Get order statistics
router.get('/orders/stats/summary', checkAdminRole, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const processingOrders = await Order.countDocuments({ status: 'processing' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    
    // Get total revenue
    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Get today's orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today }
    });

    res.json({
      totalOrders,
      pendingOrders,
      processingOrders,
      deliveredOrders,
      totalRevenue,
      todayOrders
    });
  } catch (error) {
    console.error('Error fetching order statistics:', error);
    res.status(500).json({
      message: 'Error fetching order statistics',
      error: error.message
    });
  }
});

module.exports = router;
