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

  // 3. หมุดที่อยู่ลูกค้า (เริ่มต้นเป็น Array ว่างเปล่า 100% ถ้ายังไม่มีการปักหมุด)
  const [addresses, setAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem('addresses');
      if (saved) {
        const parsed = JSON.parse(saved);
        // คัดกรองเอา Mock data เก่าที่เคยบันทึกไว้ออก
        return parsed.filter(a => 
          !a.detail?.includes('ปิยมนต์') && 
          !a.detail?.includes('ลุมพินี') &&
          a.id !== 'addr-1' &&
          a.id !== 'addr-2'
        );
      }
    } catch (e) {
      // JSON parse error handling
    }
    return []; // ค่าเริ่มต้นว่างเปล่า ไม่มีการใส่ที่อยู่จำลอง
  });

  // รหัสหมุดที่อยู่เริ่มต้นที่เลือกใช้งาน
  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    return localStorage.getItem('selectedAddressId') || null;
  });

  // ซิงค์ addresses และ selectedAddressId ลง localStorage
  useEffect(() => {
    try {
      localStorage.setItem('addresses', JSON.stringify(addresses));

      if (addresses.length > 0) {
        const hasSelected = addresses.some(a => a.id === selectedAddressId);
        if (!hasSelected) {
          const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
          setSelectedAddressId(defaultAddr.id);
          localStorage.setItem('selectedAddressId', defaultAddr.id);
        }
      } else {
        setSelectedAddressId(null);
        localStorage.removeItem('selectedAddressId');
      }
    } catch (e) {
      // Storage error handling
    }
  }, [addresses, selectedAddressId]);

  // 4. รายการออเดอร์ (ล้าง Mock Data ทิ้งทั้งหมด เริ่มต้นเป็น Array ว่างเปล่า)
  const [orders, setOrders] = useState(() => {
    try {
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
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

  useEffect(() => {
    try {
      localStorage.setItem('orders', JSON.stringify(orders));
    } catch (e) {
      // Storage error handling
    }
  }, [orders]);

  // ค้นหาออเดอร์ที่กำลังดำเนินงานจริง
  const activeOrder = orders.find(o => 
    o.status === 'in_progress' || 
    (Number(o.statusStep) >= 1 && Number(o.statusStep) < 7)
  );

  // ดึงที่อยู่ที่เลือกใช้งานจริง (ถ้ายังไม่มีการปักหมุด จะได้ค่า null ทันที)
  const currentAddress = addresses.length > 0 
    ? (addresses.find(a => a.id === selectedAddressId) || addresses[0]) 
    : null;

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