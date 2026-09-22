import client from './client';

// 1. ดึงรายการออเดอร์ (ดึงทั้งหมด หรือกรองตามเบอร์ลูกค้า/ไรเดอร์)
export const fetchOrders = async (userId = null) => {
  const params = userId ? { userId } : {};
  const response = await client.get('/orders', { params });
  return response.data;
};

// 2. [Customer] สั่งซักผ้าใหม่ บันทึกลง MySQL
export const createNewOrder = async (orderPayload) => {
  const response = await client.post('/orders', orderPayload);
  return response.data;
};

// 3. [Admin / Rider] อัปเดตสถานะ, อนุมัติ/ปฏิเสธสลิป, มอบหมายไรเดอร์, ส่งรูป
export const updateOrder = async (orderId, updatePayload) => {
  const response = await client.patch(`/orders/${orderId}`, updatePayload);
  return response.data;
};