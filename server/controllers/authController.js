const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
const JWT_EXPIRE = '30d';

// Register user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'All fields are required'
      });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters'
      });
    }

    // Check email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Please provide a valid email'
      });
    }

    // Check if email is already registered
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        message: 'Email is already registered'
      });
    }

    // Create and save user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password
    });
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    // Send success response
    res.status(201).json({
      message: 'Registration successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Registration failed. Please try again.'
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    // Send success response
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Login failed. Please try again.'
    });
  }
};
