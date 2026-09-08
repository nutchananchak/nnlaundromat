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
  AlertCircle,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const TaskPage = () => {
  const navigate = useNavigate();
  const { orders, setOrders } = useApp ? useApp() : {};

  // ตรวจสอบสิทธิ์การเข้าสู่ระบบของ Rider
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
      // แก้เป็น /login/rider ให้ตรงกับ AppRoutes
      navigate('/login/rider', { replace: true });
    }
  }, [activeRider, navigate]);

  const [activeTab, setActiveTab] = useState('available');

  // ฟังก์ชันออกจากระบบของ Rider
  const handleLogout = () => {
    if (window.confirm('คุณต้องการออกจากระบบหรือไม่?')) {
      localStorage.removeItem('currentRider');
      localStorage.removeItem('rememberRider');
      setActiveRider(null);
      // แก้เป็น /login/rider ให้ตรงกับ AppRoutes
      navigate('/login/rider', { replace: true });
    }
  };

  if (!activeRider) {
    return null;
  }

  const availableOrders = (orders || []).filter(o => o.statusStep === 2);
  const myActiveOrders = (orders || []).filter(
    o => [3, 4, 6].includes(o.statusStep) && (o.rider?.id === activeRider.id || !o.rider)
  );
  const completedOrders = (orders || []).filter(
    o => o.statusStep === 7 && o.rider?.id === activeRider.id
  );

  const handleAcceptJob = (orderId) => {
    if (!setOrders) return;
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          statusStep: 3,
          statusTitle: 'ไรเดอร์กำลังเดินทางไปรับผ้า',
          rider: {
            id: activeRider.id,
            name: activeRider.name,
            phone: activeRider.phone
          }
        };
      }
      return order;
    }));
    setActiveTab('active');
  };

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
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      }}>

        {/* ส่วนหัว Header */}
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

            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition cursor-pointer"
              title="ออกจากระบบ"
            >
              <LogOut size={16} />
            </button>
          </div>

          {/* แท็บสถานะงาน */}
          <div className="grid grid-cols-3 gap-1.5 bg-black/15 p-1 rounded-2xl border border-white/15 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('available')}
              className={`py-2 rounded-xl transition cursor-pointer text-center ${
                activeTab === 'available' ? 'bg-white text-[#1d61f2] font-bold shadow-xs' : 'text-white/90 hover:text-white'
              }`}
            >
              งานใหม่ ({availableOrders.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('active')}
              className={`py-2 rounded-xl transition cursor-pointer text-center ${
                activeTab === 'active' ? 'bg-white text-[#1d61f2] font-bold shadow-xs' : 'text-white/90 hover:text-white'
              }`}
            >
              กำลังทำ ({myActiveOrders.length})
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

        {/* เนื้อหารายการงาน */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">

          {activeTab === 'available' && (
            <>
              {availableOrders.length === 0 ? (
                <div className="text-center py-20 text-gray-400 text-xs flex flex-col items-center gap-2">
                  <Package size={36} className="text-gray-300" />
                  <span className="leading-normal">ไม่มีรายการงานใหม่ที่รอรับในขณะนี้</span>
                </div>
              ) : (
                availableOrders.map(order => (
                  <div key={order.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <span className="font-bold text-xs text-[#1d61f2] bg-blue-50 px-2.5 py-0.5 rounded-md">
                        #{order.id}
                      </span>
                      <span className="text-xs font-bold text-gray-800 leading-normal pt-0.5">{order.serviceName}</span>
                    </div>

                    <div className="space-y-1.5 text-xs text-gray-600">
                      <div className="flex items-start gap-1.5">
                        <MapPin size={14} className="text-[#1d61f2] shrink-0 mt-0.5" />
                        <span className="line-clamp-2 leading-normal">{order.address}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Clock size={14} className="text-[#1d61f2] shrink-0" />
                        <span className="leading-normal">เวลานัดรับผ้า: {order.pickupTime || '-'}</span>
                      </div>
                      {order.totalPrice && (
                        <div className="text-right font-bold text-gray-900 text-sm pt-1">
                          ยอดรวม: {order.totalPrice.toLocaleString()} บาท
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAcceptJob(order.id)}
                      className="w-full py-2.5 rounded-xl bg-[#1d61f2] text-white font-bold text-xs shadow-sm hover:bg-blue-700 active:scale-[0.99] transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Bike size={15} /> รับงานนี้
                    </button>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'active' && (
            <>
              {myActiveOrders.length === 0 ? (
                <div className="text-center py-20 text-gray-400 text-xs flex flex-col items-center gap-2">
                  <Bike size={36} className="text-gray-300" />
                  <span className="leading-normal">ไม่มีงานที่กำลังดำเนินการ</span>
                </div>
              ) : (
                myActiveOrders.map(order => (
                  <div key={order.id} className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <div>
                        <span className="font-bold text-xs text-gray-900 block">ออเดอร์ #{order.id}</span>
                        <span className="text-[11px] text-[#1d61f2] font-semibold leading-normal">{order.statusTitle}</span>
                      </div>
                      {order.customerPhone && (
                        <a
                          href={`tel:${order.customerPhone}`}
                          className="flex items-center gap-1 bg-blue-50 text-[#1d61f2] px-2.5 py-1 rounded-lg text-xs font-bold hover:bg-blue-100 transition no-underline"
                        >
                          <Phone size={12} /> โทรหาลูกค้า
                        </a>
                      )}
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl space-y-1.5 text-xs">
                      <div className="font-bold text-gray-800 leading-normal pt-0.5">
                        ผู้สั่ง: {order.customerName || 'ลูกค้าทั่วไป'}
                      </div>
                      <div className="text-gray-600 flex items-start gap-1.5">
                        <MapPin size={13} className="text-[#1d61f2] shrink-0 mt-0.5" />
                        <span className="leading-normal">{order.address}</span>
                      </div>
                      {order.note && (
                        <div className="text-gray-500 text-[11px] leading-normal pt-0.5">
                          หมายเหตุ: {order.note}
                        </div>
                      )}
                    </div>

                    {order.statusStep === 3 && (
                      <button
                        type="button"
                        onClick={() => handleAdvanceStep(order.id, 4, 'รับผ้าเข้าสู่ร้านเรียบร้อย')}
                        className="w-full py-2.5 rounded-xl bg-[#1d61f2] text-white font-bold text-xs shadow-sm hover:bg-blue-700 transition cursor-pointer"
                      >
                        รับผ้าจากลูกค้าแล้ว (กำลังนำส่งร้าน)
                      </button>
                    )}

                    {order.statusStep === 4 && (
                      <button
                        type="button"
                        onClick={() => handleAdvanceStep(order.id, 5, 'ร้านกำลังดำเนินการซักอบ')}
                        className="w-full py-2.5 rounded-xl bg-blue-800 text-white font-bold text-xs shadow-sm hover:bg-blue-900 transition cursor-pointer"
                      >
                        ผ้าถึงร้านแล้ว (ส่งต่อแผนกซักอบ)
                      </button>
                    )}

                    {order.statusStep === 6 && (
                      <button
                        type="button"
                        onClick={() => handleAdvanceStep(order.id, 7, 'จัดส่งผ้าคืนสำเร็จ')}
                        className="w-full py-2.5 rounded-xl bg-[#1d61f2] text-white font-bold text-xs shadow-sm hover:bg-blue-700 transition cursor-pointer"
                      >
                        ส่งมอบผ้าคืนลูกค้าเรียบร้อย
                      </button>
                    )}
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'history' && (
            <>
              {completedOrders.length === 0 ? (
                <div className="text-center py-20 text-gray-400 text-xs flex flex-col items-center gap-2">
                  <CheckCircle2 size={36} className="text-gray-300" />
                  <span className="leading-normal">ยังไม่มีรายการงานที่เสร็จสิ้น</span>
                </div>
              ) : (
                completedOrders.map(order => (
                  <div key={order.id} className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs text-gray-800 block">#{order.id} - {order.serviceName}</span>
                      <span className="text-[11px] text-[#1d61f2] font-semibold block leading-normal">ส่งมอบสำเร็จแล้ว</span>
                      <span className="text-[10px] text-gray-400 block leading-normal">{order.customerName}</span>
                    </div>
                    <CheckCircle2 size={22} className="text-[#1d61f2] shrink-0" />
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