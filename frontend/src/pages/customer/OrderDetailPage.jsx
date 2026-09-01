import { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Phone, 
  CreditCard, 
  CheckCircle2, 
  Camera, 
  FileText, 
  RotateCw,
  Receipt,
  UserCheck
} from 'lucide-react';
import { ORDER_STATUS, ORDER_STEPS } from '../../constants/orderStatus';

export default function OrderDetailPage() {
  const navigate = useNavigate();
  const location = useLocation() || {};
  const { id } = useParams();

  const raw = location.state?.order || {};

  const [order] = useState({
    id: raw.id || id || 'NN-849201',
    serviceName: raw.serviceName || 'ซัก อบ พับ',
    packageName: raw.packageName || 'ไซส์ M (ผ้าไม่เกิน 35 ชิ้น)',
    unitPrice: raw.unitPrice || raw.totalPrice || 180,
    totalPrice: raw.totalPrice || 180,
    paymentMethod: raw.paymentMethod || 'พร้อมเพย์ QR Code (ชำระแล้ว)',
    paymentDate: raw.paymentDate || raw.createdAt || '1 ก.ย. 2026, 13:10 น.',
    pickupTime: raw.pickupTime || 'วันนี้ • 14:00 - 16:00 น.',
    completedAt: raw.completedAt || '20 ส.ค. 2026, 14:30 น.',
    address: raw.address || 'หอพักใจดี ห้อง 204 (ซอยพหลโยธิน 34)',
    note: raw.note || 'วางไว้หน้าห้องเบอร์ 204',
    basketImage: raw.basketImage || 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=500&auto=format&fit=crop&q=60',
    status: raw.status || ORDER_STATUS.COMPLETED,
    rider: raw.rider || {
      name: 'สมชาย คล่องแคล่ว',
      phone: '089-123-4567',
      vehiclePlate: '1กข-9988 กทม.',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    }
  });

  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isCompleted = order.status === ORDER_STATUS.COMPLETED;
  const currentStepIndex = ORDER_STEPS.findIndex(s => s.status === order.status);

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReorder = () => {
    navigate('/new-order', {
      state: {
        service: order.serviceName.includes('เครื่องนอน') ? 'bedding' : 'wash_dry_fold',
        packageSize: order.packageName,
        address: order.address,
        note: order.note
      }
    });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
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
      }}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1d61f2 0%, #1045b8 100%)',
          color: '#ffffff',
          boxShadow: '0 10px 25px rgba(29, 97, 242, 0.25)',
          flexShrink: 0
        }} className="rounded-b-3xl px-6 pt-6 pb-6 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition cursor-pointer"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)' }} className="text-xs font-medium">
                {isCompleted ? 'ประวัติคำสั่งซื้อ' : 'ติดตามสถานะออเดอร์'}
              </p>
              <h1 style={{ color: '#ffffff' }} className="font-bold text-lg tracking-tight">
                {isCompleted ? 'รายละเอียดใบเสร็จ' : `#${order.id}`}
              </h1>
            </div>
          </div>

          {isCompleted ? (
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
              <Receipt size={20} />
            </div>
          ) : (
            <button
              type="button"
              onClick={handleRefresh}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition cursor-pointer"
              title="รีเฟรชสถานะ"
            >
              <RotateCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 pb-28 flex flex-col gap-5">

          {/* โหมด 1: กำลังดำเนินการ (Tracking) */}
          {!isCompleted && (
            <>
              {order.rider && currentStepIndex >= 2 && (
                <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d61f2 100%)', color: '#ffffff' }} className="p-4 rounded-3xl shadow-lg shadow-blue-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={order.rider.avatar}
                      alt={order.rider.name}
                      className="w-12 h-12 rounded-full border-2 border-white object-cover"
                    />
                    <div>
                      <span style={{ color: '#dbeafe' }} className="text-[11px] font-medium block">ไรเดอร์ผู้ดูแลคุณ</span>
                      <h3 style={{ color: '#ffffff' }} className="font-bold text-sm">{order.rider.name}</h3>
                      <p style={{ color: '#dbeafe' }} className="text-[11px] mt-0.5">ทะเบียน {order.rider.vehiclePlate}</p>
                    </div>
                  </div>

                  <a
                    href={`tel:${order.rider.phone}`}
                    className="w-11 h-11 bg-white text-[#1d61f2] rounded-full flex items-center justify-center shadow-md active:scale-95 transition cursor-pointer"
                    title="โทรหาไรเดอร์"
                  >
                    <Phone size={18} />
                  </a>
                </div>
              )}

              {/* Timeline Stepper */}
              <div style={{ backgroundColor: '#ffffff', color: '#0f172a' }} className="p-5 rounded-3xl border border-gray-100 shadow-sm">
                <h2 style={{ color: '#0f172a' }} className="font-bold text-sm mb-4 flex items-center gap-2">
                  <Clock size={16} className="text-[#1d61f2]" />
                  สถานะการดำเนินงาน
                </h2>

                <div className="relative pl-6 space-y-5">
                  {ORDER_STEPS.map((step, index) => {
                    const StepIcon = step.icon;
                    const isPassed = index < currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                      <div key={step.status} className="relative flex items-start gap-3.5">
                        {index < ORDER_STEPS.length - 1 && (
                          <div
                            className={`absolute -left-[19px] top-6 w-[2px] h-[calc(100%+4px)] transition-colors ${
                              index < currentStepIndex ? 'bg-[#1d61f2]' : 'bg-gray-200'
                            }`}
                          />
                        )}

                        <div
                          className={`absolute -left-[30px] w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
                            isPassed
                              ? 'bg-[#1d61f2] text-white shadow-sm'
                              : isCurrent
                              ? 'bg-[#1d61f2] text-white ring-4 ring-blue-100 scale-110 shadow-md animate-pulse'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {isPassed ? <CheckCircle2 size={14} /> : <StepIcon size={12} />}
                        </div>

                        <div className="flex-1">
                          <p
                            style={{
                              color: isCurrent ? '#1d61f2' : isPassed ? '#1e293b' : '#94a3b8'
                            }}
                            className={`text-xs font-bold leading-tight ${isCurrent ? 'text-[13px]' : ''}`}
                          >
                            {step.label}
                          </p>
                          {isCurrent && (
                            <p style={{ color: '#64748b' }} className="text-[11px] mt-0.5 font-medium">
                              {order.status === ORDER_STATUS.PAYMENT_VERIFICATION && 'เจ้าหน้าที่กำลังตรวจสอบยอดเงิน'}
                              {order.status === ORDER_STATUS.PENDING && 'ระบบกำลังจัดเตรียมไรเดอร์เข้ารับผ้า'}
                              {order.status === ORDER_STATUS.ACCEPTED && 'ไรเดอร์กำลังเดินทางไปยังจุดนัดพบ'}
                              {order.status === ORDER_STATUS.PICKED_UP && 'รับผ้าเรียบร้อยแล้ว กำลังนำส่งหน้าร้าน'}
                              {order.status === ORDER_STATUS.WASHING && 'ผ้าของคุณกำลังอยู่ในกระบวนการซัก-อบ'}
                              {order.status === ORDER_STATUS.OUT_FOR_DELIVERY && 'ไรเดอร์กำลังนำผ้ากลับมาส่งคืน'}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* สถานที่รับ-ส่ง */}
              <div style={{ backgroundColor: '#ffffff', color: '#0f172a' }} className="p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-3">
                <h3 style={{ color: '#0f172a' }} className="font-bold text-sm flex items-center gap-2">
                  <MapPin size={16} className="text-[#1d61f2]" />
                  สถานที่รับ-ส่งผ้า
                </h3>
                <div style={{ backgroundColor: '#f8fafc' }} className="p-3 rounded-2xl text-xs">
                  <p style={{ color: '#1e293b' }} className="font-bold">{order.address}</p>
                  <p style={{ color: '#64748b' }} className="text-[11px] mt-1">รอบเวลา: {order.pickupTime}</p>
                </div>

                {order.basketImage && (
                  <div className="pt-2 border-t border-gray-100">
                    <span style={{ color: '#334155' }} className="text-xs font-bold block mb-2 flex items-center gap-1.5">
                      <Camera size={14} className="text-[#1d61f2]" /> รูปถ่ายจุดวางตะกร้าผ้า
                    </span>
                    <div className="w-full h-36 rounded-2xl overflow-hidden border border-gray-200">
                      <img src={order.basketImage} alt="ตะกร้าผ้า" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* โหมด 2: ประวัติเสร็จสิ้น (ใบเสร็จรับเงิน) */}
          {isCompleted && (
            <>
              {/* กล่องใบเสร็จ */}
              <div style={{ backgroundColor: '#ffffff', color: '#0f172a' }} className="rounded-3xl p-6 border border-gray-100 shadow-sm">
                
                {/* Header สำเร็จ + ยอดเงิน */}
                <div className="flex flex-col items-center text-center pb-5 border-b border-dashed border-gray-200">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-2 shadow-inner">
                    <CheckCircle2 size={32} />
                  </div>
                  <span style={{ color: '#059669', backgroundColor: '#ecfdf5' }} className="text-xs font-bold px-3 py-1 rounded-full mb-1">
                    ส่งมอบผ้าสำเร็จเรียบร้อย
                  </span>
                  <h2 style={{ color: '#0f172a' }} className="font-bold text-3xl mt-2">
                    {order.totalPrice} ฿
                  </h2>
                  <p style={{ color: '#94a3b8' }} className="text-xs mt-1">
                    {order.completedAt}
                  </p>
                </div>

                {/* รายละเอียดเลขออเดอร์ & วันที่ & ช่องทางจ่ายเงิน */}
                <div className="py-4 border-b border-gray-100 text-xs flex flex-col gap-2.5">
                  <div className="flex justify-between items-center">
                    <span style={{ color: '#64748b' }} className="font-medium">หมายเลขคำสั่งซื้อ</span>
                    <button
                      type="button"
                      onClick={handleCopyOrderId}
                      style={{ color: '#1d61f2' }}
                      className="font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      #{order.id} {copied && <span style={{ color: '#10b981' }} className="text-[10px]">(คัดลอกแล้ว)</span>}
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: '#64748b' }} className="font-medium">วันที่ทำรายการ</span>
                    <span style={{ color: '#1e293b' }} className="font-semibold">{order.paymentDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: '#64748b' }} className="font-medium">ช่องทางชำระเงิน</span>
                    <span style={{ color: '#1e293b' }} className="font-semibold flex items-center gap-1.5">
                      <CreditCard size={14} className="text-[#1d61f2]" />
                      {order.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* รายการบริการ */}
                <div className="py-4 border-b border-gray-100 text-xs flex flex-col gap-2">
                  <span style={{ color: '#0f172a' }} className="font-bold text-sm mb-1">รายการบริการ</span>
                  <div className="flex justify-between items-start">
                    <div>
                      <p style={{ color: '#1e293b' }} className="font-bold text-xs">{order.serviceName}</p>
                      <p style={{ color: '#94a3b8' }} className="text-[11px] mt-0.5">แพ็กเกจ: {order.packageName}</p>
                    </div>
                    <span style={{ color: '#0f172a' }} className="font-bold text-xs">{order.unitPrice} ฿</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span style={{ color: '#64748b' }}>ค่าบริการรับ-ส่งถึงที่พัก</span>
                    <span style={{ color: '#059669' }} className="font-bold">ฟรีโปรโมชั่น</span>
                  </div>
                </div>

                {/* ยอดรวมสุทธิ */}
                <div className="pt-4 flex justify-between items-center text-sm">
                  <span style={{ color: '#0f172a' }} className="font-bold">ยอดรวมสุทธิ (Total)</span>
                  <span style={{ color: '#1d61f2' }} className="font-bold text-2xl">{order.totalPrice} ฿</span>
                </div>
              </div>

              {/* ข้อมูลการรับ-ส่งผ้า */}
              <div style={{ backgroundColor: '#ffffff', color: '#0f172a' }} className="rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col gap-3.5">
                <h3 style={{ color: '#0f172a' }} className="font-bold text-sm flex items-center gap-2">
                  <MapPin size={16} className="text-[#1d61f2]" />
                  ข้อมูลการรับ-ส่งผ้า
                </h3>
                <div className="text-xs flex flex-col gap-2.5">
                  <div style={{ backgroundColor: '#f8fafc' }} className="p-3 rounded-2xl">
                    <span style={{ color: '#94a3b8' }} className="text-[11px] block font-medium">จุดรับ-ส่งผ้า</span>
                    <p style={{ color: '#1e293b' }} className="font-bold mt-0.5">{order.address}</p>
                  </div>
                  <div className="flex items-center justify-between px-1">
                    <span style={{ color: '#64748b' }} className="font-medium">รอบเวลารับผ้า</span>
                    <span style={{ color: '#1e293b' }} className="font-semibold">{order.pickupTime}</span>
                  </div>
                  <div className="flex items-center justify-between px-1">
                    <span style={{ color: '#64748b' }} className="font-medium flex items-center gap-1">
                      <UserCheck size={14} className="text-[#1d61f2]" /> ผู้ดูแลการจัดส่ง
                    </span>
                    <span style={{ color: '#1e293b' }} className="font-semibold">{order.rider?.name || 'สมชาย คล่องแคล่ว'}</span>
                  </div>
                </div>

                {order.basketImage && (
                  <div className="pt-2 border-t border-gray-100">
                    <span style={{ color: '#334155' }} className="text-xs font-bold block mb-2 flex items-center gap-1.5">
                      <Camera size={14} className="text-[#1d61f2]" /> รูปถ่ายจุดวางตะกร้าผ้า
                    </span>
                    <div className="w-full h-40 rounded-2xl overflow-hidden border border-gray-200">
                      <img src={order.basketImage} alt="จุดวางตะกร้าผ้า" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}

                {order.note && (
                  <div style={{ backgroundColor: '#eff6ff', borderColor: '#dbeafe' }} className="p-3 rounded-2xl border flex items-start gap-2.5">
                    <FileText size={15} className="text-[#1d61f2] shrink-0 mt-0.5" />
                    <div>
                      <span style={{ color: '#1d61f2' }} className="text-[11px] font-bold block">หมายเหตุ</span>
                      <p style={{ color: '#334155' }} className="text-xs mt-0.5 leading-relaxed">{order.note}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          <div style={{ color: '#94a3b8' }} className="text-center py-2 text-xs font-medium">
            ขอบคุณที่ไว้วางใจใช้บริการ N&N Laundromat
          </div>

        </div>

        {/* ปุ่มด้านล่าง */}
        <div style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }} className="absolute bottom-0 left-0 right-0 border-t px-6 py-3.5 shadow-[0_-6px_20px_rgba(0,0,0,0.08)] flex gap-3 z-30">
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{ color: '#334155', borderColor: '#e2e8f0' }}
            className="flex-1 py-3.5 rounded-xl border font-bold text-xs hover:bg-gray-50 transition cursor-pointer"
          >
            ย้อนกลับ
          </button>
          
          {isCompleted ? (
            <button
             type="button"
             onClick={handleReorder}
             style={{ backgroundColor: '#1d61f2', color: '#ffffff' }}
             className="flex-1 py-3.5 rounded-xl font-bold text-xs tracking-wide shadow-md shadow-blue-500/20 active:scale-[0.98] transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <RotateCw size={14} />
             สั่งบริการนี้อีกครั้ง
</button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/home')}
              style={{ backgroundColor: '#1d61f2', color: '#ffffff' }}
              className="flex-1 py-3.5 rounded-xl font-bold text-xs tracking-wide shadow-md shadow-blue-500/20 active:scale-[0.98] transition cursor-pointer"
            >
              กลับสู่หน้าหลัก
            </button>
          )}
        </div>

      </div>
    </div>
  );
}