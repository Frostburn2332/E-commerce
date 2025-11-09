const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// Admin login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Admin credentials validation
    if (email !== 'admin@toystore.com') {
      return res.status(401).json({
        message: 'Invalid admin credentials'
      });
    }

    // For demo purposes, using a fixed admin password
    // In production, you should use proper password hashing and env variables
    if (password !== 'admin123') {
      return res.status(401).json({
        message: 'Invalid admin credentials'
      });
    }

    // Generate admin token
    const token = jwt.sign(
      { 
        userId: 'admin',
        role: 'admin'
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Admin login successful',
      token
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      message: 'Admin login failed'
    });
  }
};

// Middleware to check admin role
exports.checkAdminRole = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'No authorization token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      if (decoded.role !== 'admin') {
        return res.status(403).json({
          message: 'Not authorized as admin'
        });
      }

      // Add admin info to request
      req.admin = decoded;
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          message: 'Admin token expired'
        });
      }
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
          message: 'Invalid admin token'
        });
      }
      throw err;
    }
  } catch (error) {
    console.error('Admin authentication error:', error);
    res.status(500).json({
      message: 'Admin authentication failed'
    });
  }
};
