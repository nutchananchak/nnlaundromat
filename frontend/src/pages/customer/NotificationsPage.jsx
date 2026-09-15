import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Clock, 
  Trash2, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import BottomNav from '../../components/layout/BottomNav';
import { useApp } from '../../context/AppContext';

export default function NotificationPage() {
  const navigate = useNavigate();
  const { orders } = useApp ? useApp() : {};
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // 1. โหลดข้อมูลแจ้งเตือนจาก localStorage
    const saved = localStorage.getItem('customerNotifications');
    let list = [];
    if (saved) {
      try {
        list = JSON.parse(saved);
      } catch (e) {
        list = [];
      }
    }

    // หากไม่มีแจ้งเตือนใน storage แต่มีออเดอร์ในระบบ สร้าง mock default เริ่มต้น
    if (list.length === 0 && orders && orders.length > 0) {
      list = [
        {
          id: 1,
          title: 'ยินดีต้อนรับสู่ N&N Laundromat',
          message: 'ขอบคุณที่เลือกใช้บริการซัก อบ พับ เดลิเวอรี่ของเราครับ',
          time: 'วันนี้',
          type: 'info',
          isRead: true
        }
      ];
    }

    setNotifications(list);

    // 2. เมื่อเข้ามาหน้านี้ ถือว่าผู้ใช้เปิดดูแล้ว -> มาร์กทุกข้อความว่า isRead = true เพื่อให้กระดิ่งหยุดสั่น
    const updatedAsRead = list.map(item => ({ ...item, isRead: true }));
    localStorage.setItem('customerNotifications', JSON.stringify(updatedAsRead));
  }, [orders]);

  // ล้างการแจ้งเตือนทั้งหมด
  const handleClearAll = () => {
    if (window.confirm('คุณต้องการลบรายการแจ้งเตือนทั้งหมดหรือไม่?')) {
      localStorage.setItem('customerNotifications', JSON.stringify([]));
      setNotifications([]);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      minHeight: '100dvh',
      backgroundColor: '#0f172a',
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
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      }} className="font-body text-base">

        {/* ส่วนหัว Header */}
        <div 
          style={{
            background: 'linear-gradient(135deg, #1d61f2 0%, #1045b8 100%)',
            boxShadow: '0 10px 25px rgba(29, 97, 242, 0.25)',
          }}
          className="rounded-b-3xl px-5 pt-6 pb-5 flex items-center justify-between shrink-0 z-20 text-white"
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-2xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition cursor-pointer shadow-xs"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">กล่องข้อความแจ้งเตือน</h1>
              <span className="text-xs text-blue-200 font-medium">อัปเดตสถานะออเดอร์และการเงิน</span>
            </div>
          </div>

          {notifications.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="w-10 h-10 rounded-2xl bg-white/15 hover:bg-red-500 text-white flex items-center justify-center transition cursor-pointer"
              title="ลบแจ้งเตือนทั้งหมด"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        {/* เนื้อหารายการแจ้งเตือน */}
        <div className="flex-1 overflow-y-auto p-4 pb-24 flex flex-col gap-3">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 text-center text-slate-400 gap-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                <Bell size={28} />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-700 block">ไม่มีข้อความแจ้งเตือน</span>
                <span className="text-xs text-slate-400 mt-0.5 block">เมื่อมีอัปเดตสลิปหรือสถานะงาน ข้อความจะปรากฏที่นี่</span>
              </div>
            </div>
          ) : (
            notifications.map((item) => {
              const isAlert = item.type === 'alert';
              const isSuccess = item.type === 'success';

              return (
                <div
                  key={item.id}
                  onClick={() => navigate('/')}
                  className={`p-4 rounded-3xl border transition cursor-pointer flex items-start gap-3.5 shadow-xs ${
                    isAlert 
                      ? 'bg-red-50/80 border-red-200 hover:border-red-300' 
                      : isSuccess
                      ? 'bg-emerald-50/60 border-emerald-200 hover:border-emerald-300'
                      : 'bg-white border-slate-100 hover:border-blue-200'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 shadow-2xs ${
                    isAlert
                      ? 'bg-red-500 text-white'
                      : isSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#1d61f2] text-white'
                  }`}>
                    {isAlert && <AlertTriangle size={20} />}
                    {isSuccess && <CheckCircle2 size={20} />}
                    {!isAlert && !isSuccess && <Sparkles size={20} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-bold truncate ${
                        isAlert ? 'text-red-900' : isSuccess ? 'text-emerald-900' : 'text-slate-800'
                      }`}>
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-2">
                        {item.time}
                      </span>
                    </div>

                    <p className={`text-xs mt-1 leading-relaxed ${
                      isAlert ? 'text-red-700' : isSuccess ? 'text-emerald-700' : 'text-slate-500'
                    }`}>
                      {item.message}
                    </p>

                    {isAlert && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 mt-2 bg-white px-2.5 py-1 rounded-lg border border-red-200 shadow-2xs">
                        แตะเพื่อไปแนบสลิปใหม่ที่หน้าหลัก <ChevronRight size={13} />
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <BottomNav />
      </div>
    </div>
  );
}