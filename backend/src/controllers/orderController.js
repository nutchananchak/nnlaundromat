import pool from '../config/db.js';

// 1. ดึงรายการออเดอร์ทั้งหมด
export const getOrders = async (req, res) => {
  try {
    const { userId } = req.query;

    let sql = `
      SELECT 
        o.order_id AS id,
        o.package_name AS packageName,
        o.status,
        o.status_step AS statusStep,
        o.status_title AS statusTitle,
        o.pickup_time AS pickupTime,
        o.delivery_time AS deliveryTime,
        o.special_instruction AS note,
        o.address,
        o.lat,
        o.lng,
        o.plastic_bag_count AS plasticBagCount,
        o.cancel_reason AS cancelReason,
        o.cancelled_at AS cancelledAt,
        o.delivered_at AS deliveredAt,
        o.created_at AS createdAt,
        c.name AS customerName,
        c.phone_number AS customerPhone,
        s.service_name AS serviceName,
        s.base_price AS basePrice,
        p.amount AS totalPrice,
        p.slip_image AS slipImage,
        p.status AS paymentStatus,
        p.reject_reason AS rejectReason,
        r.rider_id AS riderId,
        r.name AS riderName,
        r.phone_number AS riderPhone
      FROM \`Order\` o
      LEFT JOIN Customer c ON o.customer_id = c.customer_id
      LEFT JOIN Service_Type s ON o.service_id = s.service_id
      LEFT JOIN Payment p ON o.order_id = p.order_id
      LEFT JOIN Rider r ON o.rider_id = r.rider_id
    `;

    const params = [];
    if (userId) {
      sql += ` WHERE c.phone_number = ? `;
      params.push(userId);
    }
    sql += ` ORDER BY o.created_at DESC `;

    const [rows] = await pool.query(sql, params);

    const formattedOrders = await Promise.all(rows.map(async (row) => {
      const [photos] = await pool.query(
        'SELECT photo_type, photo_url FROM Evidence_Photo WHERE order_id = ?',
        [row.id]
      );

      let proofImage = null;
      let riderBasketImage = null;
      photos.forEach(p => {
        if (p.photo_type === 'delivery_proof') proofImage = p.photo_url;
        if (p.photo_type === 'rider_basket') riderBasketImage = p.photo_url;
      });

      return {
        id: row.id,
        customerName: row.customerName || 'คุณลูกค้า',
        customerPhone: row.customerPhone || '-',
        address: row.address,
        lat: row.lat ? Number(row.lat) : null,
        lng: row.lng ? Number(row.lng) : null,
        serviceName: row.serviceName,
        packageName: row.packageName,
        status: row.status,
        statusStep: Number(row.statusStep),
        statusTitle: row.statusTitle,
        totalPrice: Number(row.totalPrice || row.basePrice || 0),
        pickupTime: row.pickupTime,
        deliveryTime: row.deliveryTime,
        slipImage: row.slipImage,
        proofImage: proofImage,
        riderBasketImage: riderBasketImage,
        paymentVerified: row.paymentStatus === 'verified',
        paymentRejected: row.paymentStatus === 'rejected',
        rejectReason: row.rejectReason,
        cancelReason: row.cancelReason,
        cancelledAt: row.cancelledAt,
        deliveredAt: row.deliveredAt,
        createdAt: row.createdAt,
        rider: row.riderId ? {
          id: row.riderId,
          name: row.riderName,
          phone: row.riderPhone
        } : null
      };
    }));

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error('🔥 Error SQL Detail:', error.message);
    res.status(500).json({ 
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลออเดอร์',
      detail: error.message 
    });
  }
};

