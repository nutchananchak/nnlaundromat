import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Package, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Store, 
  ChevronRight, 
  CheckCheck,
  Sparkles,
  Bike
} from 'lucide-react';
import BottomNav from '../../components/layout/BottomNav';

export default function NotificationsPage() {
  const navigate = useNavigate();

  // ข้อมูลจำลองการแจ้งเตือนเน้นสถานะผ้า + เวลาเปิด-ปิด/วันหยุด
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      type: 'order',
      title: 'ผ้าของคุณกำลังอยู่ในกระบวนการซัก-อบ',
      description: 'ออเดอร์ #NN-849201 ทางร้านได้รับผ้าเรียบร้อยแล้วและกำลังดำเนินการซัก-อบตามมาตรฐาน',
      time: '15 นาทีที่แล้ว',
      isRead: false,
      targetPath: '/home',
      icon: Sparkles,
      color: '#1d61f2',
      bgColor: '#eff6ff',
    },
    {
      id: 'notif-2',
      type: 'store_alert',
      title: 'แจ้งหยุดให้บริการชั่วคราว (ปรับปรุงระบบน้ำประปา)',
      description: 'ทางร้าน N&N Laundromat ขอหยุดรับบริการในวันที่ 5 ก.ย. 2026 เวลา 09:00 - 13:00 น. และจะเปิดรอบจัดส่งตามปกติหลังเวลาดังกล่าว',
      time: '1 ชั่วโมงที่แล้ว',
      isRead: false,
      targetPath: null,
      icon: AlertTriangle,
      color: '#ea580c',
      bgColor: '#fff7ed',
    },
    {
      id: 'notif-3',
      type: 'order',
      title: 'ไรเดอร์กำลังเดินทางนำผ้ามาส่งคืน',
      description: 'ออเดอร์ #NN-849201 ซัก อบ พับ เรียบร้อยแล้ว ไรเดอร์กำลังเดินทางไปส่งที่หอพักใจดี ห้อง 204',
      time: '3 ชั่วโมงที่แล้ว',
      isRead: true,
      targetPath: '/home',
      icon: Bike,
      color: '#0284c7',
      bgColor: '#f0f9ff',
    },
    {
      id: 'notif-4',
      type: 'store_schedule',
      title: 'แจ้งเวลาทำการช่วงวันหยุดนักขัตฤกษ์',
      description: 'ร้านเปิดให้บริการตามปกติ ทุกวันจันทร์ - อาทิตย์ เวลา 08:00 - 21:00 น. สามารถสั่งบริการรับ-ส่งล่วงหน้าได้ตลอด 24 ชม.',
      time: '28 ส.ค. 2026',
      isRead: true,
      targetPath: null,
      icon: Store,
      color: '#16a34a',
      bgColor: '#f0fdf4',
    },
    {
      id: 'notif-5',
      type: 'order',
      title: 'ส่งมอบผ้าสำเร็จเรียบร้อย',
      description: 'ออเดอร์ #NN-739182 ส่งคืนเรียบร้อยแล้ว ขอบคุณที่ไว้วางใจใช้บริการ N&N Laundromat',
      time: '28 ส.ค. 2026',
      isRead: true,
      targetPath: '/orders/NN-739182',
      icon: CheckCircle2,
      color: '#059669',
      bgColor: '#ecfdf5',
    }
  ]);

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(item => ({ ...item, isRead: true })));
  };

  const handleNotificationClick = (notif) => {
    setNotifications(prev => 
      prev.map(item => item.id === notif.id ? { ...item, isRead: true } : item)
    );

    if (notif.targetPath) {
      navigate(notif.targetPath);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
      }} className="font-body">

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1d61f2 0%, #1045b8 100%)',
          color: '#ffffff',
          boxShadow: '0 10px 25px rgba(29, 97, 242, 0.25)',
          flexShrink: 0
        }} className="rounded-b-3xl px-6 pt-6 pb-6 flex items-center justify-between z-20">
          <div>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)' }} className="text-xs font-medium">N&N Laundromat</p>
            <h1 style={{ color: '#ffffff' }} className="font-bold text-xl tracking-tight flex items-center gap-2">
              การแจ้งเตือน
              {unreadCount > 0 && (
                <span className="text-[11px] bg-red-500 text-white font-bold px-2 py-0.5 rounded-full shadow-sm">
                  {unreadCount} ใหม่
                </span>
              )}
            </h1>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="text-xs font-bold bg-white/20 text-white px-3 py-1.5 rounded-xl hover:bg-white/30 transition cursor-pointer flex items-center gap-1"
              title="อ่านทั้งหมด"
            >
              <CheckCheck size={14} />
              อ่านทั้งหมด
            </button>
          )}
        </div>

        {/* Scrollable Notification List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 pb-24 flex flex-col gap-3">
          
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div style={{ backgroundColor: '#eff6ff', color: '#1d61f2' }} className="w-16 h-16 rounded-full flex items-center justify-center mb-3">
                <Bell size={32} />
              </div>
              <h3 style={{ color: '#1e293b' }} className="font-bold text-sm mb-1">ไม่มีการแจ้งเตือน</h3>
              <p style={{ color: '#94a3b8' }} className="text-xs max-w-[200px]">
                อัปเดตสถานะผ้าและประกาศสำคัญจากทางร้านจะแสดงที่นี่
              </p>
            </div>
          ) : (
            notifications.map((notif) => {
              const Icon = notif.icon;

              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  style={{ 
                    backgroundColor: notif.isRead ? '#ffffff' : '#f8faff',
                    borderColor: notif.isRead ? '#f1f5f9' : '#bfdbfe' 
                  }}
                  className={`rounded-2xl p-4 border transition cursor-pointer flex items-start gap-3.5 shadow-sm hover:border-blue-300 relative ${
                    !notif.isRead ? 'ring-1 ring-blue-100' : ''
                  }`}
                >
                  {/* จุดสถานะยังไม่ได้อ่าน */}
                  {!notif.isRead && (
                    <div className="w-2 h-2 rounded-full bg-[#1d61f2] absolute top-4 right-4"></div>
                  )}

                  {/* ไอคอนตามประเภท */}
                  <div
                    style={{ backgroundColor: notif.bgColor, color: notif.color }}
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 shadow-sm"
                  >
                    <Icon size={20} />
                  </div>

                  {/* ข้อความแจ้งเตือน */}
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 
                      style={{ color: notif.isRead ? '#1e293b' : '#0f172a' }} 
                      className={`text-xs leading-snug ${notif.isRead ? 'font-bold' : 'font-extrabold'}`}
                    >
                      {notif.title}
                    </h3>
                    <p style={{ color: '#64748b' }} className="text-[11px] mt-1 leading-relaxed">
                      {notif.description}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <Clock size={11} style={{ color: '#94a3b8' }} />
                      <span style={{ color: '#94a3b8' }} className="text-[10px] font-medium">
                        {notif.time}
                      </span>
                    </div>
                  </div>

                  {/* ลูกศรนำทาง (เฉพาะรายการสถานะผ้าที่มีปลายทาง) */}
                  {notif.targetPath && (
                    <div className="self-center text-gray-400 shrink-0">
                      <ChevronRight size={16} />
                    </div>
                  )}
                </div>
              );
            })
          )}

        </div>

        {/* แถบเมนูล่าง */}
        <BottomNav />
      </div>
    </div>
  );
}