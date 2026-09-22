import pool from '../config/db.js';

// 1. เข้าสู่ระบบตาม Role (Customer, Rider, Admin)
export const login = async (req, res) => {
  try {
    const { identifier, password, role } = req.body;
    // identifier: Customer/Rider ใช้เบอร์โทร (phone_number), Admin ใช้ username

    if (!identifier || !password) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลเข้าสู่ระบบให้ครบถ้วน' });
    }

    if (role === 'admin') {
      const cleanIdentifier = String(identifier || '').trim();
      const cleanPassword = String(password || '').trim();

      const [admins] = await pool.query(
        'SELECT admin_id AS id, username, name, password FROM Admin WHERE username = ? OR admin_id = ?',
        [cleanIdentifier, cleanIdentifier]
      );

      if (admins.length === 0 || admins[0].password !== cleanPassword) {
        return res.status(401).json({ message: 'ชื่อผู้ใช้/อีเมล หรือรหัสผ่านแอดมินไม่ถูกต้อง' });
      }

      const admin = admins[0];
      return res.status(200).json({
        success: true,
        user: { 
          id: admin.id, 
          username: admin.username, 
          name: admin.name, 
          role: 'admin' 
        },
        token: `mock-token-admin-${admin.id}`
      });
    }

    if (role === 'rider') {
      const [riders] = await pool.query(
        'SELECT rider_id AS id, name, phone_number, password FROM Rider WHERE rider_id = ? OR phone_number = ?',
        [identifier.trim(), identifier.trim()]
      );

      if (riders.length === 0 || riders[0].password !== password) {
        return res.status(401).json({ message: 'เบอร์โทรศัพท์หรือรหัสผ่านไรเดอร์ไม่ถูกต้อง' });
      }

      const rider = riders[0];
      return res.status(200).json({
        success: true,
        user: { id: rider.id, name: rider.name, phone: rider.phone_number, role: 'rider' },
        token: `mock-token-rider-${rider.id}`
      });
    }

    // Default: Customer
    const [customers] = await pool.query(
      'SELECT customer_id AS id, name, phone_number, password, address FROM Customer WHERE phone_number = ?',
      [identifier]
    );

    if (customers.length === 0 || customers[0].password !== password) {
      return res.status(401).json({ message: 'เบอร์โทรศัพท์หรือรหัสผ่านไม่ถูกต้อง' });
    }

    const customer = customers[0];
    return res.status(200).json({
      success: true,
      user: {
        id: customer.id,
        name: customer.name,
        phone: customer.phone_number,
        address: customer.address,
        role: 'customer'
      },
      token: `mock-token-customer-${customer.id}`
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ', detail: error.message });
  }
};

// 2. สมัครสมาชิกลูกค้าใหม่ (Customer Register)
export const register = async (req, res) => {
  try {
    const { name, phone_number, password, address } = req.body;

    if (!name || !phone_number || !password) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' });
    }

    const [existing] = await pool.query(
      'SELECT customer_id FROM Customer WHERE phone_number = ?',
      [phone_number]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: 'เบอร์โทรศัพท์นี้ลงทะเบียนในระบบแล้ว' });
    }

    const [result] = await pool.query(
      'INSERT INTO Customer (name, phone_number, password, address) VALUES (?, ?, ?, ?)',
      [name, phone_number, password, address || '']
    );

    res.status(201).json({
      success: true,
      message: 'ลงทะเบียนสำเร็จ',
      user: { id: result.insertId, name, phone: phone_number, address: address || '', role: 'customer' },
      token: `mock-token-customer-${result.insertId}`
    });
  } catch (error) {
    console.error('Error during register:', error);
    res.status(500).json({ message: 'ลงทะเบียนไม่สำเร็จ', detail: error.message });
  }
};

// 3. รีเซ็ตรหัสผ่าน (Forgot Password)
export const forgotPassword = async (req, res) => {
  try {
    const { phone_number, new_password, role } = req.body;

    if (!phone_number || !new_password) {
      return res.status(400).json({ message: 'กรุณาระบุเบอร์โทรศัพท์และรหัสผ่านใหม่' });
    }

    const table = role === 'rider' ? 'Rider' : 'Customer';
    const [result] = await pool.query(
      `UPDATE ${table} SET password = ? WHERE phone_number = ?`,
      [new_password, phone_number]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'ไม่พบบัญชีผู้ใช้ที่ลงทะเบียนด้วยเบอร์นี้' });
    }

    res.status(200).json({ success: true, message: 'เปลี่ยนรหัสผ่านเรียบร้อยแล้ว' });
  } catch (error) {
    console.error('Error during forgotPassword:', error);
    res.status(500).json({ message: 'เปลี่ยนรหัสผ่านไม่สำเร็จ', detail: error.message });
  }
};

// 4. ดึงและอัปเดตข้อมูลโปรไฟล์ลูกค้า (Customer Profile)
export const getProfile = async (req, res) => {
  try {
    const { phone } = req.params;
    const [customers] = await pool.query(
      'SELECT customer_id AS id, name, phone_number AS phone, address FROM Customer WHERE phone_number = ?',
      [phone]
    );

    if (customers.length === 0) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลโปรไฟล์' });
    }

    res.status(200).json(customers[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'ดึงข้อมูลโปรไฟล์ไม่สำเร็จ' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { phone } = req.params;
    const { name, address } = req.body;

    await pool.query(
      'UPDATE Customer SET name = COALESCE(?, name), address = COALESCE(?, address) WHERE phone_number = ?',
      [name, address, phone]
    );

    res.status(200).json({ success: true, message: 'อัปเดตข้อมูลโปรไฟล์เรียบร้อย' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'อัปเดตข้อมูลโปรไฟล์ไม่สำเร็จ' });
  }
};