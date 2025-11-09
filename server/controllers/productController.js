const Product = require('../models/Product');

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// Get single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
};

// Update product quantity
exports.updateQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (quantity < 0) {
      return res.status(400).json({ message: 'Quantity cannot be negative' });
    }

    product.quantity = quantity;
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating quantity' });
  }
};

// Process order and update quantities
exports.processOrder = async (req, res) => {
  try {
    const { items } = req.body;

    // Validate order items
    for (const item of items) {
      const product = await Product.findById(item.id);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.id} not found` });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.quantity}` 
        });
      }
    }

    // Update quantities
    const updatedProducts = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.id);
        product.quantity -= item.quantity;
        return product.save();
      })
    );

    res.json({ 
      message: 'Order processed successfully',
      updatedProducts 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing order' });
  }
};