const Order = require('../models/Order');
const OrderStatusHistory = require('../models/OrderStatusHistory');

const STATUS_LABEL = {
  pending:         'รอไรเดอร์รับงาน',
  driver_accepted: 'ไรเดอร์กำลังเดินทางไปรับผ้า',
  picked_up:       'รับผ้าจากลูกค้าแล้ว',
  washing:         'กำลังซัก / อบผ้า',
  washing_done:    'ซักเสร็จแล้ว รอส่งคืน',
  delivering:      'กำลังส่งผ้าคืน',
  delivered:       'ส่งผ้าสำเร็จ',
  cancelled:       'ยกเลิกออเดอร์',
};

// auto generate order number
const generateOrderNumber = async () => {
  const count = await Order.count();
  return `LD-${String(count + 1).padStart(6, '0')}`;
};

// ─── สร้างออเดอร์ใหม่ ────────────────────────────────────
// POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { serviceType, address, note } = req.body;

    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกที่อยู่',
      });
    }

    const order_number = await generateOrderNumber();

    const order = await Order.create({
      order_number,
      customer_id: req.user.id,
      address,
      note: note || '',
      status: 'pending',
    });

    // บันทึก history
    await OrderStatusHistory.create({
      order_id: order.order_id,
      status: 'pending',
      note: 'สร้างออเดอร์ใหม่',
    });

    res.status(201).json({
      success: true,
      message: 'สร้างออเดอร์สำเร็จ',
      order: formatOrder(order, []),
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
  }
};

// ─── ดูออเดอร์ของตัวเอง ──────────────────────────────────
// GET /api/orders/my
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { customer_id: req.user.id },
      order: [['created_at', 'DESC']],
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders: orders.map(o => formatOrder(o, [])),
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
  }
};

// ─── ดูออเดอร์เดี่ยว ─────────────────────────────────────
// GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบออเดอร์นี้',
      });
    }

    // ตรวจสิทธิ์
    const isOwner  = order.customer_id === req.user.id;
    const isDriver = order.rider_id === req.user.id;
    const isAdmin  = req.user.role === 'admin';

    if (!isOwner && !isDriver && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'ไม่มีสิทธิ์ดูออเดอร์นี้',
      });
    }

    // ดึง history
    const history = await OrderStatusHistory.findAll({
      where: { order_id: order.order_id },
      order: [['updated_at', 'ASC']],
    });

    res.status(200).json({
      success: true,
      order: formatOrder(order, history),
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
  }
};

// ─── อัปเดตสถานะ ─────────────────────────────────────────
// PATCH /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const allowedStatuses = Object.keys(STATUS_LABEL);

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'สถานะไม่ถูกต้อง',
      });
    }

    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบออเดอร์',
      });
    }

    // ถ้า driver รับงาน ให้ผูก rider_id
    if (status === 'driver_accepted' && req.user.role === 'rider') {
      order.rider_id = req.user.id;
    }

    order.status = status;
    await order.save();

    // บันทึก history
    await OrderStatusHistory.create({
      order_id: order.order_id,
      status,
      note: note || '',
    });

    const history = await OrderStatusHistory.findAll({
      where: { order_id: order.order_id },
      order: [['updated_at', 'ASC']],
    });

    res.status(200).json({
      success: true,
      message: 'อัปเดตสถานะสำเร็จ',
      order: formatOrder(order, history),
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
  }
};

// ─── ดูทุกออเดอร์ (admin/rider) ──────────────────────────
// GET /api/orders
const getAllOrders = async (req, res) => {
  try {
    const { Op } = require('sequelize');
    let where = {};

    if (req.user.role === 'rider') {
      where = {
        [Op.or]: [
          { status: 'pending' },
          { rider_id: req.user.id },
        ],
      };
    }

    const orders = await Order.findAll({
      where,
      order: [['created_at', 'DESC']],
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders: orders.map(o => formatOrder(o, [])),
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
  }
};

// ─── Helper ───────────────────────────────────────────────
function formatOrder(order, history) {
  return {
    _id:          order.order_id,
    orderNumber:  order.order_number,
    address:      order.address,
    note:         order.note,
    price:        order.price,
    status:       order.status,
    statusLabel:  STATUS_LABEL[order.status] || order.status,
    statusHistory: history.map(h => ({
      status:    h.status,
      note:      h.note,
      updatedAt: h.updated_at,
    })),
    customer_id: order.customer_id,
    rider_id:    order.rider_id,
    createdAt:   order.created_at,
    updatedAt:   order.updated_at,
  };
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
};