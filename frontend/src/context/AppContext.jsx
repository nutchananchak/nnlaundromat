import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  // 1. ข้อมูลผู้ใช้ส่วนกลาง
  const [userProfile, setUserProfile] = useState({
    name: 'สมศรี มีความสุข',
    phone: '081-234-5678',
    avatar: null,
  });

  // 2. หมุดที่อยู่สูงสุด 3 แห่ง (ใช้ร่วมกันทั้งหน้า Home, Profile, NewOrder)
  const [addresses, setAddresses] = useState([
    {
      id: 'addr-1',
      title: 'หอพัก (ค่าเริ่มต้น)',
      detail: 'หอพักใจดี ห้อง 204 (ซอยพหลโยธิน 34)',
      lat: 13.8415,
      lng: 100.5789,
      isDefault: true,
    },
    {
      id: 'addr-2',
      title: 'บ้าน / คอนโด',
      detail: 'คอนโดลุมพินี พาร์ค อาคาร B ชั้น 12 ห้อง 1205',
      lat: 13.8322,
      lng: 100.5712,
      isDefault: false,
    }
  ]);

  const [selectedAddressId, setSelectedAddressId] = useState('addr-1');

  // 3. รายการออเดอร์ทั้งหมด (เชื่อมระหว่างหน้า Home, OrdersPage, OrderDetailPage)
  const [orders, setOrders] = useState([
    {
      id: 'NN-1024',
      status: 'in_progress', // กำลังดำเนินการ
      statusStep: 5,
      statusTitle: 'กำลังซักอบ',
      estimatedTime: 'คาดว่าจะส่งคืน วันนี้ 18:00 น.',
      serviceName: 'ซัก อบ พับ',
      packageName: 'ไซส์ M',
      price: 180,
      createdAt: 'วันนี้ 10:30 น.',
      pickupTime: '10:00 - 11:00 น.',
      address: 'หอพักใจดี ห้อง 204 (ซอยพหลโยธิน 34)',
      note: 'ผ้าสีแยกถุงไว้ให้แล้วค่ะ',
      stepsHistory: [
        { title: 'สั่งบริการเรียบร้อย', time: '10:30 น.', done: true },
        { title: 'ตรวจสอบยอดเงิน', time: '10:35 น.', done: true },
        { title: 'ไรเดอร์รับงาน', time: '10:45 น.', done: true },
        { title: 'รับผ้าเข้าสู่ร้าน', time: '11:15 น.', done: true },
        { title: 'กำลังดำเนินการซัก-อบ', time: '11:30 น.', done: true, current: true },
        { title: 'ไรเดอร์นำส่งคืน', time: 'รอเวลา 17:30 น.', done: false },
        { title: 'ส่งมอบผ้าสำเร็จ', time: 'รอเวลา 18:00 น.', done: false },
      ]
    },
    {
      id: 'NN-739182',
      status: 'completed', // เสร็จสิ้นแล้ว
      statusStep: 7,
      statusTitle: 'ส่งคืนผ้าสำเร็จ',
      serviceName: 'ชุดเครื่องนอน / ผ้านวม',
      packageName: 'ไซส์ 5 ฟุต',
      price: 230,
      createdAt: '28 ส.ค. 2026',
      pickupTime: '14:00 - 15:00 น.',
      address: 'หอพักใจดี ห้อง 204 (ซอยพหลโยธิน 34)',
      note: 'ผ้านวมสีฟ้า',
    }
  ]);

  // ค้นหาออเดอร์ที่กำลังดำเนินการอยู่ (สำหรับนำไปแสดงหน้า Home)
  const activeOrder = orders.find(o => o.status === 'in_progress');

  // ที่อยู่ที่เลือกไว้ปัจจุบัน
  const currentAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];

  return (
    <AppContext.Provider value={{
      userProfile,
      setUserProfile,
      addresses,
      setAddresses,
      selectedAddressId,
      setSelectedAddressId,
      currentAddress,
      orders,
      setOrders,
      activeOrder
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);