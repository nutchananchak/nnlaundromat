import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Navigation, 
  Camera, 
  Clock, 
  Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, setOrders } = useApp ? useApp() : {};
  const fileInputRef = useRef(null);

  const [activeRider] = useState(() => {
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

  const order = (orders || []).find((o) => String(o.id) === String(id));
  const [proofImage, setProofImage] = useState(order?.riderBasketImage || order?.proofImage || null);

  if (!activeRider) return null;

  if (!order) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f1f5f9'
      }}>
        <div className="bg-white p-6 rounded-2xl shadow-sm text-center max-w-xs mx-auto">
          <p className="text-gray-700 font-bold text-sm mb-4">ไม่พบข้อมูลออเดอร์นี้ในระบบ</p>
          <button
            onClick={() => navigate('/rider/tasks')}
            className="w-full py-2.5 bg-[#1d61f2] text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            กลับหน้ารายการงาน
          </button>
        </div>
      </div>
    );
  }

  const handleOpenGoogleMaps = () => {
    let mapsUrl = '';
    if (order.lat && order.lng) {
      mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${order.lat},${order.lng}`;
    } else {
      mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.address || '')}`;
    }
    window.open(mapsUrl, '_blank');
  };

  const handleImageCapture = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProofImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // เลื่อนสถานะงาน พร้อมบันทึกเวลาจริง และรูปถ่ายตะกร้าจากไรเดอร์
  const handleAdvanceStep = (nextStep, nextTitle) => {
    const now = new Date();
    const d = new Intl.DateTimeFormat('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }).format(now);
    const t = new Intl.DateTimeFormat('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false }).format(now);
    const realNowTimestamp = `${d}, ${t} น.`;

    const isDone = nextStep === 7;

    const updatedOrders = (orders || []).map((item) => {
      if (String(item.id) === String(order.id)) {
        return {
          ...item,
          statusStep: nextStep,
          statusTitle: nextTitle,
          status: isDone ? 'completed' : item.status,
          isCompleted: isDone,
          // บันทึกรูปถ่ายของไรเดอร์เข้า riderBasketImage เมื่อรับผ้า
          riderBasketImage: proofImage || item.riderBasketImage || null,
          proofImage: proofImage || item.proofImage || null,
          // บันทึกเวลาส่งมอบเฉพาะตอนที่ไรเดอร์กดยืนยัน Step 7 เท่านั้น
          deliveredAt: isDone ? realNowTimestamp : item.deliveredAt,
          deliveryRiderName: activeRider?.name || item.rider?.name || 'ไรเดอร์ประจำร้าน'
        };
      }
      return item;
    });

    if (setOrders) {
      setOrders(updatedOrders);
    }
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    if (isDone) {
      try {
        const currentNotices = JSON.parse(localStorage.getItem('customerNotifications') || '[]');
        const finishNotice = {
          id: Date.now(),
          orderId: order.id,
          title: 'ส่งมอบผ้าสะอาดเรียบร้อยแล้ว',
          message: `ออเดอร์ #${order.id} ได้รับการส่งมอบโดยคุณ ${activeRider?.name || 'ไรเดอร์'} เรียบร้อยแล้วเมื่อ ${realNowTimestamp}`,
          time: realNowTimestamp,
          type: 'success',
          isRead: false
        };
        localStorage.setItem('customerNotifications', JSON.stringify([finishNotice, ...currentNotices]));
      } catch (e) {
        // Storage fallback
      }
    }

    alert(`อัปเดตสถานะเป็น "${nextTitle}" เรียบร้อยแล้ว`);
    navigate('/rider/tasks');
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
        }} className="px-4 pt-5 pb-4 shadow-md flex items-center justify-between z-20">
          <button
            type="button"
            onClick={() => navigate('/rider/tasks')}
            className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="text-center">
            <h1 className="font-bold text-white text-base leading-normal">รายละเอียดงาน #{order.id}</h1>
            <span className="text-[11px] text-blue-100 block">{order.serviceName}</span>
          </div>
          <div className="w-8" />
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 pb-28">
          
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] text-gray-400 block font-medium">สถานะออเดอร์</span>
              <span className="text-sm font-bold text-[#1d61f2] leading-normal block pt-0.5">
                {order.statusTitle || 'รอการยืนยัน'}
              </span>
            </div>
            <span className="text-xs bg-blue-50 text-[#1d61f2] font-bold px-3 py-1 rounded-lg">
              ขั้นตอนที่ {order.statusStep || 2}/7
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <div>
                <span className="text-[11px] text-gray-400 block">ข้อมูลผู้รับบริการ</span>
                <span className="text-sm font-bold text-gray-800 leading-normal block pt-0.5">
                  {order.customerName || 'ลูกค้าทั่วไป'}
                </span>
              </div>
              {order.customerPhone && (
                <a
                  href={`tel:${order.customerPhone}`}
                  className="flex items-center gap-1.5 bg-blue-50 text-[#1d61f2] px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-blue-100"
                >
                  <Phone size={13} /> โทรออก
                </a>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock size={14} className="text-[#1d61f2] shrink-0" />
              <span>เวลานัดรับผ้า: {order.pickupTime || '-'}</span>
            </div>
            {order.note && (
              <div className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-100">
                <span className="font-bold">หมายเหตุลูกค้า: </span>{order.note}
              </div>
            )}
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
            <span className="text-xs font-bold text-gray-800">สถานที่รับ-ส่งผ้า</span>
            <div className="flex items-start gap-2 text-xs text-gray-600">
              <MapPin size={16} className="text-[#1d61f2] shrink-0 mt-0.5" />
              <span className="leading-normal">{order.address}</span>
            </div>

            <button
              type="button"
              onClick={handleOpenGoogleMaps}
              className="w-full py-2.5 bg-blue-50 text-[#1d61f2] hover:bg-blue-100 font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-blue-200 transition cursor-pointer"
            >
              <Navigation size={15} />
              เปิดนำทางด้วย Google Maps
            </button>
          </div>

          {/* อัปโหลดรูปภาพหลักฐานตะกร้าผ้าจากไรเดอร์ */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-800">รูปถ่ายยืนยันจุดรับผ้า / ตะกร้าผ้า</span>
              {proofImage && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-red-500 hover:text-red-600 text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={13} /> ลบรูป
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageCapture}
              style={{ display: 'none' }}
            />

            {proofImage ? (
              <div className="relative w-full h-44 rounded-xl overflow-hidden border border-gray-200 bg-black/5">
                <img
                  src={proofImage}
                  alt="Proof of work"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-28 border-2 border-dashed border-gray-200 hover:border-[#1d61f2] rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-[#1d61f2] transition cursor-pointer bg-gray-50/50"
              >
                <Camera size={26} />
                <span className="text-xs font-medium">กดเพื่อถ่ายภาพตะกร้าผ้าหน้างาน</span>
              </button>
            )}
          </div>

        </div>

        {/* Footer Actions ตาม Step */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex flex-col gap-2 z-20 shadow-lg">
          {Number(order.statusStep) === 3 && (
            <button
              type="button"
              onClick={() => handleAdvanceStep(4, 'รับผ้าเข้าสู่ร้านเรียบร้อย')}
              className="w-full py-3 rounded-xl bg-[#1d61f2] text-white font-bold text-xs shadow-md hover:bg-blue-700 cursor-pointer"
            >
              ยืนยันรับผ้าจากลูกค้า (นำส่งร้าน)
            </button>
          )}

          {Number(order.statusStep) === 4 && (
            <button
              type="button"
              onClick={() => handleAdvanceStep(5, 'ร้านกำลังดำเนินการซักอบ')}
              className="w-full py-3 rounded-xl bg-blue-800 text-white font-bold text-xs shadow-md hover:bg-blue-900 cursor-pointer"
            >
              ผ้าถึงร้านแล้ว (ส่งมอบแผนกซักอบ)
            </button>
          )}

          {Number(order.statusStep) === 6 && (
            <button
              type="button"
              onClick={() => handleAdvanceStep(7, 'จัดส่งผ้าคืนสำเร็จ')}
              className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md hover:bg-emerald-700 cursor-pointer"
            >
              ยืนยันส่งมอบผ้าคืนลูกค้าเรียบร้อย (จบงาน)
            </button>
          )}

          {Number(order.statusStep) >= 7 && (
            <div className="w-full py-3 text-center text-xs font-bold text-emerald-600 bg-emerald-50 rounded-xl">
              ออเดอร์นี้เสร็จสิ้นกระบวนการเรียบร้อยแล้ว {order.deliveredAt ? `(${order.deliveredAt})` : ''}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}