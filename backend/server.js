import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testDatabaseConnection } from './src/config/db.js'; 
import orderRoutes from './src/routes/orderRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import paymentRoutes from './src/routes/paymentRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes)
app.use('/api/payments', paymentRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'N&N Laundromat Backend กำลังทำงานปกติ' });
});

// 2. ปรับตรง app.listen ให้เรียก testDatabaseConnection
app.listen(PORT, async () => {
  console.log(`🚀 เซิร์ฟเวอร์ทำงานที่พอร์ต http://localhost:${PORT}`);
  await testDatabaseConnection(); 
});