// 2. สร้างคำสั่งซื้อใหม่ (Transaction)
export const createOrder = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const data = req.body;
    const orderId = data.id || `NN-${Math.floor(100000 + Math.random() * 900000)}`;

    const [existingCustomers] = await connection.query(
      'SELECT customer_id FROM Customer WHERE phone_number = ?',
      [data.customerPhone || '0800000000']
    );

    let customerId;
    if (existingCustomers.length > 0) {
      customerId = existingCustomers[0].customer_id;
    } else {
      const [newCustomer] = await connection.query(
        'INSERT INTO Customer (name, phone_number, password, address) VALUES (?, ?, ?, ?)',
        [data.customerName || 'คุณลูกค้า', data.customerPhone || '0800000000', 'User1234', data.address || '']
      );
      customerId = newCustomer.insertId;
    }

    const [services] = await connection.query(
      'SELECT service_id FROM Service_Type WHERE service_name LIKE ?',
      [`%${data.serviceName || 'ซัก อบ พับ'}%`]
    );
    const serviceId = services.length > 0 ? services[0].service_id : 1;

    const insertOrderSql = `
      INSERT INTO \`Order\` (
        order_id, customer_id, service_id, package_name, status, status_step,
        status_title, pickup_time, delivery_time, special_instruction,
        address, lat, lng, plastic_bag_count, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await connection.query(insertOrderSql, [
      orderId,
      customerId,
      serviceId,
      data.packageName || null,
      data.status || 'pending',
      data.statusStep || 1,
      data.statusTitle || 'รอตรวจสอบสลิป',
      data.pickupTime || '09:00 - 10:00 น.',
      data.deliveryTime || '18:00 - 19:00 น.',
      data.note || '',
      data.address || '',
      data.lat || null,
      data.lng || null,
      data.plasticBagCount || 0,
      data.createdAt || new Date().toLocaleString('th-TH')
    ]);

    const insertPaymentSql = `
      INSERT INTO Payment (order_id, amount, status, slip_image, created_at)
      VALUES (?, ?, ?, ?, ?)
    `;
    await connection.query(insertPaymentSql, [
      orderId,
      data.totalPrice || 0,
      data.paymentVerified ? 'verified' : 'pending',
      data.slipImage || null,
      data.createdAt || new Date().toLocaleString('th-TH')
    ]);

    if (data.specialItems && Array.isArray(data.specialItems) && data.specialItems.length > 0) {
      for (const item of data.specialItems) {
        await connection.query(
          'INSERT INTO Order_Special_Items (order_id, item_name, unit_price, count, total_price) VALUES (?, ?, ?, ?, ?)',
          [orderId, item.name, item.price, item.count || 1, (item.price * (item.count || 1))]
        );
      }
    }

    await connection.commit();
    res.status(201).json({ success: true, order: { ...data, id: orderId } });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'สร้างออเดอร์ลงฐานข้อมูลไม่สำเร็จ', detail: error.message });
  } finally {
    connection.release();
  }
};

// 3. อัปเดตสถานะออเดอร์
export const updateOrderStatus = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const body = req.body;

    if (body.paymentVerified !== undefined || body.paymentRejected !== undefined) {
      let payStatus = 'pending';
      if (body.paymentVerified) payStatus = 'verified';
      if (body.paymentRejected) payStatus = 'rejected';

      await connection.query(
        'UPDATE Payment SET status = ?, reject_reason = ? WHERE order_id = ?',
        [payStatus, body.rejectReason || null, id]
      );
    }

    const orderFields = [];
    const orderValues = [];

    if (body.statusStep !== undefined) { orderFields.push('status_step = ?'); orderValues.push(body.statusStep); }
    if (body.statusTitle !== undefined) { orderFields.push('status_title = ?'); orderValues.push(body.statusTitle); }
    if (body.status !== undefined) { orderFields.push('status = ?'); orderValues.push(body.status); }
    if (body.deliveredAt !== undefined) { orderFields.push('delivered_at = ?'); orderValues.push(body.deliveredAt); }
    if (body.cancelReason !== undefined) { orderFields.push('cancel_reason = ?'); orderValues.push(body.cancelReason); }
    if (body.cancelledAt !== undefined) { orderFields.push('cancelled_at = ?'); orderValues.push(body.cancelledAt); }

    if (body.rider && body.rider.id) {
      orderFields.push('rider_id = ?');
      orderValues.push(String(body.rider.id));
    }

    if (orderFields.length > 0) {
      orderValues.push(id);
      await connection.query(
        `UPDATE \`Order\` SET ${orderFields.join(', ')} WHERE order_id = ?`,
        orderValues
      );
    }

    if (body.proofImage) {
      await connection.query(
        'INSERT INTO Evidence_Photo (order_id, photo_type, photo_url, created_at) VALUES (?, ?, ?, ?)',
        [id, 'delivery_proof', body.proofImage, new Date().toLocaleString('th-TH')]
      );
    }
    if (body.riderBasketImage) {
      await connection.query(
        'INSERT INTO Evidence_Photo (order_id, photo_type, photo_url, created_at) VALUES (?, ?, ?, ?)',
        [id, 'rider_basket', body.riderBasketImage, new Date().toLocaleString('th-TH')]
      );
    }

    await connection.commit();
    res.status(200).json({ success: true, message: 'อัปเดตข้อมูลสำเร็จ' });
  } catch (error) {
    await connection.rollback();
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'อัปเดตสถานะออเดอร์ไม่สำเร็จ', detail: error.message });
  } finally {
    connection.release();
  }
};