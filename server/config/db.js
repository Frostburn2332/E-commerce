const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/toystore';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Test the connection
    await mongoose.connection.db.admin().ping();
    console.log('Database ping successful');
    
  } catch (error) {
    console.error('MongoDB Connection Error:', {
      message: error.message,
      code: error.code,
      name: error.name
    });
    process.exit(1);
  }
};

module.exports = connectDB;
