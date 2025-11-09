const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/admin');

// Connect to database
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Admin Routes
app.use('/api/admin', adminRoutes);

const ADMIN_PORT = process.env.ADMIN_PORT || 5002;

app.listen(ADMIN_PORT, () => {
  console.log(`Admin server is running on port ${ADMIN_PORT}`);
});
