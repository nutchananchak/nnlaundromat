const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

// POST /api/orders → สร้างออเดอร์ (customer)
router.post('/', protect, authorize('customer'), createOrder);

// GET /api/orders/my → ออเดอร์ของตัวเอง (customer)
router.get('/my', protect, authorize('customer'), getMyOrders);

// GET /api/orders → ทุกออเดอร์ (admin/rider)
router.get('/', protect, authorize('admin', 'rider'), getAllOrders);

// GET /api/orders/:id → ออเดอร์เดี่ยว
router.get('/:id', protect, getOrderById);

// PATCH /api/orders/:id/status → อัปเดตสถานะ (rider/admin)
router.patch('/:id/status', protect, authorize('rider', 'admin'), updateOrderStatus);

module.exports = router;