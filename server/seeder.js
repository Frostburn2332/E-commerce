const mongoose = require('mongoose');
const Product = require('./models/Product');
const products = require('./data/products');
const connectDB = require('./config/db');

connectDB();

const importData = async () => {
  try {
    // Clear existing products
    await Product.deleteMany();

    // Add quantity to each product
    const productsWithQuantity = products.map(product => ({
      ...product,
      quantity: 100 // Setting initial quantity to 100 for each product
    }));

    // Insert products
    await Product.insertMany(productsWithQuantity);

    console.log('Data Imported! Each product has 100 items in stock.');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}