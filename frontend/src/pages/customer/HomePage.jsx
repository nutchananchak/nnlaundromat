import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  ChevronDown, 
  Layers, 
  BedDouble, 
  ShieldCheck, 
  Clock, 
  Bike, 
  Store, 
  Sparkles, 
  Truck, 
  CheckCircle2, 
  ChevronRight, 
  Plus, 
  Check, 
  X, 
  AlertTriangle, 
  Calendar,
  LogOut,
  PackageCheck,
  Flame,
  BadgeCheck,
  Camera,
  UploadCloud,
  Star
} from 'lucide-react';
import BottomNav from '../../components/layout/BottomNav';
import { useApp } from '../../context/AppContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { userProfile, addresses, selectedAddressId, setSelectedAddressId, currentAddress, activeOrder, setOrders } = useApp();
  const reUploadInputRef = useRef(null);

  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const [selectedService, setSelectedService] = useState('wash_dry_fold');

  const [reUploadSlip, setReUploadSlip] = useState(null);
  const [isSubmittingSlip, setIsSubmittingSlip] = useState(false);

  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [closedDates, setClosedDates] = useState([]);
  const [bannerIndex, setBannerIndex] = useState(0);

  useEffect(() => {
    const savedStoreStatus = localStorage.getItem('storeServiceStatus');
    if (savedStoreStatus !== null) {
      setIsStoreOpen(JSON.parse(savedStoreStatus));
    }

    const savedClosedDates = localStorage.getItem('closedDates');
    if (savedClosedDates) {
      try {
        setClosedDates(JSON.parse(savedClosedDates));
      } catch (e) {
        setClosedDates([]);
      }
    }
  }, []);

  const getThaiTimestamp = () => {
    const now = new Date();
    const d = new Intl.DateTimeFormat('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }).format(now);
    const t = new Intl.DateTimeFormat('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false }).format(now);
    return `${d}, ${t} น.`;
  };

  const formatOrderTimestamp = (timestamp) => {
    if (!timestamp || String(timestamp).includes('เพิ่งสร้าง') || String(timestamp).trim() === 'วันนี้') {
      const now = new Date();
      const d = new Intl.DateTimeFormat('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }).format(now);
      const t = new Intl.DateTimeFormat('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false }).format(now);
      return `${d}, ${t} น.`;
    }
    return timestamp;
  };

  const hasOngoingOrder = Boolean(
    activeOrder && 
    Number(activeOrder.statusStep) >= 1 && 
    Number(activeOrder.statusStep) < 7 &&
    !activeOrder.isCompleted
  );

  const isSlipRejected = Boolean(activeOrder && activeOrder.paymentRejected);

  useEffect(() => {
    if (isSlipRejected && activeOrder) {
      const realTimeNow = getThaiTimestamp();
      let currentNotices = [];
      try {
        currentNotices = JSON.parse(localStorage.getItem('customerNotifications') || '[]');
      } catch (e) {
        currentNotices = [];
      }

      const alreadyNotified = currentNotices.some(n => n.orderId === activeOrder.id && n.type === 'alert' && !n.isRead);

      if (!alreadyNotified) {
        const alertNotice = {
          id: Date.now(),
          orderId: activeOrder.id,
          title: 'สลิปการโอนเงินไม่ถูกต้อง',
          message: `ออเดอร์ #${activeOrder.id} ไม่ผ่านการตรวจสอบ: "${activeOrder.rejectReason || 'ยอดเงินไม่ตรง หรือสลิปไม่ชัดเจน'}" กรุณาแนบสลิปใหม่`,
          time: activeOrder.rejectedAt || realTimeNow,
          type: 'alert',
          isRead: false
        };
        localStorage.setItem('customerNotifications', JSON.stringify([alertNotice, ...currentNotices]));
      }
    }
  }, [isSlipRejected, activeOrder]);

  useEffect(() => {
    if (hasOngoingOrder) return;

    const timer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % 3);
    }, 30000);

    return () => clearInterval(timer);
  }, [hasOngoingOrder]);

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const isTodayClosed = closedDates.includes(todayStr);
  const isTomorrowClosed = closedDates.includes(tomorrowStr);
  const canBook = isStoreOpen && !isTodayClosed;

  const displayName = userProfile?.fullName || userProfile?.name || 'คุณลูกค้า';

  const steps = [
    { step: 1, label: 'ตรวจสอบยอด', icon: ShieldCheck },
    { step: 2, label: 'รอรับงาน', icon: Clock },
    { step: 3, label: 'กำลังมารับ', icon: Bike },
    { step: 4, label: 'นำส่งร้าน', icon: Store },
    { step: 5, label: 'กำลังซักอบ', icon: Sparkles },
    { step: 6, label: 'ส่งคืนผ้า', icon: Truck },
    { step: 7, label: 'สำเร็จ', icon: CheckCircle2 },
  ];

  const handleViewOrderStatus = () => {
    if (activeOrder) {
      navigate(`/orders/${activeOrder.id}`);
    }
  };

  const handleBookService = () => {
    if (!isStoreOpen) {
      alert('ขออภัย ขณะนี้ระบบปิดให้บริการชั่วคราว ไม่สามารถสร้างคำสั่งซื้อได้');
      return;
    }
    if (isTodayClosed) {
      alert('ขออภัย วันนี้เป็นวันหยุดประจำของทางร้าน งดให้บริการรับ-ส่งผ้า');
      return;
    }
    if (!currentAddress) {
      alert('กรุณาปักหมุดที่อยู่สำหรับจัดส่งผ้าในระบบก่อนทำรายการ');
      navigate('/profile');
      return;
    }

    navigate('/order/new', {
      state: {
        service: selectedService,
        address: currentAddress?.detail
      }
    });
  };

  const handleLogout = () => {
    if (window.confirm('คุณต้องการออกจากระบบหรือไม่?')) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userProfile');
      navigate('/login/customer', { replace: true });
    }
  };

  const handleSelectNewSlip = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReUploadSlip(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendNewSlip = () => {
    if (!reUploadSlip) {
      alert('กรุณาเลือกรูปภาพสลิปก่อนกดยืนยัน');
      return;
    }

    setIsSubmittingSlip(true);
    const nowTime = getThaiTimestamp();

    if (setOrders) {
      setOrders(prev => prev.map(o => {
        if (o.id === activeOrder.id) {
          return {
            ...o,
            slipImage: reUploadSlip,
            paymentSlip: reUploadSlip,
            paymentRejected: false,
            rejectReason: null,
            statusStep: 1,
            statusTitle: 'ส่งสลิปใหม่แล้ว รอแอดมินตรวจสอบ',
            reUploadedAt: nowTime
          };
        }
        return o;
      }));
    }

    try {
      const currentNotices = JSON.parse(localStorage.getItem('customerNotifications') || '[]');
      const clearedNotices = currentNotices.map(n => {
        if (n.orderId === activeOrder.id && n.type === 'alert') {
          return { ...n, isRead: true };
        }
        return n;
      });

      const newSuccessNotice = {
        id: Date.now(),
        orderId: activeOrder.id,
        title: 'แนบสลิปใหม่เรียบร้อยแล้ว',
        message: `ออเดอร์ #${activeOrder.id} ได้ส่งสลิปใหม่เมื่อ ${nowTime} กำลังรอทางร้านตรวจสอบยอดเงินอีกครั้ง`,
        time: nowTime,
        type: 'info',
        isRead: true
      };

      localStorage.setItem('customerNotifications', JSON.stringify([newSuccessNotice, ...clearedNotices]));
    } catch (e) {
      // Storage error handling
    }

    setReUploadSlip(null);
    setIsSubmittingSlip(false);
    alert('ส่งสลิปใหม่เรียบร้อยแล้ว ทางร้านจะเร่งตรวจสอบยอดเงินให้อีกครั้งครับ');
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

        {/* 1. Top Bar โทนเรียบ สุภาพ */}
        <div 
          style={{
            background: 'linear-gradient(135deg, #1d61f2 0%, #1045b8 100%)',
            boxShadow: '0 10px 25px rgba(29, 97, 242, 0.25)',
          }}
          className="rounded-b-3xl px-5 pt-6 pb-5 flex items-center justify-between shrink-0 z-20 text-white"
        >
          {/* หมุดเลือกสถานที่ส่งผ้า (แบบสีกลมกลืน) */}
          <div 
            onClick={() => {
              if (!addresses || addresses.length === 0) {
                navigate('/profile');
              } else {
                setShowAddressPicker(true);
              }
            }}
            className="flex items-center gap-2.5 cursor-pointer max-w-[290px] group"
          >
            <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 text-white flex items-center justify-center shrink-0 shadow-xs">
              <MapPin size={20} />
            </div>
            <div className="min-w-0">
              <span className="text-xs text-blue-200 font-bold tracking-wide uppercase block leading-none">
                ส่งผ้าที่
              </span>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-sm font-bold truncate text-white">
                  {currentAddress ? `${currentAddress.title} - ${currentAddress.detail}` : 'ยังไม่ระบุที่อยู่ (แตะเพื่อปักหมุด)'}
                </span>
                <ChevronDown size={16} className="text-blue-200 group-hover:text-white transition shrink-0" />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <button 
              type="button"
              onClick={handleLogout}
              className="w-10 h-10 rounded-2xl bg-white/15 hover:bg-red-500/90 text-white flex items-center justify-center transition cursor-pointer shadow-xs"
              title="ออกจากระบบ"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* 2. Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 pb-40 flex flex-col gap-4">

          {/* แจ้งเตือนสลิปไม่ผ่าน */}
          {isSlipRejected && (
            <div className="bg-red-50 border-2 border-red-300 rounded-3xl p-5 shadow-md flex flex-col gap-3.5 animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <AlertTriangle size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-black text-red-500 tracking-wider uppercase block">แจ้งเตือนด่วน</span>
                  <h3 className="text-base font-extrabold text-red-900 leading-tight mt-0.5">
                    สลิปการโอนเงินไม่ถูกต้อง
                  </h3>
                  <p className="text-xs text-red-700 mt-1 leading-relaxed">
                    <span className="font-bold">สาเหตุจากทางร้าน: </span>
                    {activeOrder.rejectReason || 'ยอดเงินไม่ตรง หรือภาพสลิปไม่ชัดเจน'}
                  </p>
                  {activeOrder.rejectedAt && (
                    <span className="text-[11px] text-red-400 font-medium block mt-1">
                      เวลาที่แจ้งเตือน: {activeOrder.rejectedAt}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/notifications')}
                className="self-start text-[11.5px] font-bold text-red-600 hover:text-red-800 flex items-center gap-1 -mt-1 cursor-pointer"
              >
                <span>ดูประวัติการแจ้งเตือนทั้งหมด</span>
                <ChevronRight size={14} />
              </button>

              <div className="pt-2 border-t border-red-200/80 flex flex-col gap-2.5">
                <input
                  ref={reUploadInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleSelectNewSlip}
                  style={{ display: 'none' }}
                />

                {reUploadSlip ? (
                  <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-red-200 bg-white shadow-xs">
                    <img src={reUploadSlip} alt="New slip preview" className="w-full h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => setReUploadSlip(null)}
                      className="absolute top-2 right-2 px-2.5 py-1 bg-slate-900/70 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      เปลี่ยนรูปใหม่
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => reUploadInputRef.current?.click()}
                    className="w-full py-3.5 rounded-2xl border-2 border-dashed border-red-300 hover:border-red-500 bg-white/80 text-red-600 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Camera size={18} /> กดเพื่อถ่ายภาพหรือแนบสลิปใหม่
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSendNewSlip}
                  disabled={!reUploadSlip || isSubmittingSlip}
                  className={`w-full py-3 rounded-2xl font-bold text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer ${
                    reUploadSlip && !isSubmittingSlip
                      ? 'bg-[#1d61f2] hover:bg-blue-700 text-white shadow-blue-500/20'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  <UploadCloud size={16} /> ส่งสลิปใหม่ให้ร้านตรวจสอบอีกครั้ง
                </button>
              </div>
            </div>
          )}

          {/* การ์ดทักทาย & เวลาบริการ */}
          <div className="bg-gradient-to-br from-[#1d61f2] to-[#1447b8] rounded-3xl p-5 text-white shadow-lg shadow-blue-600/15 flex items-center justify-between">
            <div>
              <span className="text-xs text-blue-200 font-medium block">ยินดีต้อนรับ, </span>
              <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
                คุณ {displayName}
              </h2>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-xs text-blue-100 font-bold mt-2.5">
                <Clock size={14} className="text-sky-300" />
                รับ-ส่งวันเดียวกัน เปิด 08:00 - ปิด 22:00 น.
              </span>
            </div>
            <div className="w-13 h-13 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 ml-2 shadow-xs">
              <Sparkles size={28} className="text-blue-100" />
            </div>
          </div>

          {/* แจ้งเตือนร้านปิดชั่วคราว */}
          {!isStoreOpen && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 shadow-xs">
              <AlertTriangle size={22} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-sm font-bold text-red-800 block">ร้านปิดให้บริการชั่วคราว</span>
                <span className="text-xs text-red-600 block mt-1 leading-relaxed">
                  ขณะนี้ระบบปิดรับออเดอร์ใหม่ชั่วคราวตามประกาศของผู้ดูแลระบบ
                </span>
              </div>
            </div>
          )}

          {/* แจ้งเตือนวันนี้เป็นวันหยุด */}
          {isTodayClosed && isStoreOpen && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 shadow-xs">
              <AlertTriangle size={22} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-sm font-bold text-red-800 block">วันนี้ร้านหยุดให้บริการ</span>
                <span className="text-xs text-red-600 block mt-1 leading-relaxed">
                  วันนี้ ({todayStr}) ร้านปิดประจำวัน ขออภัยในความไม่สะดวก
                </span>
              </div>
            </div>
          )}

          {/* แจ้งเตือนล่วงหน้า 1 วัน */}
          {isTomorrowClosed && isStoreOpen && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 shadow-xs">
              <Calendar size={22} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-sm font-bold text-amber-800 block">แจ้งเตือนวันหยุดบริการล่วงหน้า</span>
                <span className="text-xs text-amber-700 block mt-1 leading-relaxed">
                  วันพรุ่งนี้ ({tomorrowStr}) ร้านจะหยุดให้บริการ 1 วัน โปรดสั่งซักและรับผ้าคืนภายในวันนี้ก่อน 22:00 น.
                </span>
              </div>
            </div>
          )}

          {/* ส่วนแสดงสถานะผ้า / Smart Banner */}
          {hasOngoingOrder ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-base text-slate-800">ติดตามสถานะผ้า</span>
                <span className="text-xs font-bold text-[#1d61f2] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  #{activeOrder.id}
                </span>
              </div>

              <div
                onClick={handleViewOrderStatus}
                className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs hover:border-blue-200 transition cursor-pointer flex flex-col gap-3.5"
              >
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <h3 className="font-bold text-base text-[#1d61f2]">
                      {activeOrder.statusTitle}
                    </h3>
                    <ChevronRight size={18} className="text-[#1d61f2]" />
                  </div>
                  
                  <span className="text-xs text-slate-500 block mt-1 font-medium">
                    สร้างคำสั่งซื้อเมื่อ: {formatOrderTimestamp(activeOrder.createdAt)}
                  </span>
                </div>

                <div className="flex items-start justify-between relative mt-2 px-1">
                  <div className="absolute top-4 left-4 right-4 h-1 bg-slate-100 -z-0">
                    <div 
                      className="h-full bg-[#1d61f2] transition-all duration-500"
                      style={{ width: `${((activeOrder.statusStep - 1) / (steps.length - 1)) * 100}%` }}
                    />
                  </div>

                  {steps.map((item) => {
                    const Icon = item.icon;
                    const isPassed = item.step <= activeOrder.statusStep;
                    const isCurrent = item.step === activeOrder.statusStep;

                    return (
                      <div key={item.step} className="flex flex-col items-center z-10 w-9 text-center">
                        <div 
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isCurrent
                              ? 'bg-[#1d61f2] text-white ring-4 ring-blue-100 scale-110 shadow-sm'
                              : isPassed
                              ? 'bg-[#1d61f2] text-white'
                              : 'bg-white text-slate-400 border border-slate-200'
                          }`}
                        >
                          <Icon size={14} />
                        </div>
                        <span className={`text-[9px] mt-1.5 font-bold ${
                          isCurrent ? 'text-[#1d61f2]' : isPassed ? 'text-slate-700' : 'text-slate-400'
                        }`}>
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-4.5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[195px] transition-all">
              {bannerIndex === 0 && (
                <div className="w-full">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1d61f2] flex items-center justify-center shrink-0">
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-800 leading-tight">ส่งผ้าง่ายๆ ใน 3 ขั้นตอน</h3>
                      <span className="text-[11px] text-slate-400 font-medium">สะดวก รวดเร็ว ไม่ต้องเดินทาง</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center w-full">
                    <div className="flex flex-col items-center py-2.5 px-1 rounded-2xl bg-blue-50/60 border border-blue-100/60">
                      <div className="w-7 h-7 rounded-lg bg-white shadow-xs text-[#1d61f2] flex items-center justify-center font-black text-xs mb-1">
                        1
                      </div>
                      <span className="font-bold text-xs text-slate-800">สั่งซักผ้า</span>
                      <span className="text-[10px] text-slate-500 mt-0.5">เลือกบริการ</span>
                    </div>

                    <div className="flex flex-col items-center py-2.5 px-1 rounded-2xl bg-blue-50/60 border border-blue-100/60">
                      <div className="w-7 h-7 rounded-lg bg-white shadow-xs text-[#1d61f2] flex items-center justify-center font-black text-xs mb-1">
                        2
                      </div>
                      <span className="font-bold text-xs text-slate-800">ไรเดอร์รับ</span>
                      <span className="text-[10px] text-slate-500 mt-0.5">ถึงหน้าห้องพัก</span>
                    </div>

                    <div className="flex flex-col items-center py-2.5 px-1 rounded-2xl bg-blue-50/60 border border-blue-100/60">
                      <div className="w-7 h-7 rounded-lg bg-white shadow-xs text-[#1d61f2] flex items-center justify-center font-black text-xs mb-1">
                        3
                      </div>
                      <span className="font-bold text-xs text-slate-800">รับผ้าสะอาด</span>
                      <span className="text-[10px] text-slate-500 mt-0.5">พับหอมพร้อมใส่</span>
                    </div>
                  </div>
                </div>
              )}

              {bannerIndex === 1 && (
                <div className="w-full">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-800 leading-tight">มาตรฐานความสะอาดสูงสุด</h3>
                      <span className="text-[11px] text-slate-400 font-medium">มั่นใจได้ทุกครั้งที่ส่งซักกับ N&amp;N</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center w-full">
                    <div className="flex flex-col items-center py-2.5 px-1 rounded-2xl bg-emerald-50/60 border border-emerald-100/60">
                      <PackageCheck size={20} className="text-emerald-600 mb-1" />
                      <span className="font-bold text-xs text-slate-800">1 ตู้ 1 คน</span>
                      <span className="text-[10px] text-slate-500 mt-0.5">ไม่ซักปนใคร</span>
                    </div>

                    <div className="flex flex-col items-center py-2.5 px-1 rounded-2xl bg-emerald-50/60 border border-emerald-100/60">
                      <Flame size={20} className="text-emerald-600 mb-1" />
                      <span className="font-bold text-xs text-slate-800">อบฆ่าเชื้อ</span>
                      <span className="text-[10px] text-slate-500 mt-0.5">กำจัดไรฝุ่น</span>
                    </div>

                    <div className="flex flex-col items-center py-2.5 px-1 rounded-2xl bg-emerald-50/60 border border-emerald-100/60">
                      <BadgeCheck size={20} className="text-emerald-600 mb-1" />
                      <span className="font-bold text-xs text-slate-800">พับแพ็กดี</span>
                      <span className="text-[10px] text-slate-500 mt-0.5">ถุงกันฝุ่น</span>
                    </div>
                  </div>
                </div>
              )}

              {bannerIndex === 2 && (
                <div className="w-full">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <Truck size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-800 leading-tight">Same-Day Delivery</h3>
                      <span className="text-[11px] text-slate-400 font-medium">ส่งคืนผ้าสะอาดภายในวันเดียวกัน</span>
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50/60 border border-purple-100/70 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white text-purple-600 flex items-center justify-center shadow-xs shrink-0">
                        <Truck size={18} />
                      </div>
                      <div className="min-w-0 pr-1">
                        <span className="text-xs font-bold text-slate-800 block">สั่งซักวันนี้ รับคืนวันนี้ทันที</span>
                        <span className="text-[10.5px] text-slate-500 block mt-0.5">ไม่ต้องรอนานหลายวัน ผ้าแห้งสนิท</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-purple-700 bg-white px-2 py-1 rounded-lg shadow-2xs shrink-0">
                      วันเดียวจบ
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center gap-1.5 pt-2.5 mt-2 border-t border-slate-100">
                {[0, 1, 2].map((idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setBannerIndex(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      bannerIndex === idx ? 'w-6 bg-[#1d61f2]' : 'w-2 bg-slate-200 hover:bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* เลือกแพ็กเกจบริการ */}
          <div>
            <span className="font-bold text-base text-slate-800 block mb-3">เลือกแพ็กเกจบริการ</span>
            
            <div className="grid grid-cols-2 gap-3.5">
              <div
                onClick={() => setSelectedService('wash_dry_fold')}
                className={`p-5 rounded-3xl border flex flex-col items-center justify-center text-center cursor-pointer transition relative ${
                  selectedService === 'wash_dry_fold'
                    ? 'bg-blue-50/70 border-[#1d61f2] shadow-sm'
                    : 'bg-white border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="absolute -top-2.5 right-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                  <Star size={11} className="fill-amber-200 text-amber-200" />
                  <span>ยอดฮิต</span>
                </div>
                <div className={`w-13 h-13 rounded-2xl flex items-center justify-center mb-2.5 ${
                  selectedService === 'wash_dry_fold' ? 'bg-[#1d61f2] text-white' : 'bg-blue-50 text-[#1d61f2]'
                }`}>
                  <Layers size={26} />
                </div>
                <span className="font-bold text-sm text-slate-900">ซัก อบ พับ</span>
                <span className="text-xs font-semibold text-slate-500 mt-1">เริ่มต้น 160฿</span>
              </div>

              <div
                onClick={() => setSelectedService('bedding')}
                className={`p-5 rounded-3xl border flex flex-col items-center justify-center text-center cursor-pointer transition relative ${
                  selectedService === 'bedding'
                    ? 'bg-blue-50/70 border-[#1d61f2] shadow-sm'
                    : 'bg-white border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className={`w-13 h-13 rounded-2xl flex items-center justify-center mb-2.5 ${
                  selectedService === 'bedding' ? 'bg-[#1d61f2] text-white' : 'bg-blue-50 text-[#1d61f2]'
                }`}>
                  <BedDouble size={26} />
                </div>
                <span className="font-bold text-sm text-slate-900">ชุดเครื่องนอน/แยกชิ้น</span>
                <span className="text-xs font-semibold text-slate-500 mt-1">เริ่มต้น 10฿</span>
              </div>
            </div>
          </div>

          {/* ปุ่มจองบริการ */}
          <button
            type="button"
            onClick={handleBookService}
            disabled={!canBook}
            className={`w-full py-4 rounded-2xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer ${
              canBook
                ? 'bg-[#1d61f2] text-white hover:bg-blue-700 active:scale-[0.99] shadow-blue-500/20'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            {!isStoreOpen 
              ? 'ร้านปิดให้บริการชั่วคราว' 
              : isTodayClosed 
              ? 'วันนี้เป็นวันหยุดของทางร้าน' 
              : 'จองบริการนี้'}
          </button>

        </div>

        {/* Modal เลือกที่อยู่ */}
        {showAddressPicker && (
          <div className="absolute inset-0 bg-slate-900/50 z-50 flex items-end justify-center backdrop-blur-xs">
            <div className="bg-white w-full max-w-[430px] rounded-t-3xl p-5 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-[#1d61f2]" />
                  <span className="font-bold text-base text-slate-800">เลือกสถานที่รับ-ส่งผ้า</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddressPicker(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-2.5">
                {addresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => {
                        setSelectedAddressId(addr.id);
                        setShowAddressPicker(false);
                      }}
                      className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                        isSelected
                          ? 'bg-blue-50/70 border-[#1d61f2]'
                          : 'bg-white border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className="min-w-0 pr-3">
                        <span className="font-bold text-sm text-slate-800 block">{addr.title}</span>
                        <span className="text-xs text-slate-500 truncate block mt-1">{addr.detail}</span>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-[#1d61f2] text-white flex items-center justify-center shrink-0">
                          <Check size={14} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowAddressPicker(false);
                  navigate('/profile');
                }}
                className="w-full py-3 rounded-xl border border-dashed border-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition cursor-pointer"
              >
                <Plus size={16} /> จัดการ / เพิ่มหมุดที่อยู่ใหม่ในโปรไฟล์
              </button>
            </div>
          </div>
        )}

        <BottomNav />
      </div>
    </div>
  );
}