const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const Rider = require('../models/Rider');

// สร้าง JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// ─── Register ───────────────────────────────────────────
// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, phone, address, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลให้ครบ',
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === 'rider') {
      // ตรวจว่า email ซ้ำไหม
      const existing = await Rider.findOne({ where: { email } });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'อีเมลนี้ถูกใช้งานแล้ว',
        });
      }

      const rider = await Rider.create({
        name, email,
        password: hashedPassword,
        phone,
      });

      const token = generateToken(rider.rider_id, 'rider');
      return res.status(201).json({
        success: true,
        message: 'สมัครสมาชิกสำเร็จ',
        token,
        user: { id: rider.rider_id, name: rider.name, email: rider.email, role: 'rider' },
      });

    } else {
      // default = customer
      const existing = await Customer.findOne({ where: { email } });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'อีเมลนี้ถูกใช้งานแล้ว',
        });
      }

      const customer = await Customer.create({
        name, email,
        password: hashedPassword,
        phone, address,
      });

      const token = generateToken(customer.customer_id, 'customer');
      return res.status(201).json({
        success: true,
        message: 'สมัครสมาชิกสำเร็จ',
        token,
        user: { id: customer.customer_id, name: customer.name, email: customer.email, role: 'customer' },
      });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
  }
};

// ─── Login ───────────────────────────────────────────────
// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกอีเมลและรหัสผ่าน',
      });
    }

    let user = null;
    let userRole = role || 'customer';

    if (userRole === 'rider') {
      user = await Rider.findOne({ where: { email } });
    } else {
      user = await Customer.findOne({ where: { email } });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
      });
    }

    const id = userRole === 'rider' ? user.rider_id : user.customer_id;
    const token = generateToken(id, userRole);

    res.status(200).json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      token,
      user: { id, name: user.name, email: user.email, role: userRole },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
  }
};

module.exports = { register, login };