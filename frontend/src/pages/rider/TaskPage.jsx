import React, { useState, useEffect, useRef } from 'react';
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
  Sparkles,
  BellRing,
  AlertTriangle,
  Flame
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const TaskPage = () => {
  const navigate = useNavigate();
  const { orders, setOrders } = useApp ? useApp() : {};

  // State ป้ายแจ้งเตือน Toast สวยงาม
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 2800);
  };

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
      localStorage.removeItem('currentRider');
      setActiveRider(null);
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

  // ตรวจจับงานใหม่เพื่อแจ้งเตือนให้เด่นขึ้น
  const prevPickupCount = useRef(myPickupOrders.length);
  useEffect(() => {
    if (myPickupOrders.length > prevPickupCount.current) {
      triggerToast('มีรายการงานรับผ้าใหม่เข้ามา!', 'info');
    }
    prevPickupCount.current = myPickupOrders.length;
  }, [myPickupOrders.length]);

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
    triggerToast(nextStep === 7 ? 'ปิดงานส่งมอบสำเร็จเรียบร้อย!' : 'อัปเดตสถานะงานเรียบร้อย');
  };

  const totalUrgentTasks = myPickupOrders.length + myReturnOrders.length;

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

        {/* ป้ายแจ้งเตือนแบบ Modern Floating Toast */}
        {toast.show && (
          <div className="absolute top-4 left-4 right-4 z-50 animate-in slide-in-from-top duration-200">
            <div className={`p-3 rounded-2xl shadow-xl border flex items-center gap-3 backdrop-blur-md text-white ${
              toast.type === 'info' 
                ? 'bg-amber-500/95 border-amber-400' 
                : toast.type === 'error'
                ? 'bg-red-500/95 border-red-400'
                : 'bg-emerald-600/95 border-emerald-500'
            }`}>
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                {toast.type === 'info' ? <BellRing size={16} /> : <CheckCircle2 size={16} />}
              </div>
              <span className="text-xs font-bold flex-1">{toast.message}</span>
            </div>
          </div>
        )}

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

            <button
              type="button"
              onClick={handleLogout}
              className="w-10 h-10 rounded-2xl bg-white/15 hover:bg-red-500 active:bg-red-600 text-white flex items-center justify-center transition-colors duration-200 cursor-pointer shadow-xs"
              title="ออกจากระบบ"
            >
              <LogOut size={18} />
            </button>
          </div>

          {/* แท็บสถานะงาน 3 หมวดหมู่ พร้อมป้าย NEW สไตล์แคปซูล */}
          <div className="grid grid-cols-3 gap-1.5 bg-black/15 p-1 rounded-2xl border border-white/15 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('active')}
              className={`py-2 rounded-xl transition cursor-pointer text-center relative ${
                activeTab === 'active' ? 'bg-white text-[#1d61f2] font-bold shadow-xs' : 'text-white/90 hover:text-white'
              }`}
            >
              รับผ้า ({myPickupOrders.length})
              {myPickupOrders.length > 0 && (
                <span className="absolute -top-1.5 -right-1 px-1.5 py-0.2 bg-rose-500 text-white text-[8.5px] font-black rounded-full border border-white/80 shadow-xs tracking-tighter pointer-events-none animate-in zoom-in-50 duration-200">
                  NEW
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('return')}
              className={`py-2 rounded-xl transition cursor-pointer text-center relative ${
                activeTab === 'return' ? 'bg-white text-[#1d61f2] font-bold shadow-xs' : 'text-white/90 hover:text-white'
              }`}
            >
              ส่งคืน ({myReturnOrders.length})
              {myReturnOrders.length > 0 && (
                <span className="absolute -top-1.5 -right-1 px-1.5 py-0.2 bg-rose-500 text-white text-[8.5px] font-black rounded-full border border-white/80 shadow-xs tracking-tighter pointer-events-none animate-in zoom-in-50 duration-200">
                  NEW
                </span>
              )}
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

          {/* ป้ายเตือนงานใหม่เด่นสะดุดตา เมื่อมีงานค้าง */}
          {totalUrgentTasks > 0 && activeTab !== 'history' && (
            <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl shadow-md shadow-orange-500/15 flex items-center justify-between gap-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Flame size={18} className="text-yellow-200 animate-bounce" />
                </div>
                <div>
                  <span className="text-xs font-black block">มีงานรอคุณจัดการอยู่ {totalUrgentTasks} ออเดอร์</span>
                  <span className="text-[10px] text-orange-100 block">โปรดเร่งดำเนินการเพื่อรอบเวลาส่งที่ตรงต่อเวลา</span>
                </div>
              </div>
              <span className="text-[10px] bg-white text-orange-600 font-extrabold px-2.5 py-1 rounded-lg shrink-0 shadow-2xs">
                งานด่วน
              </span>
            </div>
          )}

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
                  <div key={order.id} className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm flex flex-col gap-3 relative overflow-hidden">
                    {/* ขีดสัญลักษณ์งานด่วนด้านข้าง */}
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#1d61f2]" />

                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-gray-900">ออเดอร์ #{order.id}</span>
                          <span className="text-[10px] bg-blue-50 text-[#1d61f2] font-extrabold px-2 py-0.5 rounded-md">
                            งานรับผ้า
                          </span>
                        </div>
                        <span className="text-[11px] text-[#1d61f2] font-semibold block mt-0.5">{order.statusTitle}</span>
                      </div>
                      {order.customerPhone && (
                        <a
                          href={`tel:${order.customerPhone}`}
                          className="flex items-center gap-1 bg-blue-50 text-[#1d61f2] px-2.5 py-1 rounded-lg text-xs font-bold hover:bg-blue-100 transition"
                        >
                          <Phone size={12} /> โทรหาลูกค้า
                        </a>
                      )}
                    </div>

                    <div className="p-3 bg-slate-50/80 rounded-xl space-y-1 text-xs border border-slate-100">
                      <div className="font-bold text-gray-800">ผู้สั่ง: {order.customerName || 'ลูกค้าทั่วไป'}</div>
                      <div className="text-gray-600 flex items-start gap-1">
                        <MapPin size={13} className="text-[#1d61f2] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{order.address}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/rider/tasks/${order.id}`)}
                      className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-[#1d61f2] font-bold text-xs rounded-xl border border-blue-100 flex items-center justify-center gap-1.5 cursor-pointer transition"
                    >
                      <FileText size={14} /> รายละเอียดงานและ GPS
                    </button>

                    {order.statusStep === 3 && (
                      <button
                        type="button"
                        onClick={() => handleAdvanceStep(order.id, 4, 'รับผ้าเข้าสู่ร้านเรียบร้อย')}
                        className="w-full py-2.5 rounded-xl bg-[#1d61f2] text-white font-bold text-xs hover:bg-blue-700 shadow-sm shadow-blue-500/20 cursor-pointer transition active:scale-[0.99]"
                      >
                        รับผ้าจากลูกค้าแล้ว (กำลังนำส่งร้าน)
                      </button>
                    )}

                    {order.statusStep === 4 && (
                      <button
                        type="button"
                        onClick={() => handleAdvanceStep(order.id, 5, 'ร้านกำลังดำเนินการซักอบ')}
                        className="w-full py-2.5 rounded-xl bg-blue-800 text-white font-bold text-xs hover:bg-blue-900 shadow-sm cursor-pointer transition active:scale-[0.99]"
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
                  <div key={order.id} className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm flex flex-col gap-3 relative overflow-hidden">
                    {/* ขีดสัญลักษณ์งานส่งคืน */}
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500" />

                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-gray-900">ออเดอร์ #{order.id}</span>
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-extrabold px-2 py-0.5 rounded-md">
                            ส่งคืนผ้า
                          </span>
                        </div>
                        <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">ผ้าพร้อมส่งคืนลูกค้า</span>
                      </div>
                      {order.customerPhone && (
                        <a
                          href={`tel:${order.customerPhone}`}
                          className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-xs font-bold hover:bg-emerald-100 transition"
                        >
                          <Phone size={12} /> โทรแจ้งลูกค้า
                        </a>
                      )}
                    </div>

                    <div className="p-3 bg-emerald-50/40 rounded-xl space-y-1 text-xs border border-emerald-100/60">
                      <div className="font-bold text-gray-800">ผู้รับ: {order.customerName || 'ลูกค้าทั่วไป'}</div>
                      <div className="text-gray-600 flex items-start gap-1">
                        <MapPin size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{order.address}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/rider/tasks/${order.id}`)}
                      className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200 flex items-center justify-center gap-1.5 cursor-pointer transition"
                    >
                      <FileText size={14} /> ดูที่อยู่ส่งคืน &amp; นำทาง GPS
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAdvanceStep(order.id, 7, 'จัดส่งผ้าคืนสำเร็จ')}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-sm shadow-emerald-600/20 cursor-pointer transition active:scale-[0.99]"
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