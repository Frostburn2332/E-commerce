const mongoose = require('mongoose');
const Order = require('../models/NewOrder');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// Create new order
exports.createOrder = async (req, res) => {
  try {
    console.log('=== ORDER CREATION START ===');
    console.log('Request headers:', req.headers);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Auth token:', req.headers.authorization);
    console.log('User from middleware:', req.user);
    
    // Check if user exists in request
    if (!req.user) {
      console.error('No user found in request');
      return res.status(401).json({
        message: 'Authentication failed - no user found'
      });
    }
    
    // First verify the token
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'No authorization token provided'
      });
    }

    const token = req.headers.authorization.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log('Decoded token:', decoded);
    } catch (err) {
      console.error('Token verification failed:', err);
      return res.status(401).json({
        message: 'Invalid or expired token'
      });
    }

    const { items, deliveryDetails, totalAmount } = req.body;
    console.log('Decoded user ID:', decoded.userId);
    console.log('Items:', items);
    console.log('Delivery details:', deliveryDetails);

    // Log the MongoDB connection status
    console.log('MongoDB connection state:', mongoose.connection.readyState);

    if (!decoded.userId) {
      return res.status(401).json({
        message: 'User not authenticated properly'
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: 'No items provided in the order'
      });
    }

    if (!deliveryDetails) {
      return res.status(400).json({
        message: 'Delivery details are required'
      });
    }

    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(deliveryDetails.phone)) {
      return res.status(400).json({
        message: 'Please enter a valid 10-digit Indian mobile number starting with 6-9'
      });
    }

    // Validate inventory and update product quantities
    for (const item of items) {
      console.log('Processing item:', item);
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${item.product}`
        });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient inventory for product: ${product.name}`
        });
      }

      // Update product quantity
      product.quantity -= item.quantity;
      await product.save();
    }

    // Validate and convert item IDs to ObjectId
    const validatedItems = items.map(item => {
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        throw new Error(`Invalid product ID: ${item.product}`);
      }
      return {
        product: new mongoose.Types.ObjectId(item.product),
        quantity: parseInt(item.quantity),
        price: parseFloat(item.price)
      };
    });

    // Create the order
    const order = new Order({
      user: new mongoose.Types.ObjectId(decoded.userId),
      items: validatedItems,
      deliveryDetails: {
        fullName: deliveryDetails.fullName,
        email: deliveryDetails.email,
        phone: deliveryDetails.phone,
        address: {
          street: deliveryDetails.address.street,
          city: deliveryDetails.address.city,
          state: deliveryDetails.address.state,
          zipCode: deliveryDetails.address.zipCode,
          country: 'India'
        }
      },
      totalAmount: parseFloat(totalAmount),
      status: 'pending',
      paymentStatus: 'pending'
    });

    console.log('Saving order:', order);
    await order.save();

    res.status(201).json({
      message: 'Order created successfully',
      orderId: order._id
    });

  } catch (error) {
    console.error('=== ORDER CREATION ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Request data:', {
      items: req.body.items,
      deliveryDetails: req.body.deliveryDetails,
      token: req.headers.authorization
    });
    console.error('MongoDB state:', mongoose.connection.readyState);

    // Send appropriate error message based on error type
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Invalid order data',
        details: Object.values(error.errors).map(err => err.message)
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Authentication failed',
        details: 'Invalid token'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Authentication failed',
        details: 'Token expired'
      });
    }

    res.status(500).json({
      message: 'Error creating order',
      details: error.message
    });
  }
};

// Get user's orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      message: 'Failed to fetch orders'
    });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product');

    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    // Check if the order belongs to the requesting user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Not authorized to view this order'
      });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      message: 'Failed to fetch order'
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
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
    console.error('Update order status error:', error);
    res.status(500).json({
      message: 'Failed to update order status'
    });
  }
};