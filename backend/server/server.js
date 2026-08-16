const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./config/db');

// import models ก่อน sync
require('./models/Customer');
require('./models/Rider');
require('./models/Order');
require('./models/OrderStatusHistory');

// เชื่อมต่อ DB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: '🧺 N&N Laundromat API is running!' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'ไม่พบ endpoint นี้' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});