import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  // 1. ข้อมูลผู้ใช้ฝั่งลูกค้า (Customer) ดึงจากผู้ใช้ที่ล็อกอินจริงเท่านั้น
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        return {
          name: parsed.fullName || parsed.name || '',
          fullName: parsed.fullName || parsed.name || '',
          phone: parsed.phone || '',
          avatar: parsed.avatar || null,
        };
      }
    } catch (e) {
      // JSON parse error handling
    }
    return null;
  });

  const loginUser = (userData) => {
    const formattedUser = {
      name: userData.fullName || userData.name || '',
      fullName: userData.fullName || userData.name || '',
      phone: userData.phone || '',
      avatar: userData.avatar || null,
    };
    setUserProfile(formattedUser);
    localStorage.setItem('currentUser', JSON.stringify(formattedUser));
  };

  const logoutUser = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userProfile');
    setUserProfile(null);
  };

  // 2. ข้อมูลพนักงานรับ-ส่งผ้า (Rider Session)
  const [currentRider, setCurrentRider] = useState(() => {
    try {
      const savedRider = localStorage.getItem('currentRider');
      return savedRider ? JSON.parse(savedRider) : null;
    } catch (e) {
      return null;
    }
  });

  const loginRider = (riderData) => {
    setCurrentRider(riderData);
    localStorage.setItem('currentRider', JSON.stringify(riderData));
  };

  const logoutRider = () => {
    setCurrentRider(null);
    localStorage.removeItem('currentRider');
    localStorage.removeItem('rememberRider');
  };

  // 3. หมุดที่อยู่ลูกค้า
  const [addresses, setAddresses] = useState([
    {
      id: 'addr-1',
      title: 'หอพัก (ค่าเริ่มต้น)',
      detail: 'หอพักปิยมนต์ ห้อง 204 (ซอยอ่อนนุช 30)',
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

  // 4. รายการออเดอร์ (ล้าง Mock Data ทิ้งทั้งหมด เริ่มต้นเป็น Array ว่างเปล่า)
  const [orders, setOrders] = useState(() => {
    try {
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
        // คัดกรองออเดอร์ม็อกตัวอย่างเก่าทิ้ง เหลือเฉพาะออเดอร์ที่สร้างจริง
        return parsed.filter(o => 
          o.customerName !== 'ลูกค้าทั่วไป' && 
          o.id !== 'NN-1024' && 
          o.id !== 'NN-739182'
        );
      }
    } catch (e) {
      // JSON parse error handling
    }
    return [];
  });

  // ซิงค์ orders ลง localStorage เมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    try {
      localStorage.setItem('orders', JSON.stringify(orders));
    } catch (e) {
      // Storage error handling
    }
  }, [orders]);

  // ค้นหาออเดอร์ที่กำลังดำเนินงานจริง (ยังไม่เสร็จสิ้น)
  const activeOrder = orders.find(o => 
    o.status === 'in_progress' || 
    (Number(o.statusStep) >= 1 && Number(o.statusStep) < 7)
  );

  const currentAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];

  return (
    <AppContext.Provider value={{
      userProfile,
      setUserProfile,
      loginUser,
      logoutUser,
      currentRider,
      loginRider,
      logoutRider,
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