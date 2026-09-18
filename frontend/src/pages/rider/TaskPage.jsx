import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bike, 
  MapPin, 
  Clock, 
  Phone, 
  CheckCircle2, 
  Package, 
  LogOut, 
  ChevronRight,
  Truck,
  FileText,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const TaskPage = () => {
  const navigate = useNavigate();
  const { orders, setOrders } = useApp ? useApp() : {};

  const [activeRider, setActiveRider] = useState(() => {
    try {
      const saved = localStorage.getItem('currentRider');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    if (!activeRider) {
      navigate('/login/rider', { replace: true });
    }
  }, [activeRider, navigate]);

  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'return' | 'history'

  // จัดการออกจากระบบ โดยเก็บค่า Remember Me ไว้ตามเดิม
  const handleLogout = () => {
    if (window.confirm('คุณต้องการออกจากระบบพนักงานใช่หรือไม่?')) {
      // 1. ลบเฉพาะ Session การเข้าใช้งานปัจจุบันเท่านั้น
      localStorage.removeItem('currentRider');
      setActiveRider(null);

      // 2. นำทางกลับไปยังหน้า Login ทันที (ไม่เรียก logoutRider() เพื่อป้องกันการเคลียร์ remember storage)
      navigate('/login/rider', { replace: true });
    }
  };

  if (!activeRider) return null;

  // 1. งานรับผ้าเข้าร้าน (Step 3: กำลังไปรับ, Step 4: ได้รับผ้าแล้วกำลังมาร้าน)
  const myPickupOrders = (orders || []).filter(
    o => [3, 4].includes(o.statusStep) && (o.rider?.id === activeRider.id || !o.rider)
  );

  // 2. งานส่งคืนผ้าให้ลูกค้า (Step 6: ซักเสร็จแล้ว ไรเดอร์กำลังนำส่งคืน)
  const myReturnOrders = (orders || []).filter(
    o => o.statusStep === 6 && (o.rider?.id === activeRider.id || !o.rider)
  );

  // 3. งานที่สำเร็จแล้ว (Step 7)
  const completedOrders = (orders || []).filter(
    o => o.statusStep === 7 && o.rider?.id === activeRider.id
  );

  const handleAdvanceStep = (orderId, nextStep, nextTitle) => {
    if (!setOrders) return;
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          statusStep: nextStep,
          statusTitle: nextTitle,
          status: nextStep === 7 ? 'completed' : order.status
        };
      }
      return order;
    }));
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      minHeight: '100dvh',
      backgroundColor: '#f1f5f9',
      margin: 0,
      padding: 0,
    }}>
      <div style={{
        width: '100vw',
        maxWidth: '430px',
        height: '100vh',
        maxHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflowX: 'hidden',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      }}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1d61f2 0%, #174ec2 100%)',
          color: '#ffffff',
          flexShrink: 0
        }} className="rounded-b-3xl px-5 pt-6 pb-5 shadow-md flex flex-col gap-3.5 z-20">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white">
                <Bike size={20} />
              </div>
              <div>
                <span className="text-[11px] text-blue-100 block font-medium">รหัสคนขับ: {activeRider.id}</span>
                <h1 className="font-bold text-white text-base leading-normal pt-0.5">{activeRider.name}</h1>
              </div>
            </div>

            {/* ปุ่มออกจากระบบ: ชี้เมาส์แล้วเปลี่ยนเป็นสีแดง */}
            <button
              type="button"
              onClick={handleLogout}
              className="w-10 h-10 rounded-2xl bg-white/15 hover:bg-red-500 active:bg-red-600 text-white flex items-center justify-center transition-colors duration-200 cursor-pointer shadow-xs"
              title="ออกจากระบบ"
            >
              <LogOut size={18} />
            </button>
          </div>

          {/* แท็บสถานะงาน 3 หมวดหมู่ */}
          <div className="grid grid-cols-3 gap-1.5 bg-black/15 p-1 rounded-2xl border border-white/15 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('active')}
              className={`py-2 rounded-xl transition cursor-pointer text-center ${
                activeTab === 'active' ? 'bg-white text-[#1d61f2] font-bold shadow-xs' : 'text-white/90 hover:text-white'
              }`}
            >
              รับผ้าเข้าร้าน ({myPickupOrders.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('return')}
              className={`py-2 rounded-xl transition cursor-pointer text-center ${
                activeTab === 'return' ? 'bg-white text-[#1d61f2] font-bold shadow-xs' : 'text-white/90 hover:text-white'
              }`}
            >
              ส่งคืนผ้า ({myReturnOrders.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`py-2 rounded-xl transition cursor-pointer text-center ${
                activeTab === 'history' ? 'bg-white text-[#1d61f2] font-bold shadow-xs' : 'text-white/90 hover:text-white'
              }`}
            >
              สำเร็จแล้ว ({completedOrders.length})
            </button>
          </div>
        </div>

        {/* รายการงาน */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">

          {/* แท็บ 1: งานรับผ้าเข้าร้าน (Step 3, 4) */}
          {activeTab === 'active' && (
            <>
              {myPickupOrders.length === 0 ? (
                <div className="text-center py-20 text-gray-400 text-xs flex flex-col items-center gap-2">
                  <Bike size={36} className="text-gray-300" />
                  <span className="leading-normal">ไม่มีงานรับผ้าเข้าร้านในขณะนี้</span>
                </div>
              ) : (
                myPickupOrders.map(order => (
                  <div key={order.id} className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <div>
                        <span className="font-bold text-xs text-gray-900 block">ออเดอร์ #{order.id}</span>
                        <span className="text-[11px] text-[#1d61f2] font-semibold">{order.statusTitle}</span>
                      </div>
                      {order.customerPhone && (
                        <a
                          href={`tel:${order.customerPhone}`}
                          className="flex items-center gap-1 bg-blue-50 text-[#1d61f2] px-2.5 py-1 rounded-lg text-xs font-bold hover:bg-blue-100"
                        >
                          <Phone size={12} /> โทรหาลูกค้า
                        </a>
                      )}
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl space-y-1 text-xs">
                      <div className="font-bold text-gray-800">ผู้สั่ง: {order.customerName || 'ลูกค้าทั่วไป'}</div>
                      <div className="text-gray-600 flex items-start gap-1">
                        <MapPin size={13} className="text-[#1d61f2] shrink-0 mt-0.5" />
                        <span>{order.address}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/rider/tasks/${order.id}`)}
                      className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-[#1d61f2] font-bold text-xs rounded-xl border border-blue-100 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FileText size={14} /> รายละเอียดงานและ GPS
                    </button>

                    {order.statusStep === 3 && (
                      <button
                        type="button"
                        onClick={() => handleAdvanceStep(order.id, 4, 'รับผ้าเข้าสู่ร้านเรียบร้อย')}
                        className="w-full py-2.5 rounded-xl bg-[#1d61f2] text-white font-bold text-xs hover:bg-blue-700 cursor-pointer"
                      >
                        รับผ้าจากลูกค้าแล้ว (กำลังนำส่งร้าน)
                      </button>
                    )}

                    {order.statusStep === 4 && (
                      <button
                        type="button"
                        onClick={() => handleAdvanceStep(order.id, 5, 'ร้านกำลังดำเนินการซักอบ')}
                        className="w-full py-2.5 rounded-xl bg-blue-800 text-white font-bold text-xs hover:bg-blue-900 cursor-pointer"
                      >
                        ผ้าถึงร้านแล้ว (ส่งต่อแผนกซักอบ)
                      </button>
                    )}
                  </div>
                ))
              )}
            </>
          )}

          {/* แท็บ 2: งานส่งคืนผ้าลูกค้า (Step 6) */}
          {activeTab === 'return' && (
            <>
              {myReturnOrders.length === 0 ? (
                <div className="text-center py-20 text-gray-400 text-xs flex flex-col items-center gap-2">
                  <Truck size={36} className="text-gray-300" />
                  <span className="leading-normal">ไม่มีงานส่งคืนผ้าในขณะนี้ (รอร้านซักอบเสร็จ)</span>
                </div>
              ) : (
                myReturnOrders.map(order => (
                  <div key={order.id} className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <div>
                        <span className="font-bold text-xs text-gray-900 block">ออเดอร์ #{order.id}</span>
                        <span className="text-[11px] text-emerald-600 font-semibold">ผ้าพร้อมส่งคืนลูกค้า</span>
                      </div>
                      {order.customerPhone && (
                        <a
                          href={`tel:${order.customerPhone}`}
                          className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-xs font-bold"
                        >
                          <Phone size={12} /> โทรแจ้งลูกค้า
                        </a>
                      )}
                    </div>

                    <div className="p-3 bg-emerald-50/40 rounded-xl space-y-1 text-xs">
                      <div className="font-bold text-gray-800">ผู้รับ: {order.customerName || 'ลูกค้าทั่วไป'}</div>
                      <div className="text-gray-600 flex items-start gap-1">
                        <MapPin size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>{order.address}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/rider/tasks/${order.id}`)}
                      className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FileText size={14} /> ดูที่อยู่ส่งคืน &amp; นำทาง GPS
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAdvanceStep(order.id, 7, 'จัดส่งผ้าคืนสำเร็จ')}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-sm cursor-pointer"
                    >
                      ส่งมอบผ้าคืนลูกค้าเรียบร้อย (ปิดงาน)
                    </button>
                  </div>
                ))
              )}
            </>
          )}

          {/* แท็บ 3: งานที่สำเร็จแล้ว (Step 7) */}
          {activeTab === 'history' && (
            <>
              {completedOrders.length === 0 ? (
                <div className="text-center py-20 text-gray-400 text-xs flex flex-col items-center gap-2">
                  <CheckCircle2 size={36} className="text-gray-300" />
                  <span className="leading-normal">ยังไม่มีรายการงานที่เสร็จสิ้น</span>
                </div>
              ) : (
                completedOrders.map(order => (
                  <div 
                    key={order.id} 
                    onClick={() => navigate(`/rider/tasks/${order.id}`)}
                    className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between cursor-pointer hover:border-blue-200 transition"
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs text-gray-800 block">#{order.id} - {order.serviceName}</span>
                      <span className="text-[11px] text-emerald-600 font-semibold block">ส่งมอบสำเร็จแล้ว</span>
                      <span className="text-[10px] text-gray-400 block">{order.customerName}</span>
                    </div>
                    <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                  </div>
                ))
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
};

export default TaskPage;