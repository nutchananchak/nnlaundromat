import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Clock, 
  Calendar, 
  ChevronRight, 
  RotateCw, 
  CheckCircle2, 
  Plus
} from 'lucide-react';
import BottomNav from '../../components/layout/BottomNav';
import { ORDER_STATUS, ORDER_STEPS } from '../../constants/orderStatus';

export default function OrdersPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'history'

  // ข้อมูลจำลองรายการออเดอร์ของลูกค้า
  const [orders] = useState([
    {
      id: 'NN-849201',
      serviceName: 'ซัก อบ พับ',
      packageName: 'ไซส์ M (ผ้าไม่เกิน 35 ชิ้น)',
      pickupTime: 'วันนี้ • 14:00 - 16:00 น.',
      address: 'หอพักใจดี ห้อง 204 (ซอยพหลโยธิน 34)',
      totalPrice: 180,
      createdAt: '1 ก.ย. 2026, 13:10 น.',
      status: ORDER_STATUS.PAYMENT_VERIFICATION, // รอตรวจสอบยอดเงิน
    },
    {
      id: 'NN-739182',
      serviceName: 'ชุดเครื่องนอน / ผ้านวม',
      packageName: 'ไซส์ 5 ฟุต',
      pickupTime: '28 ส.ค. 2026 • 10:00 - 12:00 น.',
      address: 'หอพักใจดี ห้อง 204 (ซอยพหลโยธิน 34)',
      totalPrice: 230,
      paymentMethod: 'พร้อมเพย์ QR Code (ชำระแล้ว)',
      paymentDate: '28 ส.ค. 2026, 09:35 น.',
      completedAt: '28 ส.ค. 2026, 16:45 น.',
      riderName: 'สมชาย คล่องแคล่ว (พนักงานรับ-ส่งผ้า)',
      note: 'วางไว้หน้าประตูห้องเบอร์ 204',
      basketImage: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=500&auto=format&fit=crop&q=60',
      createdAt: '28 ส.ค. 2026, 09:30 น.',
      status: ORDER_STATUS.COMPLETED, // ส่งคืนผ้าสำเร็จ
    },
    {
      id: 'NN-628491',
      serviceName: 'ซัก อบ พับ',
      packageName: 'ไซส์ S (ผ้าไม่เกิน 15 ชิ้น)',
      pickupTime: '20 ส.ค. 2026 • 08:00 - 10:00 น.',
      address: 'หอพักใจดี ห้อง 204 (ซอยพหลโยธิน 34)',
      totalPrice: 160,
      paymentMethod: 'พร้อมเพย์ QR Code (ชำระแล้ว)',
      paymentDate: '20 ส.ค. 2026, 07:45 น.',
      completedAt: '20 ส.ค. 2026, 14:30 น.',
      riderName: 'สมชาย คล่องแคล่ว (พนักงานรับ-ส่งผ้า)',
      note: 'วางไว้หน้าห้องเบอร์ 204',
      basketImage: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=500&auto=format&fit=crop&q=60',
      createdAt: '20 ส.ค. 2026, 07:45 น.',
      status: ORDER_STATUS.COMPLETED,
    }
  ]);

  // กรองออเดอร์ตามแท็บ
  const activeOrders = orders.filter(o => o.status !== ORDER_STATUS.COMPLETED);
  const historyOrders = orders.filter(o => o.status === ORDER_STATUS.COMPLETED);

  // ฟังก์ชันคำนวณ Progress และ Label ของสถานะ
  const getStatusInfo = (status) => {
    const stepIndex = ORDER_STEPS.findIndex(s => s.status === status);
    const currentStep = ORDER_STEPS[stepIndex] || ORDER_STEPS[0];
    const progressPercent = ((stepIndex + 1) / ORDER_STEPS.length) * 100;
    
    let badgeColor = 'bg-blue-50 text-[#1d61f2] border-blue-200';
    if (status === ORDER_STATUS.PAYMENT_VERIFICATION) {
      badgeColor = 'bg-amber-50 text-amber-600 border-amber-200';
    } else if (status === ORDER_STATUS.COMPLETED) {
      badgeColor = 'bg-emerald-50 text-emerald-600 border-emerald-200';
    }

    return {
      label: currentStep.label,
      Icon: currentStep.icon,
      stepIndex: stepIndex + 1,
      totalSteps: ORDER_STEPS.length,
      progressPercent,
      badgeColor
    };
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
      {/* Container มือถือหลัก */}
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
            <p className="text-white/80 text-xs font-medium">N&N Laundromat</p>
            <h1 className="font-display font-bold text-white text-xl tracking-tight">รายการออเดอร์</h1>
          </div>
          <button
            onClick={() => navigate('/home')}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition cursor-pointer"
            title="สร้างออเดอร์ใหม่"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* แท็บสลับ กำลังดำเนินการ / ประวัติสำเร็จ */}
        <div className="px-6 pt-4 pb-2">
          <div className="bg-gray-200/80 p-1 rounded-2xl flex">
            <button
              type="button"
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'active'
                  ? 'bg-white text-[#1d61f2] shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <RotateCw size={14} className={activeTab === 'active' ? 'animate-spin' : ''} />
              กำลังดำเนินการ ({activeOrders.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-white text-[#1d61f2] shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <CheckCircle2 size={14} />
              ประวัติสำเร็จ ({historyOrders.length})
            </button>
          </div>
        </div>

        {/* ส่วนแสดงรายการออเดอร์ที่ Scroll ได้ */}
        <div className="flex-1 overflow-y-auto px-6 py-3 pb-24 flex flex-col gap-4">
          
          {/* กรณีแท็บ Active */}
          {activeTab === 'active' && (
            <>
              {activeOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-[#1d61f2] mb-3">
                    <Package size={30} />
                  </div>
                  <h3 className="font-display font-bold text-gray-800 text-sm mb-1">ไม่มีออเดอร์ที่กำลังดำเนินการ</h3>
                  <p className="text-xs text-gray-400 mb-5 max-w-[220px]">ส่งผ้าซักกับ N&N Laundromat สะดวก สะอาด รวดเร็ว</p>
                  <button
                    onClick={() => navigate('/home')}
                    className="px-5 py-2.5 bg-[#1d61f2] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition cursor-pointer"
                  >
                    สั่งบริการเลย
                  </button>
                </div>
              ) : (
                activeOrders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  const Icon = statusInfo.Icon;

                  return (
                    <div
                      key={order.id}
                      onClick={() => navigate(`/orders/${order.id}`, { state: { order } })}
                      className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:border-blue-200 transition cursor-pointer flex flex-col gap-3"
                    >
                      {/* Header การ์ด: เลขออเดอร์ + Badge สถานะ */}
                      <div className="flex items-center justify-between">
                        <span className="font-display font-bold text-sm text-gray-900 flex items-center gap-1.5">
                          <Package size={16} className="text-[#1d61f2]" />
                          #{order.id}
                        </span>
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${statusInfo.badgeColor}`}>
                          <Icon size={12} />
                          {statusInfo.label}
                        </span>
                      </div>

                      {/* รายละเอียดบริการ */}
                      <div className="space-y-1.5 text-xs text-gray-600 border-y border-gray-50 py-2.5">
                        <div className="flex justify-between">
                          <span className="text-gray-400">บริการ</span>
                          <span className="font-bold text-gray-800">{order.serviceName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">แพ็กเกจ</span>
                          <span className="font-medium text-gray-700">{order.packageName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 flex items-center gap-1">
                            <Clock size={12} /> รอบเข้ารับ
                          </span>
                          <span className="font-medium text-gray-700">{order.pickupTime}</span>
                        </div>
                      </div>

                      {/* Mini Progress Bar */}
                      <div>
                        <div className="flex justify-between text-[10px] text-gray-400 font-semibold mb-1">
                          <span>ความคืบหน้า</span>
                          <span>ขั้นตอน {statusInfo.stepIndex} จาก {statusInfo.totalSteps}</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#1d61f2] h-full rounded-full transition-all duration-500"
                            style={{ width: `${statusInfo.progressPercent}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Footer การ์ด: ยอดเงิน + ปุ่มดูรายละเอียด */}
                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <span className="text-[10px] text-gray-400 block font-medium">ยอดชำระแล้ว</span>
                          <span className="font-display font-bold text-base text-[#1d61f2]">{order.totalPrice} ฿</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-gray-500">
                          ดูรายละเอียด <ChevronRight size={16} />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}

          {/* กรณีแท็บ History */}
          {activeTab === 'history' && (
            <>
              {historyOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                    <CheckCircle2 size={30} />
                  </div>
                  <h3 className="font-display font-bold text-gray-800 text-sm mb-1">ยังไม่มีประวัติการส่งผ้า</h3>
                  <p className="text-xs text-gray-400">ออเดอร์ที่ส่งคืนผ้าสำเร็จแล้วจะแสดงที่นี่</p>
                </div>
              ) : (
                historyOrders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => navigate(`/orders/${order.id}`, { state: { order } })}
                    className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:border-blue-200 transition cursor-pointer flex flex-col gap-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-sm text-gray-800">#{order.id}</span>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 size={12} /> ส่งสำเร็จ
                      </span>
                    </div>

                    <div className="text-xs text-gray-600 space-y-1">
                      <p className="font-bold text-gray-800">{order.serviceName} • <span className="font-normal text-gray-500">{order.packageName}</span></p>
                      <p className="text-[11px] text-gray-400 flex items-center gap-1">
                        <Calendar size={12} /> {order.createdAt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                      <span className="font-display font-bold text-sm text-gray-900">{order.totalPrice} ฿</span>
                      <div className="text-[11px] font-bold text-[#1d61f2] flex items-center gap-1">
                        ดูรายละเอียดใบเสร็จ <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

        </div>

        {/* เมนูแท็บล่างสุด */}
        <BottomNav />
      </div>
    </div>
  );
}